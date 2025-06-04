import React from "react";

const Navbar = () => {
  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8000/logout/", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.message);
        window.location.href = "/Signin";
      } else {
        console.error("Logout failed:", data.detail || "Unknown error");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-green-800 text-white">
      <h1 className="text-lg font-bold">For The Love of Sign Community</h1>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Log out
      </button>
    </nav>
  );
};

export default Navbar;
