import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import RadarChart from './radarChart';
import Description from '../../common/description';

function Problem() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Problem'} />
        <Header>
          Air emissions intensities by NACE Rev. 2 activity
        </Header>
        <Description>
          The data shows a decreasing trend in greenhouse gas emissions per euro of economic 
          activity across European countries from 2014 to 2023. It highlights differences between nations. This analysis 
          provides insights into the impact of energy policies and technological advancements on emissions reduction.
        </Description>
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