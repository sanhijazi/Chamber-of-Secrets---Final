import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../pics/Logo.png';
import { Link } from 'react-router-dom';

function Nav() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return (
    <Container>
    <Link to='/'>
      <FlexContainer>
      <Image src={Logo} alt='logo' />
      <LogoText>
        Chamber of Secrets
      </LogoText>
      </FlexContainer>
    </Link>
      <LinkContaienr>
        <CustomLink to='/Problem' >
          Problem
        </CustomLink>
        <CustomLink to='/Causes'>
          Causes
        </CustomLink>
        <CustomLink to='/Effect'>
          Effects
        </CustomLink>
        <CustomLink to='/initiative'>
          Initiatives
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

const LogoText = styled.div`
  font-family: Oswald;
  color: #000;
  width: 130px;
  line-height: 30px;
  font-size: 25px;
  font-style: normal;
  font-weight: 600;
`

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export default Nav;