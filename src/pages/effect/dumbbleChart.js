import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/DumbbleChart.json';
import styled from 'styled-components';

function DumbbleChart() {
  const getTop5Countries = () => {
    return Object.entries(data)
      .map(([country, values]) => ({
        country,
        total: Object.values(values).reduce((sum, val) => sum + val, 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(item => item.country);
  };

  const [selectedCountries, setSelectedCountries] = useState(getTop5Countries());
  const svgRef = useRef();
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 30, bottom: 100, left: 80 };

  useEffect(() => {
    if (selectedCountries.length < 5) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '10px')
      .style('border', '1px solid black')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const chartData = selectedCountries.map(country => ({
      country,
      value2020: data[country]['2020'] || 0,
      value2023: data[country]['2023'] || 0
    }));

    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.country))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => Math.max(d.value2020, d.value2023))])
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat('')
      )
      .selectAll('line')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-dasharray', '4');

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    const groups = svg.selectAll('.dumbbell-group')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'dumbbell-group');

    groups.append('line')
      .attr('x1', d => xScale(d.country) + xScale.bandwidth() / 2)
      .attr('x2', d => xScale(d.country) + xScale.bandwidth() / 2)
      .attr('y1', d => yScale(d.value2020))
      .attr('y2', d => yScale(d.value2023))
      .attr('stroke', '#999')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');

    groups.append('circle')
      .attr('cx', d => xScale(d.country) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.value2020))
      .attr('r', 5)
      .attr('fill', 'blue')
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`${d.country} (2020): ${d.value2020.toFixed(2)} Thousand heads (animals)`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    groups.append('circle')
      .attr('cx', d => xScale(d.country) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.value2023))
      .attr('r', 5)
      .attr('fill', 'red')
      .on('mouseover', function(event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`${d.country} (2023): ${d.value2023.toFixed(2)} Thousand heads (animals)`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

  }, [selectedCountries]);

  const countryOptions = Object.keys(data).map(country => ({
    key: country,
    text: country,
    value: country
  }));

  return (
    <Container>
      <svg style={{overflow: 'visible'}} ref={svgRef} width={width} height={height}></svg>
      <LeftSection>
        <Label>
            Select Countries (minimum 5)
        </Label>
        <Dropdown
          placeholder="Select Countries"
          fluid
          multiple
          selection
          options={countryOptions}
          value={selectedCountries}
          onChange={(e, { value }) => {
            if (value.length >= 5) {
              setSelectedCountries(value);
            } else {
              e.preventDefault();
            }
          }}
        />
        <Text>
          Select countries to compare their water resources (minimum 5 countries required)
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

export default DumbbleChart;