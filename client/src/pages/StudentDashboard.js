// src/pages/StudentDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import StudentStats from "../components/StudentStats";
import RequestForm from "../components/RequestForm";
import SearchTabs from "../components/SearchTabs";
import ClaimsList from "../components/ClaimsList";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const toggleDark = () => setDarkMode(!darkMode);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`d-flex ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar */}
      <StudentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDark={toggleDark}
        logout={logout}
      />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {activeTab === "dashboard" && <StudentStats />}
        {activeTab === "request" && <RequestForm />}
        {activeTab === "search" && <SearchTabs />}
        {activeTab === "claims" && <ClaimsList />}
      </div>
    </div>
  );
}
