const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Resolve the path to the database file
const dbPath = path.resolve(__dirname, 'database.db');

// Open or create a database file
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not open database:', err.message);
  } else {
    console.log('Connected to the SQLite database at', dbPath);
  }
});

// Create a users table if it doesn't exist
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `,
    (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ensured.');
      }
    }
  );
});

module.exports = db; // Export the database connection
