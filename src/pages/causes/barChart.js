import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/BarChartJson.json';
import styled from 'styled-components';

function BarChart() {
  const [selectedYear, setSelectedYear] = useState('2020');
  const svgRef = useRef();
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 30, bottom: 30, left: 200 };

  const years = Array.from(new Set(
    Object.values(data).flatMap(country => Object.keys(country))
  )).sort();

  const yearOptions = years.map(year => ({
    key: year,
    text: year,
    value: year
  }));

  useEffect(() => {
    if (!d3.select('#tooltip').size()) {
      d3.select('body').append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px');
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const yearData = Object.entries(data)
      .filter(([country, values]) => values[selectedYear] !== undefined)
      .map(([country, values]) => ({
        country,
        value: values[selectedYear]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const colorScale = d3.scaleSequential()
      .domain([d3.min(yearData, d => d.value), d3.max(yearData, d => d.value)])
      .interpolator(d3.interpolateViridis);

    const x = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.value)])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .domain(yearData.map(d => d.country))
      .range([0, height - margin.top - margin.bottom])
      .padding(0.2);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('rect')
      .data(yearData)
      .join(
        enter => enter.append('rect')
          .attr('y', d => y(d.country))
          .attr('height', y.bandwidth())
          .attr('x', 0)
          .attr('width', 0)
          .attr('fill', d => colorScale(d.value))
          .attr('opacity', 0.8)
          .call(enter => enter
            .transition()
            .duration(1000)
            .delay((d, i) => i * 100)
            .ease(d3.easeCubicOut)
            .attr('width', d => x(d.value))
          ),
        update => update
          .call(update => update
            .transition()
            .duration(1000)
            .attr('width', d => x(d.value))
            .attr('fill', d => colorScale(d.value))
          ),
        exit => exit
          .call(exit => exit
            .transition()
            .duration(500)
            .attr('width', 0)
            .remove()
          )
      )
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', 'scale(1.01)');
        
        d3.select('#tooltip')
          .style('visibility', 'visible')
          .html(`
            <strong>${d.country}</strong><br/>
            Value: ${d3.format(",")(Math.round(d.value))} tons
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1)');
        
        d3.select('#tooltip')
          .style('visibility', 'hidden');
      });

    g.selectAll('.country-label')
      .data(yearData)
      .join('text')
      .attr('class', 'country-label')
      .attr('y', d => y(d.country) + y.bandwidth() / 2)
      .attr('x', -10)
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('opacity', 0)
      .text(d => d.country)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .style('opacity', 1);

    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .style('opacity', 0)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d => `${d3.format(",")(d)} tons`)
        .tickSize(-height + margin.top + margin.bottom))
      .call(g => g.select('.domain').remove());

    xAxis.selectAll('.tick line')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-dasharray', '2,2');

    xAxis.transition()
      .duration(1000)
      .style('opacity', 0.5);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(`Top 10 Countries in ${selectedYear}`)
      .transition()
      .duration(1000)
      .style('opacity', 1);

  }, [selectedYear]);

  return (
    <Container>
      <svg ref={svgRef}></svg>
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
          Showing top 10 countries for the selected year
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

const TooltipStyle = styled.div`
  position: absolute;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  pointer-events: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default BarChart;