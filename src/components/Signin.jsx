import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async () => {
    if (!username.trim()) {
      setError("Username is required!");
      return;
    }
    if (!password.trim()) {
      setError("Password is required!");
      return;
    }

    try {
      const response = await api.post("/login/", { username, password });

      // Store authentication details
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("isAuthenticated", "true");

      alert("Login successful!");

      // Redirect to game selection page
      navigate("/select-template");
    } catch (error) {
      setError(error.response?.data?.detail || "Login failed, check your credentials!");
    }
  };

  return (
    <div className="bg-black text-white flex flex-col items-center px-4 min-h-screen justify-center">
      
      {/* Game Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-orange-500 neon-glow mb-4">
        🔥 Sign Scrabble Challenge 🔥
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-300 mb-6">Sign in to continue your challenge!</p>

      {/* Username Input */}
      <input 
        className="w-64 md:w-72 p-3 rounded-lg border-2 border-gray-700
        bg-gray-900 text-white text-center text-xl
        focus:border-orange-500 focus:outline-none focus:ring-2
        focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200"
        type="text" 
        placeholder="Enter Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Password Input */}
      <input 
        className="w-64 md:w-72 p-3 rounded-lg border-2 border-gray-700
        bg-gray-900 text-white text-center text-xl mt-4
        focus:border-orange-500 focus:outline-none focus:ring-2
        focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-200"
        type="password" 
        placeholder="Enter Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Sign In Button */}
      <button 
        className="mt-6 px-6 py-3 text-lg font-bold rounded-lg 
        bg-orange-600 hover:bg-orange-700 transition-all duration-200 
        transform hover:scale-105 shadow-lg hover:shadow-orange-500"
        onClick={handleSignin}
      >
        🚀 Sign In
      </button>
    </div>
  );
}

export default Signin;
