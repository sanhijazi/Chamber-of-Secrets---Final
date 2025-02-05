import React from 'react';
import styled from 'styled-components';
import Nav from '../../common/nav';
import Footer from '../../common/footer';
import Banner from '../../common/banner';
import Header from '../../common/header';
import StackedBarChart from './stackedBarChart';

function Effect() {
  return (
    <>
    <Nav />
    <Container>
        <Banner text={'Effect'} />
        <Header>
            Water resources: long-term annual average
        </Header>
        <StackedBarChart />
    </Container>
    <Footer />
    </>
  )
}
const Container = styled.div`
    min-height: 100vh;
`;

export default Effect