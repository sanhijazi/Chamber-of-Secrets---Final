import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/BarChart2.json';
import styled from 'styled-components';

function LineChart() {
  const [selectedCountry, setSelectedCountry] = useState('Lithuania');
  const svgRef = useRef();
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 30, bottom: 120, left: 60 };

  // Get unique countries across all categories
  const countries = Array.from(new Set(
    Object.values(data).flatMap(categoryData => Object.keys(categoryData))
  )).sort();

  const countryOptions = countries.map(country => ({
    key: country,
    text: country,
    value: country
  }));

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const years = Array.from(new Set(
      Object.values(data.Hydro).flatMap(country => Object.keys(country))
    )).sort();

    // Prepare data for selected country
    const lineData = {
      country: selectedCountry,
      values: years.map(year => {
        let total = 0;
        Object.keys(data).forEach(category => {
          if (data[category][selectedCountry] && data[category][selectedCountry][year]) {
            total += data[category][selectedCountry][year];
          }
        });
        return { year, value: total };
      })
    };

    // Set up scales
    const xScale = d3.scalePoint()
      .domain(years)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(lineData.values, d => d.value)])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value));

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 40)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Million Euro");

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("padding", "10px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Add line with animation
    const path = svg.append("path")
      .datum(lineData.values)
      .attr("fill", "none")
      .attr("stroke", "#2196F3")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add animation to the line
    const pathLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // Add dots with hover effects and tooltip
    svg.selectAll("circle")
      .data(lineData.values)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.value))
      .attr("r", 0) // Start with radius 0 for animation
      .attr("fill", "#2196F3")
      .transition() // Add animation
      .duration(1000)
      .attr("r", 5);

    // Add hover interactions
    svg.selectAll("circle")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8);

        tooltip
          .style("opacity", 1)
          .html(`Year: ${d.year}<br>Value: ${d.value.toFixed(2)} Million Euro`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5);

        tooltip
          .style("opacity", 0);
      });

  }, [selectedCountry]);

  return (
    <Container>
      <svg style={{overflow: 'visible'}} ref={svgRef} width={width} height={height}></svg>
      <LeftSection>
        <Label>
          Select Country
        </Label>
        <Dropdown
          placeholder="Select Country"
          fluid
          selection
          options={countryOptions}
          value={selectedCountry}
          onChange={(e, { value }) => setSelectedCountry(value)}
        />
        <Text>
          Showing total energy production over years for {selectedCountry} in Million Euro
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

export default LineChart;