import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import StackedBarChart from './stackedBarChart';
import Map from './map';
import Description from '../../common/description';

function Effect() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Effect'} />
        <Header>
            Water resources: long-term annual average
        </Header>
        <Description>
          This visual represents freshwater resources,
          including evapotranspiration, internal flow, external inflow,
          and total availability. It shows water movement within and across territories.
          The stacked bar chart highlights the distribution and balance of these components.
        </Description>
        <StackedBarChart />
        <Header>
            Land use overview by NUTS 2 region 
        </Header>
        <Description>
          This represents land use by NUTS 2 regions across Europe, measured in square kilometers. It
          covers various regions in EU countries, showing total land area over time. The map projection will
          visualize the distribution and changes in land use across these regions.
        </Description>
        <Map />
    </Container>
    <Footer />
    </>
  )
}
const Container = styled.div`
    min-height: 100vh;
`;

export default Effect