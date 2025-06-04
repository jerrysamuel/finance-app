import { useEffect, useState } from "react";
import confetti from "canvas-confetti"; // Install with: npm install canvas-confetti
import { Link } from "react-router-dom";
import Navbar from "./Navbar"; 

const GRID_SIZE = 4; // 4x4 grid
const TILE_SIZE = 80; // Each tile is 80px

const Start = () => {
  const [image, setImage] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [emptyTile, setEmptyTile] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [username, setUsername] = useState(""); // Store username
  const [bgMusic] = useState(new Audio("/sounds/background-melody-3-17343.mp3"));
  const [moveSound] = useState(new Audio("/sounds/whoosh-motion-243505.mp3"));
  const [victorySound] = useState(new Audio("/sounds/victory-96688.mp3"));
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedTemplate");
    if (storedImage) {
      setImage(storedImage);
    }

    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    return () => bgMusic.pause(); // Stop music on unmount
  }, []);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  useEffect(() => {
    if (image) {
      initializeTiles();
    }
  }, [image]);

  useEffect(() => {
    if (!isSolved) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSolved]);

  const initializeTiles = () => {
    let initialTiles = [];
  
    // Create ordered tiles except for the last (empty) tile
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) continue; // Skip last tile (empty space)
        initialTiles.push({ row, col, correctRow: row, correctCol: col });
      }
    }
  
    let shuffledTiles;
    
    // Keep shuffling until we get a solvable configuration
    do {
      shuffledTiles = shuffleTiles([...initialTiles]);
    } while (!isSolvable(shuffledTiles));
  
    // Assign correct row/col positions after shuffle
    shuffledTiles = shuffledTiles.map((tile, index) => ({
      ...tile,
      row: Math.floor(index / GRID_SIZE),
      col: index % GRID_SIZE,
    }));
  
    setTiles(shuffledTiles);
    setEmptyTile({ row: GRID_SIZE - 1, col: GRID_SIZE - 1 }); // Ensure last tile is empty
  };
  
  const shuffleTiles = (tiles) => {
    let shuffled = [...tiles];
  
    // Fisher-Yates Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  
    return shuffled;
  };
  
  const isSolvable = (tiles) => {
    let inversions = 0;
    let flatTiles = tiles.map((tile) => tile.correctRow * GRID_SIZE + tile.correctCol);
  
    // Count number of inversions
    for (let i = 0; i < flatTiles.length - 1; i++) {
      for (let j = i + 1; j < flatTiles.length; j++) {
        if (flatTiles[i] > flatTiles[j]) inversions++;
      }
    }
  
    // If GRID_SIZE is odd, puzzle is solvable if inversions are even
    if (GRID_SIZE % 2 === 1) {
      return inversions % 2 === 0;
    }
  
    // If GRID_SIZE is even, puzzle is solvable if (inversions % 2) matches (empty tile row index from bottom % 2)
    return inversions % 2 === 0;
  };
  const canMove = (tile) => {
    if (!emptyTile) return false;
    const { row, col } = tile;
    return (
      (Math.abs(row - emptyTile.row) === 1 && col === emptyTile.col) ||
      (Math.abs(col - emptyTile.col) === 1 && row === emptyTile.row)
    );
  };

  const moveTile = (tile) => {
    if (!canMove(tile)) return;

    moveSound.currentTime = 0;
    moveSound.play();

    const newTiles = tiles.map((t) => {
      if (t.row === tile.row && t.col === tile.col) {
        return { ...t, row: emptyTile.row, col: emptyTile.col };
      }
      if (t.row === emptyTile.row && t.col === emptyTile.col) {
        return { ...t, row: tile.row, col: tile.col };
      }
      return t;
    });

    setTiles(newTiles);
    setEmptyTile({ row: tile.row, col: tile.col });

    checkIfSolved(newTiles);
  };

  const checkIfSolved = (tiles) => {
    const solved = tiles.every(
      (tile) => tile.row === tile.correctRow && tile.col === tile.correctCol
    );
  
    if (solved) {
      setIsSolved(true);
      victorySound.play();
      bgMusic.pause();
      confetti({ particleCount: 200, spread: 70 }); // Celebration effect
  
      updateBestTime(timer); // ✅ Now we call the function
    }
  
    return solved;
  };
  
  const updateBestTime = async (timeTaken) => {
    try {
      const response = await fetch("http://localhost:8000/update-best-time/", {
        method: "POST",
        credentials: "include", // Send cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time_taken: timeTaken }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error("Error:", data.detail);
      }
    } catch (err) {
      console.error("Failed to update best time:", err);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 15000); // 15 seconds
  
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <>
    <Navbar/>
     {/* Username Display (Top Left) */}
     <div className="absolute top-2 left-2 text-lg font-semibold text-white bg-gray-900 px-4 py-2 rounded-md shadow-md">
        {username ? `👤 ${username}` : "👤 Guest"}
      </div>
    
    {showHint && (
  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-lg font-semibold text-white 
                  bg-gray-900 px-4 py-2 rounded-md shadow-md sm:mb-5 transition-opacity duration-1000">
    🧩 Move the tiles to solve the puzzle!
  </div>
)}

    <div className="bg-black min-h-screen flex flex-col lg:flex-row items-center justify-center text-white p-6">
      
      <div className="fixed top-5 right-5 lg:text-xl text-xs font-bold animate-pulse 
                bg-yellow-500 text-black px-3 py-2 rounded-full shadow-lg border-2 border-black z-50
                 ">
        ⏳ {timer}s
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div
          className={`relative grid grid-cols-4 gap-1 p-3 border-4 ${
            isSolved ? "border-green-500" : "border-orange-500"
          } transition-all duration-300 rounded-lg`}
          style={{ width: `${TILE_SIZE * GRID_SIZE}px`, height: `${TILE_SIZE * GRID_SIZE}px` }}
          onClick={() => bgMusic.play()} // Ensures user interaction to start music
        >
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="absolute w-20 h-20 bg-gray-800 border border-gray-700 cursor-pointer transition-all duration-300 rounded-md"
              onClick={() => moveTile(tile)}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                backgroundPosition: `${(tile.correctCol * 100) / (GRID_SIZE - 1)}% ${
                  (tile.correctRow * 100) / (GRID_SIZE - 1)
                }%`,
                top: `${tile.row * TILE_SIZE}px`,
                left: `${tile.col * TILE_SIZE}px`,
                opacity: tile.row === emptyTile.row && tile.col === emptyTile.col ? 0 : 1,
              }}
            ></div>
          ))}
        </div>

        <div className="relative w-50 h-50 border-4 border-gray-700 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Puzzle Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Congratulations Popup */}
      {isSolved && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-orange-500 bg-opacity-70 text-white text-2xl font-bold z-50">
            <h1 className="text-4xl text-green-500 neon-glow">
              🎉 Congratulations, {username || "Player"}! You finished in {timer} seconds! 🎉
            </h1>

            {/* Leaderboard Button */}
            <Link
              to="/leaderboard"
              className="mt-4 bg-blue-500 px-6 py-3 rounded-lg text-white shadow-lg hover:bg-blue-600 transition"
            >
              View Leaderboard
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-500 px-6 py-3 rounded-lg text-white shadow-lg hover:bg-green-600 transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Start;
