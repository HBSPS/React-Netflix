const API_KEY = "0320c27e7d01fb585f96df3ae6f48349";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
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