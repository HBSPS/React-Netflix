import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
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

const Banner = styled.div<{ bgphoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto});
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
    padding: 0 60px;
`;

const Box = styled(motion.div) <{ bgphoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    cursor: pointer;

    &:first-child {
        transform-origin: center left;
    }

    &:last-child {
        transform-origin: center right;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0;
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;

    h4 {
        text-align: center;
        font-size: 18px;
    }
`;

const BigMovieInfo = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${(props) => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    font-size: 40px;
    font-weight: bold;
    position: relative;
    top: -85px;
    padding: 20px;
`;

const BigOverview = styled.p`
    padding: 20px;
    color: ${(props) => props.theme.white.lighter};
    position: relative;
    top: -85px;
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

const boxVariants = {
    normal: {
        scale: 1
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    }
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    }
};

const offset = 6;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);

    // 슬라이더 인덱스 증가
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

    // 박스 클릭 시 URL 변경
    const navigate = useNavigate();
    const onBoxClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };

    // 현재 URL 일치 여부 확인
    const bigMovieMatch = useMatch("/movies/:id");

    // 오버레이 클릭 감지
    const onOverlayClick = () => {
        navigate(-1);
    };

    // 사용자 스크롤 위치 파악
    const { scrollY } = useScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 100);

    // 클릭한 영화 상세정보 받아오기
    const clickedMovie = bigMovieMatch?.params.id && data?.results.find((movie) => movie.id === Number(bigMovieMatch.params.id));

    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader>
                : <>
                    <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type: "tween", duration: 1}} key={index}>
                                {data?.results.slice(1).slice(offset * index, offset * index + offset).map(movie =>
                                    <Box layoutId={movie.id+""} onClick={() => onBoxClick(movie.id)} key={movie.id} bgphoto={makeImagePath(movie.backdrop_path, "w400")} variants={boxVariants} transition={{ type: "tween" }} initial="normal" whileHover="hover">
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                )}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch
                            ? (
                                <>
                                    <Overlay onClick={onOverlayClick} animate={{opacity: 1}} exit={{opacity: 0}} />
                                    <BigMovieInfo layoutId={bigMovieMatch.params.id} style={{ top: setScrollY }}>
                                        {clickedMovie && (
                                            <>
                                                <BigCover style={{backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`}} />
                                                <BigTitle>{clickedMovie.title}</BigTitle>
                                                <BigOverview>{clickedMovie.overview}</BigOverview>
                                            </>
                                        )}
                                    </BigMovieInfo>
                                </>
                            ) : null
                        }
                    </AnimatePresence>
                </>}
        </Wrapper>
    );
};

export default Home;