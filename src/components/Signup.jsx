import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Api";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // new
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError(""); // reset error
    setSuccess(""); // reset success

    if (!username.trim()) {
      setError("Username is required!");
      return;
    }
    if (!password.trim()) {
      setError("Password is required!");
      return;
    }

    try {
      const response = await api.post("/register/", { username, password });

      // Success feedback
      setSuccess(response.data.message || "Signup successful!");

      // Save auth state
      localStorage.setItem("username", username);
      localStorage.setItem("isAuthenticated", "true");

      // Brief delay before redirecting
      setTimeout(() => navigate("/select-template"), 1500);
    } catch (error) {
      setError(error.response?.data?.detail || "Registration failed, try again!");
    }
  };

  return (
    <div className="bg-black text-white flex flex-col items-center px-4 min-h-screen justify-center relative">
      {/* Game Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-orange-500 neon-glow mb-4">
        🔥 Sign Scrabble Challenge 🔥
      </h1>

      <p className="text-lg text-gray-300 mb-6">Enter your username & password to begin!</p>

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

      {/* Error Feedback */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Success Toast */}
      {success && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn z-50">
          {success}
        </div>
      )}

      {/* Continue Button */}
      <button
        className="mt-6 px-6 py-3 text-lg font-bold rounded-lg 
          bg-orange-600 hover:bg-orange-700 transition-all duration-200 
          transform hover:scale-105 shadow-lg hover:shadow-orange-500"
        onPointerDown={handleSignup} // ⚡ mobile-friendly
      >
        🎮 Start Game
      </button>

      {/* Sign In Link */}
      <p className="mt-4 text-gray-400">Already have an account?</p>
      <Link to="/signin" className="text-orange-500 hover:underline">
        Sign In
      </Link>
    </div>
  );
}

export default Signup;
