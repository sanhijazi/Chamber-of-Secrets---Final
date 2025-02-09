import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import HeatMap from './heatmap';
import BarChart from './barChart';
import LollipopChart from './lollipopChart';
import Description from '../../common/description';
function Causes() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Causes'} />
        <Header>
            Average CO2 emissions per km from new passenger cars
        </Header>
        <Description>
          Represent the average CO₂ emissions (g/km) of new passenger 
          cars per year. Until 2019, emissions were measured using the NEDC protocol, transitioning 
          to both NEDC and WLTP in 2020, and solely WLTP from 2021. The lollipop chart visualizes 
          trends and shifts in reported emissions over time.
        </Description>
        <LollipopChart />
        <Header>
            Final energy consumption in transport by type of fuel
        </Header>
        <Description>
          Visualizing final energy consumption in transport
          across various modes, including road, rail, domestic aviation, and navigation.
          It excludes international aviation, marine bunkers, and energy use in transport hubs.
          The heatmap visualizes energy distribution and trends across these transport sectors.
        </Description>
        <HeatMap />
        <Header>
            Management of waste excluding major mineral waste, by waste management operations
        </Header>
        <Description>
          The management of waste across various European countries. It tracks annual waste treatment volumes (in tonnes)
          by different management operations.
        </Description>
        <BarChart />
    </Container>
    <Footer />
    </>
  )
}
const Container = styled.div`
    min-height: 100vh;
`;

export default Causes