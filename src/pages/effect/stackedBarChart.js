import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import data from '../../data/StackedBarChart.json';
import styled from 'styled-components';

function StackedBarChart() {
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
  const margin = { top: 60, right: 30, bottom: 30, left: 200 };

  const countryOptions = Object.keys(data).map(country => ({
    key: country,
    text: country,
    value: country
  }));

  useEffect(() => {
    if (!selectedCountries.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "6px")
      .style("font-size", "14px")
      .style("pointer-events", "none");

    const categories = ["Actual evapotranspiration", "Internal flow", "Total actual outflow", 
                       "Actual external inflow from neighbouring territories", "Precipitation"];
    
    const stackedData = d3.stack()
      .keys(categories)
      (selectedCountries.map(country => ({
        country,
        ...categories.reduce((acc, cat) => ({
          ...acc,
          [cat]: data[country][cat] || 0
        }), {})
      })));

    const xScale = d3.scaleBand()
      .domain(selectedCountries)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeTableau10);

    svg.selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => xScale(d.data.country))
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("width", xScale.bandwidth())
      .on("mouseover", (event, d) => {
        const category = d3.select(event.target.parentNode).datum().key;
        const value = (d[1] - d[0]).toFixed(2);
        tooltip
          .style("visibility", "visible")
          .html(`${category}<br/>Value: ${value}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(1000)
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    const legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(categories)
      .join("g")
      .attr("transform", (d, i) => `translate(${width - margin.right - 200},${margin.top + i * 20})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", colorScale);

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);

  }, [selectedCountries]);

  useEffect(() => {
    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, []);

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

export default StackedBarChart;