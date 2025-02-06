import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import Alluvial from './alluvial';
import BarChart from './barChart';
import LineChart from './lineChart';

function Initiative() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Initiative'}/>
        <Header>
            Air emissions intensities by NACE Rev. 2 activity
        </Header>
        <Alluvial />
        <Header>
            Electricity production capacities for renewables and wastes 
        </Header>
        <BarChart />
        <Header>
            Contribution to the international 100bn USD commitment on climate related expending (source: DG CLIMA, EIONET)
        </Header>
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