const API_KEY = "0320c27e7d01fb585f96df3ae6f48349";

const BASE_PATH = "https://api.themoviedb.org/3/"

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
};