import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/HeatMapJson.json';
import styled from 'styled-components';

function HeatMap() {
  const initialCountries = Object.keys(data).slice(0, 5);
  const [selectedCountries, setSelectedCountries] = useState(initialCountries);
  const svgRef = useRef();
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 130, bottom: 30, left: 200 };

  const allValues = Object.values(data).flatMap(country => 
    Object.values(country).map(value => Number(value))
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const years = Array.from(new Set(
    Object.values(data).flatMap(country => Object.keys(country))
  )).sort();

  const countryOptions = Object.keys(data).map(country => ({
    key: country,
    text: country,
    value: country
  }));

  useEffect(() => {
    if (!selectedCountries.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const cellWidth = (width - margin.left - margin.right) / years.length;
    const cellHeight = Math.min(40, (height - margin.top - margin.bottom) / selectedCountries.length);

    const colorScale = d3.scaleSequential()
      .domain([minValue, maxValue])
      .interpolator(d3.interpolateYlOrRd);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const legendWidth = 20;
    const legendHeight = height - margin.top - margin.bottom;

    const legendScale = d3.scaleLinear()
      .range([legendHeight, 0])
      .domain([minValue, maxValue]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format('.2f'));

    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 10},${margin.top})`);

    const legendGradient = legend.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    legendGradient.selectAll('stop')
      .data(colorScale.ticks().map((t, i, n) => ({
        offset: `${100 * i / (n.length - 1)}%`,
        color: colorScale(t)
      })))
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    legend.append('g')
      .call(legendAxis);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none');

    g.append('g')
      .selectAll('text')
      .data(years)
      .enter()
      .append('text')
      .attr('x', (d, i) => i * cellWidth + cellWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .style('opacity', 0)
      .text(d => d)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50)
      .style('opacity', 1);

    const countryGroups = g.selectAll('.country-group')
      .data(selectedCountries)
      .enter()
      .append('g')
      .attr('class', 'country-group')
      .attr('transform', (d, i) => `translate(0,${i * cellHeight})`)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 100)
      .style('opacity', 1);

    countryGroups.selection().append('text')
      .attr('x', -10)
      .attr('y', cellHeight / 2)
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '12px')
      .text(d => d);

    countryGroups.selection().selectAll('rect')
      .data(d => years.map(year => ({
        country: d,
        year: year,
        value: data[d][year] || 0
      })))
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * cellWidth)
      .attr('y', 0)
      .attr('width', cellWidth - 1)
      .attr('height', cellHeight - 1)
      .attr('fill', '#eee')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#000')
          .attr('stroke-width', 2);

        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>${d.country}</strong><br/>
          Year: ${d.year}<br/>
          Value: ${d.value.toLocaleString()} tones
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 0);

        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr('fill', d => d.value ? colorScale(d.value) : '#eee');

    return () => {
      d3.select('.tooltip').remove();
    };

  }, [selectedCountries]);

  const handleCountryChange = (e, { value }) => {
    if (value.length < 5) {
      alert('Please select at least 5 countries');
      return;
    }
    setSelectedCountries(value);
  };

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
          value={selectedCountries}
          onChange={handleCountryChange}
          minSelections={5}
        />
        <Text>
          Please select at least 5 countries to compare
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
export default HeatMap;