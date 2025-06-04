import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Template from "./components/Template";
import Start from "./components/Start";
import Signin from "./components/Signin";
import Leaderboard from "./components/Leaderboard"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/select-template" element={<Template />} />
        <Route path="/start" element={<Start />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/logout" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
