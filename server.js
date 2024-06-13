const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashPw = await bcrypt.hash(password, 12);

        const sql = 'INSERT INTO users (username, password) VALUES(?, ?)';
        const [result] = await pool.query(sql, [username, hashPw]);

        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log('failed', error);
        res.status(500).json({ message: 'server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await pool.query(sql, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'invalid' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.status(200).json({message: 'success', user});
        } else {
            res.status(401).json({ message: 'invalid' });
        }
    } catch (error) {
        console.log('failed', error);
        res.status(500).json({ message: 'error' });
    }
});

app.get('/login', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err){
            console.log('Error fetching profiles:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
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

app.get('/pasien', (req, res) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err){
            console.log('Error fetching profiles:', err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
});

app.post('/pasien', (req, res) => {
    const { NIK, Nama_Pasien, Jenis_Pasien, Nomor_HP, Dokter, Poli, Tanggal_Periksa } = req.body;

    const sql = 'INSERT INTO pasien (NIK, `Nama Pasien`, `Jenis Pasien`, `Nomor HP`, `Dokter`, `Poli`, `Tanggal Periksa`) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [NIK, Nama_Pasien, Jenis_Pasien, Nomor_HP, Dokter, Poli, Tanggal_Periksa];

    db.query(sql, values, (err, result) => {
        if(err) {
            console.error('Gagal memproses booking', err);
            res.status(500).send('Server Error');
            return;
        }
        res.send('Booking Berhasil!');
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});