import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    background-color: black;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 80px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 20px;
    width: 40%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    color: red;
`;

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5
    },
    visible: {
        x: 0
    },
    exit: {
        x: -window.outerWidth - 5
    }
};

const offset = 6;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            setLeaving(true);
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        };
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader>
                : <>
                    <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type: "tween", duration: 1}} key={index}>
                                {data?.results.slice(1).slice(offset * index, offset * index + offset).map(movie => <Box key={movie.id} bgPhoto={makeImagePath(movie.backdrop_path, "w400")} />)}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>}
        </Wrapper>
    );
};

export default Home;