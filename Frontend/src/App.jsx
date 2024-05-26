import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import My from "./components/My.jsx";
import Board from "./components/Board.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Home />} />
      <Route path="/board" element={<Board />} />
      <Route path="/" element={<My />} />
    </Routes>
  );
}

export default App;
