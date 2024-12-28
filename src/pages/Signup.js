import React, { useState } from "react";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(""); // For handling error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();
      console.log("Response status:", response.status); // Debugging
      console.log("Response data:", data);

      if (response.ok) {
        alert(`User ${name} registered successfully!`);
      } else {
        // Handle server errors (e.g., validation issues)
        setError(data.error || data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      setError("A network error occurred. Please check your connection.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up initiated");
  };

  return (
    <div className="signup-container">
      {/* Signup Heading */}
      <h2 className="signup-heading">Create an Account</h2>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Signup Form */}
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Google Sign Up Button */}
      <div className="google-signup">
        <button className="google-button" onClick={handleGoogleSignUp} disabled={loading}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png"
            alt="Google logo"
            className="google-logo"
          />
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}

export default Signup;
