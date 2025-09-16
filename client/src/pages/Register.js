import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import fudLogo from "../assets/fud logo.png"; // <-- logo here

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });

      if (res.status === 201 || res.status === 200) {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfdfd] via-[#f3f3f3] to-[#e6e6e6] font-[Poppins]">
      <div className="bg-white p-8 rounded-2xl shadow-[8px_8px_20px_#cfd8dc,-8px_-8px_20px_#ffffff] w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={fudLogo} alt="FUD Logo" className="h-20" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-[#006B3F]">
          Create Account
        </h1>
        <p className="text-center text-[#8B4513] mb-6 font-medium">
          Federal University Dutse – Lost & Found
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg shadow-inner">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#006B3F]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#006B3F] text-white py-3 rounded-xl font-semibold shadow-[4px_4px_12px_#b0bec5,-4px_-4px_12px_#ffffff] hover:bg-[#004d2b] transition"
          >
            Register
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#D2691E]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
