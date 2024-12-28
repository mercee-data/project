const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./database"); // Import SQLite database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in JSON parser

// Utility function to handle db queries using Promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row);
    });
  });
};

const runInsert = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      }
      resolve(this);
    });
  });
};

// Route for user signup
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide username, email, and password" });
  }

  try {
    const existingUser = await runQuery(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await runInsert(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({ error: "Error during signup. Please try again." });
  }
});

// Route for user login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const user = await runQuery("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res
      .status(200)
      .json({ message: "Login successful", token: "dummy_token_here" });
  } catch (err) {
    console.error("Error during login:", err.message);
    res
      .status(500)
      .json({ error: "Error during login. Please try again later." });
  }
});

// Adjusted route for buying units
app.post("/api/buyunit", async (req, res) => {
  const { units } = req.body;

  if (!units || isNaN(units) || units <= 0) {
    return res.status(400).json({ error: "Invalid number of units" });
  }

  try {
    const data = await runQuery("SELECT remaining_units FROM consumption");
    const currentUnits = data?.remaining_units || 0;
    const updatedUnits = currentUnits + units;

    // Ensure the demo value of 20,000 is not exceeded
    if (updatedUnits > 20000) {
      return res.status(400).json({
        error: `Exceeding demo limit of 20,000 units. Current: ${currentUnits}`,
      });
    }

    const date = new Date().toISOString().split("T")[0];
    const dailyConsumption = await calculateDailyConsumption();

    // Update remaining units
    await runInsert("UPDATE consumption SET remaining_units = ?", [
      updatedUnits,
    ]);

    // Insert into history
    await runInsert(
      "INSERT INTO history (date, units_purchased, daily_consumption, remaining_units) VALUES (?, ?, ?, ?)",
      [date, units, dailyConsumption, updatedUnits]
    );

    // Only return the new updated units data
    res.status(200).json({ remainingUnits: updatedUnits });
  } catch (err) {
    console.error("Error adding units:", err.message);
    res.status(500).json({ error: "Error adding units. Please try again." });
  }
});

const crypto = require("crypto"); // For generating tokens

// Forgot Password
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Check if user exists
    const user = await runQuery("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Generate a reset token and expiry time
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Update user with reset token and expiry
    await runInsert(
      "UPDATE users SET reset_token = ?, token_expiry = ? WHERE email = ?",
      [hashedToken, tokenExpiry, email]
    );

    // Simulate sending the token via email (replace this with a real email service)
    console.log(`Password reset token for ${email}: ${resetToken}`); // Replace with email logic

    res.status(200).json({
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("Error during forgot password:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});


// Reset Password
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  try {
    // Find user by token
    const user = await runQuery(
      "SELECT * FROM users WHERE reset_token IS NOT NULL"
    );

    if (!user || !user.reset_token || !user.token_expiry) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Check token validity
    const isValidToken = await bcrypt.compare(token, user.reset_token);
    if (!isValidToken || Date.now() > user.token_expiry) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear reset token fields
    await runInsert(
      "UPDATE users SET password = ?, reset_token = NULL, token_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error during reset password:", error.message);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});


// Test database connection before starting server
db.serialize(() => {
  console.log("Database is ready to handle queries.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Example function to calculate daily consumption (you can modify this logic)
const calculateDailyConsumption = () => {
  // Example: Calculate based on some predefined logic or appliances data
  return 10; // Just a placeholder, replace with actual logic
};
