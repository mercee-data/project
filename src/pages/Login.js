import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state for invalid inputs
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation for email and password
    if (!email || !password) {
      setError("Please fill out both fields.");
      return;
    }

    // Clear any previous error
    setError("");

    try {
      // Send login request to the backend
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Sending email and password in the request body
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage or perform other post-login actions
        localStorage.setItem("authToken", data.token); // Assumes a token is sent
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        // Display error if login fails
        setError(data.error || "Login failed, please try again."); // Updated to handle 'error' key
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>

        {/* Display Error Message */}
        {error && <p className="auth-error">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        {/* Forgot Password */}
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        {/* Sign Up Section */}
        <div className="signup-section">
          <p>Don’t have an account?</p>
          <button
            className="signup-button"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
