const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'userdb',
    password: 'password',
    port: 5432,
});

// Ensure table creation
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`).catch(err => {
    console.error('Error creating users table:', err);
});

// Remove the default route that was returning "Server is Running...."
app.get('/', (req, res) => {
    res.json({ status: 'Backend server is running' });
});

app.get('/db', async (req, res) => {
    try {
        const users = await pool.query(`SELECT * FROM users`);
        return res.json(users.rows); // Send just the rows instead of the entire result object
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ success: false, error: 'Database query failed' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Username, email, and password are required' 
            });
        }

        // Check if username or email already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2', 
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ 
                message: 'Username or email already exists' 
            });
        }

        // Insert new user
        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, password]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed', 
            error: error.message 
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                message: 'Username and password are required' 
            });
        }

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        
        if (user.password === password) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Login failed', 
            error: error.message 
        });
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});