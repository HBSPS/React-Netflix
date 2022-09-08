import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api";

function Home() {
    const { data, isLoading } = useQuery(["movies", "nowPlaying"], getMovies);
    return (
        <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}>
            <h1>Home</h1>
        </div>
    );
};

export default Home;