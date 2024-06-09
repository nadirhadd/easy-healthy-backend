const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
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