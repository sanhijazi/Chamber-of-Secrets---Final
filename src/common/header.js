import React from 'react';
import styled from 'styled-components';

function Header({children}) {
  return (
    <Container>
        {children}
    </Container>
  )
}

const Container = styled.div`
    padding: 20px 100px;
    color: #000;
    text-align: center;
    font-family: Oswald;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;
    background: #F9DB6D;
`;

export default Header