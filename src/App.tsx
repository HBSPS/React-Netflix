import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="movies/:id" element={< Home />} />
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="tv/:id" element={< Tv />} />
        <Route path="/search" element={<Search />}></Route>
        <Route path="search/:id" element={<Search />} />
      </Routes>
    </Router>
  );
};

export default App;