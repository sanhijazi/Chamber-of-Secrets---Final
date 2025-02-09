import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import styled from 'styled-components';
import alluvialData from '../../data/Alluvial.json';

function Alluvial() {
  const availableYears = Object.keys(alluvialData);
  
  const yearOptions = availableYears.map(year => ({
    key: year, 
    text: year, 
    value: year 
  }));

  const [selectedYear, setSelectedYear] = useState(availableYears[availableYears.length - 1]);
  const svgRef = useRef();
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 30, bottom: 30, left: 200 };

  useEffect(() => {
    if (!selectedYear) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');

    const allLinks = alluvialData[selectedYear];
    
    const countryTotals = {};
    allLinks.forEach(linkPair => {
      const country = linkPair[0].source;
      const value = parseFloat(linkPair[0].value) || 0;
      if (country !== "European Union - 27 countries (from 2020)") {
        countryTotals[country] = (countryTotals[country] || 0) + value;
      }
    });

    const top10Countries = Object.entries(countryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([country]) => country);

    const filteredLinkPairs = allLinks.filter(linkPair => 
      top10Countries.includes(linkPair[0].source)
    );

    const firstLayerLinks = filteredLinkPairs.map(linkPair => ({
      source: linkPair[0].source,
      target: linkPair[0].target,
      value: parseFloat(linkPair[0].value) || 0
    }));

    const secondLayerLinksMap = new Map();
    filteredLinkPairs.forEach(linkPair => {
      const key = `${linkPair[0].target}|||${linkPair[1].target}`;
      const value = parseFloat(linkPair[1].value) || 0;
      secondLayerLinksMap.set(key, (secondLayerLinksMap.get(key) || 0) + value);
    });

    const secondLayerLinks = Array.from(secondLayerLinksMap.entries()).map(([key, value]) => {
      const [source, target] = key.split('|||');
      return {
        source,
        target,
        value
      };
    });

    const links = [...firstLayerLinks, ...secondLayerLinks];

    const nodes = Array.from(
      new Set(
        links.flatMap(d => [d.source, d.target])
      )
    ).map(name => ({ 
      name,
      layer: name === "Total environmental taxes" || name === "Energy taxes" || name === "Transport taxes" ? 1 : 
             top10Countries.includes(name) ? 0 : 2
    }));

    const sankey = d3Sankey.sankey()
      .nodeId(d => d.name)
      .nodeWidth(15)
      .nodePadding(10)
      .nodeAlign(d3Sankey.sankeyJustify)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const sankeyData = sankey({
      nodes: nodes,
      links: links.map(d => ({
        source: nodes.find(n => n.name === d.source),
        target: nodes.find(n => n.name === d.target),
        value: d.value
      }))
    });

    const colorScale = d3.scaleOrdinal()
      .domain(['country', 'tax', 'sector'])
      .range([
        '#4287f5',  // Single blue color for all elements
        '#4287f5', 
        '#4287f5'
      ]);

    const svg = d3.select(svgRef.current);

    const links_g = svg.append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .join('path')
      .attr('d', d3Sankey.sankeyLinkHorizontal())
      .attr('stroke-width', d => Math.max(1, d.width))
      .style('fill', 'none')
      .style('stroke', d => {
        const gradientId = `gradient-${d.index}`;
        
        const gradient = svg.append('defs')
          .append('linearGradient')
          .attr('id', gradientId)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', d.source.x1)
          .attr('x2', d.target.x0);

        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', colorScale(d.source.layer === 0 ? 'country' : 
                                      d.source.layer === 1 ? 'tax' : 'sector'));

        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', colorScale(d.target.layer === 0 ? 'country' : 
                                       d.target.layer === 1 ? 'tax' : 'sector'));

        return `url(#${gradientId})`;
      })
      .attr('opacity', 0.5)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 0.8);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>From:</strong> ${d.source.name}<br/>
          <strong>To:</strong> ${d.target.name}<br/>
          <strong>Value:</strong> ${d.value.toFixed(2)} million euro
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.5);
        
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const nodeRects = svg.append('g')
      .selectAll('rect')
      .data(sankeyData.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => colorScale(d.layer === 0 ? 'country' : 
                                  d.layer === 1 ? 'tax' : 'sector'))
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);

        const incomingValue = d.targetLinks.reduce((sum, link) => sum + link.value, 0);
        const outgoingValue = d.sourceLinks.reduce((sum, link) => sum + link.value, 0);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>${d.name}</strong><br/>
          <strong>Incoming:</strong> ${incomingValue.toFixed(2)} million euro<br/>
          <strong>Outgoing:</strong> ${outgoingValue.toFixed(2)} million euro
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.8)
          .attr('stroke', 'none');
        
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    svg.append('g')
      .selectAll('text')
      .data(sankeyData.nodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.name)
      .style('font-size', '10px')
      .style('fill', '#2b2b2b');

    return () => {
      d3.select('.tooltip').remove();
    };

  }, [selectedYear]);

  return (
    <Container>
      <svg style={{overflow: 'visible'}} ref={svgRef} width={width} height={height}></svg>
      <LeftSection>
        <Label>
          Select Year
        </Label>
        <Dropdown
          placeholder="Select Year"
          fluid
          selection
          options={yearOptions}
          value={selectedYear}
          onChange={(e, { value }) => setSelectedYear(value)}
        />
        <Text>
          View environmental taxes flow between different sectors
        </Text>
      </LeftSection>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5vh 5vw;
    gap: 100px;
    position: relative;
`;

const LeftSection = styled.div`
    padding: 50px;
    width: 400px;
    min-height: 400px;
    border-radius: 15px;
    background: #F4EDED;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const Label = styled.div`
    color: #000;
    font-family: Poppins;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;  

const Text = styled.div`
    margin-top: 50px;
    color: rgba(0, 0, 0, 0.31);
    font-family: Poppins;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

export default Alluvial;