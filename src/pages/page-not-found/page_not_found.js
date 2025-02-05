import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <FlexWrapper>
        <Page404Title>404</Page404Title>
        <PageNotFoundText as='p'>
          The page you&#x2019;re looking for can&#x2019;t be found.
        </PageNotFoundText>
        <FlexWrapper>
          <LinkWrapper>
            <CustomLink to='/'>Go To Home</CustomLink>
          </LinkWrapper>
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
};

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Page404Title = styled.h1`
  color: #131313;
  font-size: 6em;
  font-family: 'Corbel Bold';
`;

const PageNotFoundText = styled.p`
  color: #131313;
  font-size: 1em;
  font-family: 'Corbel';
  @media screen and (min-width: 768px) {
    font-size: 1.2em;
  }
`;

const LinkWrapper = styled.div`
  padding: 8px;
  margin-bottom: 40px;
  font-family: 'Corbel';
  @media screen and (min-width: 360px) {
    padding: 16px;
  }
`;

const CustomLink = styled(Link)`
  text-decoration: none !important;
  font-weight: 600;
  color: #2e607a;

  :hover {
    color: #2e607a;
  }
`;

export default PageNotFound;
