import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import Alluvial from './alluvial';
import BarChart from './barChart';
import LineChart from './lineChart';
import Description from '../../common/description';

function Initiative() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Initiative'}/>
        <Header>
            Air emissions intensities by NACE Rev. 2 activity
        </Header>
        <Description>
            This represents the energy taxes collected across various economic activities in Europe,
            measured in million euros. The data spans multiple years and includes taxes from EU member states and
            neighboring countries. The Stankey chart will visualize the tax distribution and trends over time for different regions.
        </Description>
        <Alluvial />
        <Header>
            Electricity production capacities for renewables and wastes 
        </Header>
        <Description>
            This data tracks the net maximum electrical capacity (MW) for renewable energy sources
            and waste from 2014 to 2023 across European countries. It highlights the capacity trends in hydro and other
            renewables. A bar chart will visualize these trends by country and year.
        </Description>
        <BarChart />
        <Header>
            Contribution to the international 100bn USD commitment on climate related expending (source: DG CLIMA, EIONET)
        </Header>
        <Description>
            This data tracks the annual contributions to the international $100bn USD climate funding
            commitment by the EU and its member countries from 2014 to 2023. It highlights financial commitments
            from key institutions like the European Commission and EIB. A line chart will visualize the trends over time.
        </Description>
        <LineChart />
    </Container>
    <Footer />
    </>
  )
}
const Container = styled.div`
    min-height: 100vh;
`;

export default Initiative