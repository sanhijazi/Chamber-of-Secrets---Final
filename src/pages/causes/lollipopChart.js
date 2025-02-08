import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/BarChartJson.json';
import styled from 'styled-components';

function LollipopChart() {
  const [selectedYear, setSelectedYear] = useState('2020');
  const svgRef = useRef();
  const tooltipRef = useRef();
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
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const yearData = Object.entries(data)
      .map(([country, values]) => ({
        country,
        value: values[selectedYear] || 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const y = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.value)])
      .range([height - margin.bottom, margin.top]);

    const x = d3.scaleBand()
      .domain(yearData.map(d => d.country))
      .range([margin.left, width - margin.right])
      .padding(1);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style('font-family', 'Poppins')
      .style('font-size', '12px')
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .style('font-family', 'Poppins')
      .style('font-size', '12px');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 100)
      .attr('x', -(height / 2))
      .attr('text-anchor', 'middle')
      .style('font-family', 'Poppins')
      .style('font-size', '14px')
      .text('Grams per kilometer');

    svg.selectAll('myline')
      .data(yearData)
      .join('line')
      .attr('x1', d => x(d.country))
      .attr('x2', d => x(d.country))
      .attr('y1', y(0))
      .attr('y2', d => y(d.value))
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 2);

    svg.selectAll('mycircle')
      .data(yearData)
      .join('circle')
      .attr('cx', d => x(d.country))
      .attr('cy', d => y(d.value))
      .attr('r', 6)
      .style('fill', '#69b3a2')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        const tooltip = d3.select(tooltipRef.current);
        const tooltipWidth = 120;
        const tooltipHeight = 40;
        
        const svgRect = svgRef.current.getBoundingClientRect();
        const circleX = x(d.country);
        const circleY = y(d.value);
        
        let tooltipX = circleX + svgRect.left - tooltipWidth/2;
        let tooltipY = circleY + svgRect.top - tooltipHeight - 10;

        tooltipX = Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, tooltipX));
        tooltipY = Math.max(10, Math.min(window.innerHeight - tooltipHeight - 10, tooltipY));

        tooltip
          .style('visibility', 'visible')
          .html(`${d.country}: ${d.value} g/km`)
          .style('left', `${tooltipX}px`)
          .style('top', `${tooltipY}px`);

        d3.select(this)
          .attr('r', 8)
          .style('fill', '#4a7c6f');
      })
      .on('mouseout', function() {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.style('visibility', 'hidden');
        d3.select(this)
          .attr('r', 6)
          .style('fill', '#69b3a2');
      });

  }, [selectedYear]);

  return (
    <Container>
      <svg style={{overflow: 'visible'}} ref={svgRef}></svg>
      <TooltipStyle ref={tooltipRef} />
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

// Update tooltip styling
const TooltipStyle = styled.div`
  position: fixed;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
`;

export default LollipopChart;