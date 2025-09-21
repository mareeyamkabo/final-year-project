import React from "react";
import {
  FaChartPie,
  FaClipboardList,
  FaSearch,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaFileAlt, // ✅ new icon
} from "react-icons/fa";

export default function StudentSidebar({ activeTab, setActiveTab, darkMode, toggleDark, logout }) {
  return (
    <div
      className={`p-3 shadow ${darkMode ? "bg-secondary" : "bg-white"}`}
      style={{ width: "240px" }}
    >
      <h3 className="fw-bold mb-4">🎓 Student</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              activeTab === "dashboard" ? "btn-primary text-light" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartPie className="me-2" /> Dashboard
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              activeTab === "request" ? "btn-primary text-light" : ""
            }`}
            onClick={() => setActiveTab("request")}
          >
            <FaClipboardList className="me-2" /> Request Item
          </button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              activeTab === "search" ? "btn-primary text-light" : ""
            }`}
            onClick={() => setActiveTab("search")}
          >
            <FaSearch className="me-2" /> Search Items
          </button>
        </li>

        {/* ✅ New Claims tab */}
        <li className="nav-item mb-2">
          <button
            className={`btn w-100 text-start ${
              activeTab === "claims" ? "btn-primary text-light" : ""
            }`}
            onClick={() => setActiveTab("claims")}
          >
            <FaFileAlt className="me-2" /> My Claims
          </button>
        </li>
      </ul>

      <hr />

      <button
        className="btn btn-outline-secondary w-100 mb-2"
        onClick={toggleDark}
      >
        {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light" : "Dark"}
      </button>

      <button className="btn btn-danger w-100" onClick={logout}>
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
}
