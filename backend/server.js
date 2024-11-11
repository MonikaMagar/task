const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Create MySQL connection pool for better performance and connection management
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Make sure to use a secure password here
  database: 'students',
});

// Test the database connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); // Exit the application if DB connection fails
  } else {
    console.log('Connected to the database as id ' + connection.threadId);
    connection.release(); // Release the connection back to the pool
  }
});

// GET request to fetch all students
app.get('/', (req, res) => {
  db.query('SELECT * FROM student_table', (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(200).json(result);
  });
});

// POST request to add a new student profile
app.post('/add', (req, res) => {
  const { name, age, email, mobile } = req.body;

  // Validate that all required fields are provided
  if (!name || !age || !email || !mobile) {
    return res.status(400).json({ message: 'All fields (name, age, email, mobile) are required.' });
  }

  // Use parameterized queries to prevent SQL injection
  const query = 'INSERT INTO student_table (name, age, email, mobile) VALUES (?, ?, ?, ?)';
  db.query(query, [name, age, email, mobile], (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(200).json({ message: 'Profile Added' });
  });
});

// PUT request to update an existing student profile by ID
app.put('/update/:id', (req, res) => {
  const { name, age, email, mobile } = req.body;
  const { id } = req.params;

  // Validate that all required fields are provided
  if (!name || !age || !email || !mobile) {
    return res.status(400).json({ message: 'All fields (name, age, email, mobile) are required.' });
  }

  // Use parameterized queries to prevent SQL injection
  const query = 'UPDATE student_table SET name = ?, age = ?, email = ?, mobile = ? WHERE id = ?';
  db.query(query, [name, age, email, mobile, id], (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(200).json({ message: 'Profile Updated' });
  });
});

// DELETE request to delete a student profile by ID
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Use parameterized queries to prevent SQL injection
  const query = 'DELETE FROM student_table WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(200).json({ message: 'Profile Deleted' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
