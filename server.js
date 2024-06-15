const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;
const router = express.Router();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'dokter'
});

const forumDb = mysql.createPool({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'forumdb',
});

//dokterDb system
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

app.get('/profiles', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM profile');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//forumDb system
app.get('/users', async (req, res) => {
    try {
        const [results] = await forumDb.query('SELECT * FROM users');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//New User
app.post('/register', async (req, res) => {
    const { username, password, full_name } = req.body;

    try {
        const [results] = await forumDb.execute('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)', [username, password, full_name]);
        res.json({ message: 'Registrasi Berhasil', userId: results.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

//Login
app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await forumDb.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length === 0) {
            return resizeTo.status(401).json({ message: 'Invalid' })
        }
        const user = rows[0];

        const userData = {
            username: user.username,
            name: user.name
        }

        res.status(200).json({ message: 'Success', user });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//New Question
app.post('/questions', async (req, res) => {
    const { title, content } = req.body;

    try {
        const [results] = await forumDb.execute('INSERT INTO questions (title, content) VALUES (?, ?)', [title, content]);
        res.json({ message: 'Berhasil', questionId: results.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

//Question List
app.get('/questions', async (req, res) => {
    try {
        const [results] = await forumDb.query('SELECT * FROM questions');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//New Comment
app.post('/comments', async (req, res) => {
    const { content } = req.body;

    try {
        const [results] = await forumDb.execute('INSERT INTO comments (content) VALUES (?)', [content]);
        res.json({ message: 'Berhasil', commentId: results.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/comments', async (req, res) => {
    try {
        const [results] = await forumDb.query('SELECT * FROM comments');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});