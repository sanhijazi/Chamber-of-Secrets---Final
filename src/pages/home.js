import React from 'react';
import Nav from '../common/nav';
import styled from 'styled-components';
import Background from '../pics/Background.svg';
import Logo from '../pics/Logo.png';
import Lines from '../pics/Lines.jpg';
import Footer from '../common/footer';

function Home() {
  return (
    <>
        <Nav/>
        <Container>
            <p>
                Explore climate change through data uncover its causes, impacts, and the fight for a sustainable future.
            </p>
        </Container>
        <BottomSeciton>
            <img src={Logo} alt='Logo'/>
            <Text>
                Climate change is a pressing global issue caused
                 by human activities, leading to rising temperatures,
                 extreme weather, and environmental degradation.
                 This website visualizes key data to highlight the problems,
                 causes, effects, and initiatives related to climate change,
                 helping to raise awareness and drive action.
            </Text>

            <Flex>
                <Card>
                    Problem
                </Card>
                <Card>
                    Causes
                </Card>
                <Card>
                    Effect
                </Card>
            </Flex>
        </BottomSeciton>
        <Footer />
    </>
  )
}


const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0px 15vw;

    color: #F4EDED;
    text-align: center;
    text-shadow: 0px 0px 3px #000;
    font-family: Oswald;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;

    height: 100vh;
    width: 100%;
    background-image: url(${Background});
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
`;

const BottomSeciton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding: 200px 15vw;
    width: 100%;
    min-height: 60vh;
    background: #F4EDED;
    box-shadow: 0px 0px 35px -6px rgba(0, 0, 0, 0.25) inset;
`;

const Text = styled.p`
    color: #877666;
    font-family: Poppins;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;  
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
`;

const Card = styled.div`
    display: flex;

    cursor: pointer;

    border-radius: 5px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 300px;

    color: #000;
    font-family: Oswald;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;

    background-image: url(${Lines});
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;
`;
export default Home