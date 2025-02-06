import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import RadarChart from './radarChart';

function Problem() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Problem'} />
        <Header>
          Air emissions intensities by NACE Rev. 2 activity
        </Header>
        <RadarChart />
    </Container>
    <Footer />
    </>
  )
}
const Container = styled.div`
    min-height: 100vh;
`;

export default Problem