import React, { useEffect, useRef } from 'react';
import Nav from '../common/nav';
import styled from 'styled-components';
import Background from '../pics/Background.svg';
import Logo from '../pics/Logo.png';
import Footer from '../common/footer';
import { useNavigate } from 'react-router-dom';

function ArrowIcon() {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="50" 
            height="50" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#877666" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
    );
}

function Home() {
    const navigate = useNavigate();
    const navigateTo = (path) => {
        navigate(path);
    }

    const cardData = [
        {
            title: 'Problem',
            path: '/problem',
            image: "https://images.pexels.com/photos/1694642/pexels-photo-1694642.jpeg",
            description: "Understand the global challenges posed by climate change and its far-reaching implications for our planet."
        },
        {
            title: 'Causes',
            path: '/causes',
            image: "https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg",
            description: "Explore the human activities and industrial processes that contribute to global warming and environmental degradation."
        },
        {
            title: 'Effect',
            path: '/effect',
            image: "https://images.pexels.com/photos/1198507/pexels-photo-1198507.jpeg",
            description: "Discover the wide-ranging impacts of climate change on ecosystems, weather patterns, and human societies."
        },
        {
            title: 'Initiative',
            path: '/initiative',
            image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg",
            description: "Learn about global and local efforts to mitigate climate change and promote sustainable practices."
        }
    ];

    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            cardRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

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
                <ArrowIcon />
                <Flex>
                    {cardData.map((card, index) => (
                        <CardContainer 
                            key={card.title} 
                            ref={(el) => cardRefs.current[index] = el}
                            index={index}
                        >
                            <CardDescription>
                                {card.description}
                            </CardDescription>
                            <Card 
                                onClick={() => navigateTo(card.path)} 
                                bgImage={card.image}
                            >
                                {card.title}
                            </Card>
                        </CardContainer>
                    ))}
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

    // New load animation for text
    p {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 1s ease-out forwards;
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
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
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 40px;
    justify-content: space-between;

    svg {
        transform: rotate(90deg);
    }
`;

const CardContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 40px;
    
    // New scroll animation styles
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.6s ease, transform 0.6s ease;

    // Visible state when scrolled into view
    &.visible {
        opacity: 1;
        transform: translateY(0);
    }

    // Staggered animation for each container
    ${props => props.index && `
        transition-delay: ${props.index * 0.2}s;
    `}
    
    &:nth-child(even) {
        flex-direction: row-reverse;
    }
`;

const CardDescription = styled.div`
    color: #877666;
    font-family: Poppins;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    flex: 1;
`;

const Card = styled.div`
    display: flex;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 300px;

    color: #000;
    font-family: Oswald;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    text-transform: uppercase;

    background-image: url(${props => props.bgImage});
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;

    // Hover effects only on the card itself
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.3);
    }

    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1;
    }

    &:hover::before {
        opacity: 1;
    }
    z-index: 2;
`;

export default Home