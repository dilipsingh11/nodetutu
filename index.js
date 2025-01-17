const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        
    password: '123456',      
    database: 'crud_db'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to database.');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Home Route
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.render('index', { users: results });
    });
});

// Add User
app.post('/add', (req, res) => {
    const { name, email, age } = req.body;
    db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Edit User (GET)
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.render('edit', { user: results[0] });
    });
});

// Edit User (POST)
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete User
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Server Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
