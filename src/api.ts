const API_KEY = "0320c27e7d01fb585f96df3ae6f48349";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    vote_average: number;
    name: string
};
    
export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
};

export async function getMovies() {
    const response = await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`);
    return await response.json();
};

/**
 * 인기 영화
 * [URL] https://api.themoviedb.org/3/movie/popular?api_key=<<api_key>>&language=ko
 */
export async function getPopularMovies() {
    const response = await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko`);
    return await response.json();
};

/**
 * 개봉 예정 영화
 * [URL] https://api.themoviedb.org/3/movie/upcoming?api_key=0320c27e7d01fb585f96df3ae6f48349&language=ko
 */
 export async function getUpcommingMovies() {
    const response = await fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`);
    return await response.json();
};

/*
 * 영화 상세정보 받아오기
 * [GET] /movie/{movie_id}
 * [URL] https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=ko
 * params: movieId
 */

/**
 * 검색 결과 받아오기 (멀티서치)
 * [URL] https://api.themoviedb.org/3/search/multi?api_key=<<api_key>>&language=ko&query={keyword}
 * params: keyword
 */

/**
 * TV 정보 받아오기 최신
 * [URL] https://api.themoviedb.org/3/tv/latest?api_key=0320c27e7d01fb585f96df3ae6f48349&language=ko
 */
 export async function getTVShows() {
    const response = await fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko`);
    return await response.json();
};

/**
 * 인기 TV
 * [URL] https://api.themoviedb.org/3/tv/popular?api_key=<<api_key>>&language=ko
 */
 export async function getPopularTV() {
    const response = await fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko`);
    return await response.json();
};

/**
 * 높은 평점 TV
 * [URL] https://api.themoviedb.org/3/tv/top_rated?api_key=<<api_key>>&language=ko
 */
 export async function getTopTV() {
    const response = await fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko`);
    return await response.json();
};