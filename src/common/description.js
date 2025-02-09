import React from 'react'
import styled from 'styled-components'

function Description({children}) {
  return (
    <DescriptionText>{children}</DescriptionText>
  )
}

const DescriptionText = styled.div`
    color: #000;
    text-align: center;
    font-family: Oswald;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;
    border-radius: 15px;
    padding: 50px 15vw;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;


export default Description