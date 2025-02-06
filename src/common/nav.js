import React from 'react';
import styled from 'styled-components';
import Logo from '../pics/Logo.png';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <Container>
    <Link to='/'>
      <Image src={Logo} alt='logo' />
    </Link>
      <LinkContaienr>
        <CustomLink to='/Problem' >
          Problem
        </CustomLink>
        <CustomLink to='/Causes'>
          Causes
        </CustomLink>
        <CustomLink to='/Effect'>
          Effect
        </CustomLink>
        <CustomLink to='/initiative'>
          Initiative
        </CustomLink>
      </LinkContaienr>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15vw;
  width: 100%;
  height: 100px;
  background-color: #F4EDED;
  z-index: 100;
`;

const Image = styled.img`
  height: 70px;
`

const LinkContaienr = styled.div`
  display: flex;
  gap: 100px;
`;

const CustomLink = styled(Link)`
  text-direction: none !important;
  cursor: pointer;
  color: #000;
  font-family: Oswald;
  font-size: 25px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: uppercase;
`

export default Nav;