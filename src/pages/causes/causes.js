import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import HeatMap from './heatmap';
import BarChart from './barChart';

function Causes() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Causes'} />
        <Header>
            Final energy consumption in transport by type of fuel
        </Header>
        <HeatMap />
        <Header>
            Management of waste excluding major mineral waste, by waste management operations
        </Header>
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