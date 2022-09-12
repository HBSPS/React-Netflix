import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, API_KEY } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    background-color: black;
    width: 100vw;
    height: 100vh;
    margin-top: 200px;
`;

const Result = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 6fr);
    gap: 5px;
`;

const Box = styled(motion.div) <{ bgphoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    cursor: pointer;

    &:nth-child(6n-5) {
        transform-origin: center left;
    }

    &:nth-child(6n) {
        transform-origin: center right;
    }
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
        font-size: 15px;
        font-weight: bold;
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

const BigRate = styled.span`
    font-size: 20px;
    font-weight: bold;
    padding: 20px;
`;


const BigOverview = styled.p`
    padding: 20px;
    color: ${(props) => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0;
`;

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

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    const BASE_PATH = "https://api.themoviedb.org/3";

    async function searchResults() {
        const response = await fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&include_adult=true`);
        return await response.json();
    };

    const { data } = useQuery<IGetMoviesResult>(["search", "searchResults"], searchResults);
    
    // 박스 클릭 시 URL 변경
    const navigate = useNavigate();
    const onBoxClick = (movieId: number) => {
        navigate(`/search/${movieId}`);
    };

    // 현재 URL 일치 여부 확인
    const bigMovieMatch = useMatch("/search/:id");

    // 오버레이 클릭 감지
    const onOverlayClick = () => {
        navigate(-1);
    };

    // 사용자 스크롤 위치 파악
    const { scrollY } = useScroll();
    const setScrollY = useTransform(scrollY, (value) => value + 100);

    // 클릭한 영화 상세정보 받아오기
    const clickedMovie = bigMovieMatch?.params.id && (data?.results.find((data) => data.id === Number(bigMovieMatch.params.id)));


    return (
        <Wrapper>
            <AnimatePresence>
                <Result>
                    {data?.results.map((result) =>
                        result.backdrop_path ? <Box layoutId={result.id + "2"} onClick={() => onBoxClick(result.id)} key={result.id + "20"} bgphoto={makeImagePath(result.backdrop_path, "w400")} variants={boxVariants} transition={{ type: "tween" }} initial="normal" whileHover="hover">
                            <Info variants={infoVariants}>
                                <h4>{result.title || result.name}</h4>
                            </Info>
                        </Box> : null
                    )}
                </Result>
            </AnimatePresence>
            <AnimatePresence>
                {bigMovieMatch
                    ? (
                        <>
                            <Overlay onClick={onOverlayClick} animate={{opacity: 1}} exit={{opacity: 0}} />
                            <BigMovieInfo layoutId={bigMovieMatch.params.id} style={{ top: setScrollY }}>
                                {clickedMovie && (
                                    <>
                                        <BigCover style={{backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`}} />
                                        <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
                                        <BigRate>⭐{clickedMovie.vote_average}</BigRate>
                                        <BigOverview>{clickedMovie.overview}</BigOverview>
                                    </>
                                )}
                            </BigMovieInfo>
                        </>
                    ) : null
                }
            </AnimatePresence>
        </Wrapper>
    )
};

export default Search;