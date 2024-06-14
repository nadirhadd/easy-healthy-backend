const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'dokter'
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashPw = await bcrypt.hash(password, 12);

        const sql = 'INSERT INTO users (username, password) VALUES(?, ?)';
        await db.execute(sql, [username, hashPw]);

        res.status(200).json({ message: 'success' });
    } catch (error) {
        console.log('failed', error);
        res.status(500).json({ message: 'server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
        const [rows] = await db.execute(sql, [username, password]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'invalid' });
        }

        const user = rows[0];

        const userData = {
            username: user.username,
            name: user.name
        };

        res.status(200).json({ message: 'success', user });

    } catch (error) {
        console.log('failed', error);
        res.status(500).json({ message: 'error', error });
    }
});

app.post('/posts', async(req, res) => {
    const { name, content } = req.body;

    try {
        const sql = 'INSERT INTO posts (username, content) VALUES (?, ?)';
        await db.query(sql, [name, content]);

        res.status(200).json({message: 'Post created'});
    } catch (error) {
        console.error('Post error', error);
        res.status(500).send({message: 'server error'});
    }
});

app.get('/profiles', async (req, res) => {
    try{
        const [results] = await db.execute('SELECT * FROM profile');
        res.json(results);
    } catch (err) {
        console.error('Error');
        res.status(500).send('Server Error');
    }
});

app.get('/pasien', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM pasien');
        res.json(results);
    } catch (err) {
        console.error('Error');
        res.status(500).send('Server Error');
    }
});

app.post('/pasien', async (req, res) => {
    const { NIK, Nama_Pasien, Jenis_Pasien, Nomor_HP, Dokter, Poli, Tanggal_Periksa } = req.body;

    const sql = 'INSERT INTO pasien (NIK, `Nama Pasien`, `Jenis Pasien`, `Nomor HP`, `Dokter`, `Poli`, `Tanggal Periksa`) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [NIK, Nama_Pasien, Jenis_Pasien, Nomor_HP, Dokter, Poli, Tanggal_Periksa];

    try {
        await db.execute(sql, values);
        res.send('Booking Berhasil!');
    } catch (err) {
        console.error('Gagal Booking', err);
        res.status(500).send('Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});