import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import * as d3 from 'd3';
import { geoConicConformalEurope } from 'd3-composite-projections';
import data from '../../data/Map.json';
import styled from 'styled-components';

function Map() {
  const [selectedYear, setSelectedYear] = useState("2018");
  const svgRef = useRef();
  const width = 650;
  const height = 650;

  const yearOptions = [
    { key: '2009', text: '2009', value: '2009' },
    { key: '2012', text: '2012', value: '2012' },
    { key: '2015', text: '2015', value: '2015' },
    { key: '2018', text: '2018', value: '2018' }
  ];

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const projection = geoConicConformalEurope()
      .scale(width * 1.2)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const values = Object.values(data)
      .map(region => region[selectedYear])
      .filter(value => value !== undefined && !isNaN(value));
    
    console.log("Available values range:", Math.min(...values), "to", Math.max(...values));

    const colorScale = d3.scaleQuantile()
      .domain(values)
      .range(d3.schemeGreens[9]);

    d3.json("/europe.geojson")
      .then(geoData => {
        console.log("First feature properties:", geoData.features[0].properties);
        
        svg.selectAll("path")
          .data(geoData.features)
          .join("path")
          .attr("d", pathGenerator)
          .attr("fill", d => {
            const possibleNames = [
              d.properties.name,
              d.properties.NAME,
              d.properties.Name,
              d.properties.ADMIN,
              d.properties.admin,
              d.properties.region,
              d.properties.NUTS_NAME,
              d.properties.CNTR_NAME
            ];

            for (let name of possibleNames) {
              if (name && data[name]) {
                const value = data[name][selectedYear];
                console.log("Match found:", name, value);
                return value ? colorScale(value) : "#ccc";
              }
            }

            console.log("No match found for region:", possibleNames[0]);
            return "#ccc";
          })
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => {
            const name = d.properties.name || d.properties.NAME || d.properties.NUTS_NAME;
            const value = data[name]?.[selectedYear];
            
            d3.select(event.currentTarget)
              .attr("stroke", "#000")
              .attr("stroke-width", 1.5)
              .transition()
              .duration(200)
              .attr("fill-opacity", 0.7);

            svg.selectAll(".tooltip").remove();
            
            const tooltip = svg.append("g")
              .attr("class", "tooltip")
              .style("pointer-events", "none");

            const mousePosition = d3.pointer(event);
            
            const tooltipText = tooltip.append("text")
              .attr("x", mousePosition[0] + 15)
              .attr("y", mousePosition[1] - 5)
              .attr("fill", "white")
              .attr("font-size", "12px")
              .text(`${name}: ${value ? `${value} km²` : 'No data'}`);

            const textWidth = tooltipText.node().getComputedTextLength();
            const padding = 20;

            tooltip.insert("rect", "text")
              .attr("x", mousePosition[0] + 10)
              .attr("y", mousePosition[1] - 25)
              .attr("width", textWidth + padding)
              .attr("height", 30)
              .attr("fill", "black")
              .attr("opacity", 0.8)
              .attr("rx", 5)
              .attr("ry", 5);

            tooltip.style("opacity", 0)
              .transition()
              .duration(200)
              .style("opacity", 1);
          })
          .on("mouseout", (event) => {
            d3.select(event.currentTarget)
              .attr("stroke", "#fff")
              .attr("stroke-width", 0.5)
              .transition()
              .duration(200)
              .attr("fill-opacity", 1);
            
            svg.selectAll(".tooltip")
              .transition()
              .duration(200)
              .style("opacity", 0)
              .remove();
          });

        const legendWidth = 300;
        const legendHeight = 10;
        const legendPosition = { x: 50, y: height - 50 };

        const legendScale = d3.scaleLinear()
          .domain(d3.extent(values))
          .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
          .ticks(5)
          .tickFormat(d => `${d3.format(".0f")(d)} km²`);

        const legend = svg.append("g")
          .attr("class", "legend")
          .attr("transform", `translate(${legendPosition.x}, ${legendPosition.y})`);

        legend.append("g")
          .call(legendAxis);

        const gradient = legend.append("defs")
          .append("linearGradient")
          .attr("id", "legend-gradient")
          .attr("x1", "0%")
          .attr("x2", "100%")
          .attr("y1", "0%")
          .attr("y2", "0%");

        gradient.selectAll("stop")
          .data(d3.range(9).map(i => ({
            offset: `${i * 100 / 8}%`,
            color: d3.schemeGreens[9][i]
          })))
          .enter()
          .append("stop")
          .attr("offset", d => d.offset)
          .attr("stop-color", d => d.color);

        legend.append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .attr("y", -legendHeight - 10)
          .style("fill", "url(#legend-gradient)");
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
      });

    return () => {
      d3.select("body").selectAll(".tooltip").remove();
    };
  }, [selectedYear]);

  return (
    <Container>
      <MapContainer>
        <svg ref={svgRef} width={width} height={height}></svg>
      </MapContainer>
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
          Select a year to view water resources across European regions
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

const MapContainer = styled.div`
    background: white;
    padding: 20px;
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

export default Map;