import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/RadarChart.json';
import styled from 'styled-components';

function RadarChart() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const svgRef = useRef();
  const width = 600;
  const height = 600;
  const margin = 60;
  const radius = Math.min(width, height) / 2 - margin;

  const countryOptions = Object.keys(data).map(country => ({
    key: country,
    text: country,
    value: country
  }));

  const years = Object.keys(data[Object.keys(data)[0]]);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
  
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
  
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('padding', '5px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '3px')
      .style('pointer-events', 'none');
  
    const angleScale = d3.scalePoint()
      .domain(years)
      .range([0, 2 * Math.PI * (years.length - 1) / years.length]);
  
    const maxValue = selectedCountries.length > 0
      ? d3.max(selectedCountries, country =>
          d3.max(Object.values(data[country]))
        )
      : d3.max(Object.keys(data), country =>
          d3.max(Object.values(data[country]))
        );
  
    const radiusScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);
  
    const gridCircles = [0.2, 0.4, 0.6, 0.8, 1];
    gridCircles.forEach(d => {
      svg.append('circle')
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-dasharray', '4,4')
        .transition()
        .duration(1000)
        .attr('r', radius * d);
    });
  
    years.forEach(year => {
      const angle = angleScale(year);
      const lineEndX = radius * Math.cos(angle - Math.PI / 2);
      const lineEndY = radius * Math.sin(angle - Math.PI / 2);
  
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', '#ccc')
        .transition()
        .duration(1000)
        .attr('x2', lineEndX)
        .attr('y2', lineEndY);
  
      // Animate text labels
      svg.append('text')
        .attr('x', (radius + 20) * Math.cos(angle - Math.PI / 2))
        .attr('y', (radius + 20) * Math.sin(angle - Math.PI / 2))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('opacity', 0)
        .text(year)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    });
  
    const lineGenerator = d3.lineRadial()
      .angle(d => angleScale(d.year))
      .radius(d => radiusScale(d.value));
  
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
  
    selectedCountries.forEach((country, i) => {
      const countryData = years.map(year => ({
        year,
        value: data[country][year] || 0
      }));
  
      countryData.push(countryData[0]);
  
      const path = svg.append('path')
        .datum(countryData)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', colors(i))
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .attr('stroke-dasharray', function() {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr('stroke-dashoffset', function() {
          return this.getTotalLength();
        });
  
      path.transition()
        .duration(1500)
        .style('opacity', 1)
        .attr('stroke-dashoffset', 0);
  
      svg.selectAll(`.point-${i}`)
        .data(countryData.slice(0, -1))
        .join('circle')
        .attr('class', `point-${i}`)
        .attr('cx', d => radiusScale(d.value) * Math.cos(angleScale(d.year) - Math.PI / 2))
        .attr('cy', d => radiusScale(d.value) * Math.sin(angleScale(d.year) - Math.PI / 2))
        .attr('r', 0)
        .attr('fill', colors(i))
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 8);
          tooltip
            .style('visibility', 'visible')
            .html(`${country}<br>${d.year}: ${d.value}`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 5);
          tooltip.style('visibility', 'hidden');
        })
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr('r', 5);
  
      svg.append('circle')
        .attr('cx', -width / 2 + 20)
        .attr('cy', -height / 2 + 20 + (i * 20))
        .attr('r', 0)
        .attr('fill', colors(i))
        .transition()
        .duration(500)
        .attr('r', 6);
  
      svg.append('text')
        .attr('x', -width / 2 + 35)
        .attr('y', -height / 2 + 20 + (i * 20))
        .attr('dominant-baseline', 'middle')
        .style('opacity', 0)
        .text(country)
        .transition()
        .duration(500)
        .style('opacity', 1);
    });
  
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [selectedCountries]);

  return (
    <Container>
      <svg ref={svgRef}></svg>
      <LeftSection>
        <Label>
            Select Country
        </Label>
        <Dropdown
            placeholder="Select Countries"
            fluid
            multiple
            search
            selection
            options={countryOptions}
            onChange={(e, { value }) => setSelectedCountries(value)}
        />
        <Text>
            You Can add more countreis by selecting them from the dropdown
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
`;

const LeftSection = styled.div`
    padding: 50px;
    width: 400px;
    height: 400px;
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
export default RadarChart;