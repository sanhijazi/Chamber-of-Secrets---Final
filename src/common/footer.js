import React from 'react';
import styled from 'styled-components';

function Footer() {
  return (
    <Container>This website was created with love by the team of the Chamber of Secrets</Container>
  )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    
    background-color: black;

    color: white;
    font-family: Oswald;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;

    height: 30vh;
    widht: 100%;
`;

export default Footer