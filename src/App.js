import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaTachometerAlt, FaChartBar, FaCogs, FaHistory, FaSignInAlt, FaUserPlus, FaBolt } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md"; // For Energy Tips icon
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import History from "./pages/History";
import Signup from "./pages/Signup";
import BuyUnits from "./pages/BuyUnits";
import EnergyTips from "./pages/EnergyTips";
import logo from "./assets/images/logo.png";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("login");

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <img src={logo} alt="Volt Watch Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Volt Watch</h2>
          <nav className="nav-links">
            <Link
              to="/dashboard"
              className={activePage === "dashboard" ? "active" : ""}
              onClick={() => setActivePage("dashboard")}
            >
              <FaTachometerAlt className="icon" /> Dashboard
            </Link>
            <Link
              to="/reports"
              className={activePage === "reports" ? "active" : ""}
              onClick={() => setActivePage("reports")}
            >
              <FaChartBar className="icon" /> Reports
            </Link>
            <Link
              to="/settings"
              className={activePage === "settings" ? "active" : ""}
              onClick={() => setActivePage("settings")}
            >
              <FaCogs className="icon" /> Settings
            </Link>
            <Link
              to="/history"
              className={activePage === "history" ? "active" : ""}
              onClick={() => setActivePage("history")}
            >
              <FaHistory className="icon" /> History
            </Link>
            <Link
              to="/buy-units"
              className={activePage === "buy-units" ? "active" : ""}
              onClick={() => setActivePage("buy-units")}
            >
              <FaBolt className="icon" /> Buy Units
            </Link>
            <Link
              to="/login"
              className={activePage === "login" ? "active" : ""}
              onClick={() => setActivePage("login")}
            >
              <FaSignInAlt className="icon" /> Login
            </Link>
            <Link
              to="/signup"
              className={activePage === "signup" ? "active" : ""}
              onClick={() => setActivePage("signup")}
            >
              <FaUserPlus className="icon" /> Sign Up
            </Link>
            <Link
              to="/energy-tips"
              className={activePage === "energy-tips" ? "active" : ""}
              onClick={() => setActivePage("energy-tips")}
            >
              <MdTipsAndUpdates className="icon" /> Energy Tips
            </Link>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Navbar */}
          <div className="navbar">
            <span>Volt Watch - Track Your Electricity Usage</span>
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/buy-units" element={<BuyUnits />} />
            <Route path="/energy-tips" element={<EnergyTips />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
