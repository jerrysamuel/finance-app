import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/leaderboard/")
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
      })
      .catch((err) => {
        console.error("Failed to load leaderboard:", err);
      });
  }, []);

  // Helper to add rank styles
  const getRowStyle = (index) => {
    if (index === 0) return "text-yellow-300 font-bold";
    if (index === 1) return "text-gray-300 font-semibold";
    if (index === 2) return "text-orange-400 font-semibold";
    return "text-white";
  };

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-10 px-4">
      <h1 className="text-4xl font-extrabold mb-6 text-orange-500 neon-glow">🏆 Leaderboard</h1>

      <table className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl">
        <thead>
          <tr className="text-orange-400 text-left bg-gray-800 uppercase text-sm tracking-wider">
            <th className="py-3 px-4 border-b border-gray-700">Rank</th>
            <th className="py-3 px-4 border-b border-gray-700">Username</th>
            <th className="py-3 px-4 border-b border-gray-700">Best Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr
              key={user.username}
              className={`transition-all duration-300 ease-in-out hover:bg-gray-700 ${getRowStyle(index)}`}
            >
              <td className="py-2 px-4 border-b border-gray-700">{getMedal(index)}</td>
              <td className="py-2 px-4 border-b border-gray-700">{user.username}</td>
              <td className="py-2 px-4 border-b border-gray-700">{user.best_time} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center mt-6">
        <p className="mt-6 text-sm text-gray-400">
          Best time is calculated based on the fastest completion time of the puzzle.
        </p>
          <p className="mt-6 text-sm text-gray-400">
            Start a new game to see if you can beat the leaderboard!
          </p>  
        <Link
          to="/start"
          className=" justify-center mt-6 bg-blue-500 px-6 py-3 rounded-lg text-white shadow-lg hover:bg-blue-600 transition"
        >
          Start New Game
        </Link> 
      </div>
    </div>
  );
}

export default Leaderboard;
