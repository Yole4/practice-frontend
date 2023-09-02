const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const port = process.env.DB_PORT;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET']
}));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((error) => {
    console.log("Connected to database");
});

app.post('/select', (req, res) => {
    const {name, course, id} = req.body;

    const select = `SELECT * FROM practice WHERE id = '${id}'`;
    db.query(select, (error, results) => {
        if (error) {
            res.status(401).json({message: "Select error!"});
        }else{
            res.status(200).json({message: results});
        }
    });
});

app.post('/insert', (req, res) => {
    const {name, course} = req.body;

    const insert = `INSERT INTO practice (fullname, course) VALUES (?, ?)`;
    db.query(insert, [name, course], (error, results) => {
        if (error) {
            res.status(401).json({message: "insert error!"});
        }else{
            res.status(200).json({message: "successfully inserted!"});
        }
    });
});

app.post('/update', (req, res) => {
    const {name, course, id} = req.body;

    const update = `UPDATE practice SET fullname = ?, course = ? WHERE id = ?`;
    db.query(update, [name, course, id], (error, results) => {
        if (error) {
            res.status(401).json({message: "error updating data"});
        }else{
            res.status(200).json({message: "successfully updated!"});
        }
    })
});

app.get('/fetch', (req, res) => {
    const fetch = `SELECT * FROM practice`;
    db.query(fetch, (error, results) => {
        if (error) {
            res.status(401).json({message: "Unable to fetch data"});
        }else{
            res.status(200).json({message: results});
        }
    })
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});