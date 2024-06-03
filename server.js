const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'dokter'
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.get('/profiles', (req, res) => {
    db.query('SELECT * FROM profile', (err, results) => {
        if (err){
            console.log('Error fetching profiles:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});