import React from 'react';
import Logo from '../pics/Logo.png';
import Background from '../pics/Background.svg';
import styled from 'styled-components';

function Banner({text}) {
  return (
    <Contaienr>
      <img src={Logo} alt='Logo' />
      {text}
    </Contaienr>
  )
}

const Contaienr = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    padding-top: 10vh;
    height: 500px;


    color: #F4EDED;
    font-family: Oswald;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;

    background-image: url(${Background});
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
`;
export default Banner