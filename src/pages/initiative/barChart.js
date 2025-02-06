import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/BarChart2.json';
import styled from 'styled-components';

function BarChart() {
  const [selectedYear, setSelectedYear] = useState('2020');
  const [selectedCategory, setSelectedCategory] = useState('Hydro');
  const svgRef = useRef();
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 30, bottom: 120, left: 60 };

  const years = Array.from(new Set(
    Object.values(data.Hydro).flatMap(country => Object.keys(country))
  )).sort();

  const categories = Object.keys(data);

  const yearOptions = years.map(year => ({
    key: year,
    text: year,
    value: year
  }));

  const categoryOptions = categories.map(category => ({
    key: category,
    text: category,
    value: category
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

    const categoryData = data[selectedCategory];
    const yearData = Object.entries(categoryData)
      .filter(([country, values]) => 
        values[selectedYear] !== undefined && 
        country !== "European Union - 27 countries (from 2020)" && 
        country !== "Euro area – 20 countries (from 2023)"
      )
      .map(([country, values]) => ({
        country,
        value: values[selectedYear]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const colorScale = d3.scaleSequential()
      .domain([d3.min(yearData, d => d.value), d3.max(yearData, d => d.value)])
      .interpolator(d3.interpolateViridis);

    const x = d3.scaleBand()
      .domain(yearData.map(d => d.country))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.value)])
      .range([height - margin.top - margin.bottom, 0]);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat('')
      )
      .style('opacity', 0.1);

    g.selectAll('rect')
      .data(yearData)
      .join(
        enter => enter.append('rect')
          .attr('x', d => x(d.country))
          .attr('width', x.bandwidth())
          .attr('y', y(0))
          .attr('height', 0)
          .attr('fill', d => colorScale(d.value))
          .attr('opacity', 0.8)
          .call(enter => enter
            .transition()
            .duration(1000)
            .delay((d, i) => i * 100)
            .ease(d3.easeCubicOut)
            .attr('y', d => y(d.value))
            .attr('height', d => height - margin.top - margin.bottom - y(d.value))
          ),
        update => update
          .call(update => update
            .transition()
            .duration(1000)
            .attr('y', d => y(d.value))
            .attr('height', d => height - margin.top - margin.bottom - y(d.value))
            .attr('fill', d => colorScale(d.value))
          ),
        exit => exit
          .call(exit => exit
            .transition()
            .duration(500)
            .attr('height', 0)
            .attr('y', y(0))
            .remove()
          )
      )
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', `scale(1, 1.01)`);
        
        d3.select('#tooltip')
          .style('visibility', 'visible')
          .html(`
            <strong>${d.country}</strong><br/>
            Value: ${d3.format(",")(Math.round(d.value))} MW
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1, 1)');
        
        d3.select('#tooltip')
          .style('visibility', 'hidden');
      });

    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style('opacity', 0);

    xAxis.selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    xAxis.transition()
      .duration(1000)
      .style('opacity', 1);

    const yAxis = g.append('g')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => d3.format(",")(d) + " MW"));

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left - 10)
      .attr('x', -(height - margin.top - margin.bottom) / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Megawatts (MW)');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(`Top 10 Countries in ${selectedYear} - ${selectedCategory}`)
      .transition()
      .duration(1000)
      .style('opacity', 1);

  }, [selectedYear, selectedCategory]);

  return (
    <Container>
      <svg style={{overflow: 'visible'}} ref={svgRef}></svg>
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
        <Label style={{ marginTop: '20px' }}>
          Select Category
        </Label>
        <Dropdown
          placeholder="Select Category"
          fluid
          selection
          options={categoryOptions}
          value={selectedCategory}
          onChange={(e, { value }) => setSelectedCategory(value)}
        />
        <Text>
          Showing top 10 countries for the selected year and category
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

export default BarChart;