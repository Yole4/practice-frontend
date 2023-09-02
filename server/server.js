const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const port = process.env.DB_PORT;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://practice-render-x95b.onrender.com'],
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

app.post('/add-chairperson', (req, res) => {
    const { RorE, campus, college, fullname, email, password, user_id, userRank } = req.body;
    const givenImage = "givenProfile.png";

    const validatedRorE = RorE;
    const validatedCampus = campus;
    const validatedCollege = college;
    const validatedFullname = fullname;
    const validatedEmail = email;
    const validatedPassword = password;
    const sanitizeUserId = user_id;
    const addedBy = userRank;
    // fetch current date

    
        // check the password length
        if (validatedPassword.length < 5) {
            res.status(401).json({ message: "Password must have at least 5 characters!" });
            return;
        }

        // const cCheckEmail = 'SELECT * FROM users WHERE email = ? AND rank = ? AND isDelete = ?';
        const cCheckEmail = `SELECT * FROM users WHERE email = '${email}' AND rank = 'Chairperson' AND isDelete = 'not'`;
        connection.query(cCheckEmail, (error, results) => {
            if (error) {
                res.status(401).json({ message: "Servesdfsdfsdfsr side error!" });
            }
            else {
                if (results.length === 0) {
                    // success
                    // hash password
                    const hashedPassword = crypto.createHash('sha256').update(validatedPassword).digest('hex');
                    const insert = `INSERT INTO users (RorE, campus, college, fullname, email, password, added_by, image, rank) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    connection.query(insert, [validatedRorE, validatedCampus, validatedCollege, validatedFullname, validatedEmail, hashedPassword, addedBy, givenImage, "Chairperson"], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        }
                        else {
                            // get inserted id
                            const receiverId = results.insertId;

                            // initialize sender and receiver content
                            const senderContent = `You added ${validatedFullname} as Chairperson at ${validatedCampus} campus college of ${validatedCollege}`;
                            const receiverContent = `${addedBy} added your account`;

                            // insert into database
                            const senderData = 'INSERT INTO notification (user_id, content) VALUES (?, ?)';
                            connection.query(senderData, [sanitizeUserId, senderContent], (error, results) => {
                                if (error) {
                                    res.status(401).json({ message: "Server side error" });
                                } else {
                                    // insert reciever notification
                                    const receiverData = 'INSERT INTO notification (user_id, content) VALUES (?, ?)';
                                    connection.query(receiverData, [receiverId, receiverContent], (error, results) => {
                                        if (error) {
                                            res.status(401).json({ message: "Server side error!" });
                                        } else {
                                            // send to email
                                            const body = `Hi ${validatedFullname}, ${addedBy} added your account on JRMSU-VPRED using this Email: ${validatedEmail} and Password: ${password} \n\n.Click here to login (sample link here!)`;

                                            var transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    user: 'jrmsuvpred@gmail.com',
                                                    pass: 'kbwyyjspjdjerrno'
                                                }
                                            });

                                            var mailOptions = {
                                                from: 'jrmsuvpred@gmail.com',
                                                to: validatedEmail,
                                                subject: 'Your verification code!',
                                                text: body
                                            };

                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    res.status(200).json({ message: 'Account has been successfully added and was sent to email successfully!' });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    res.status(401).json({ message: "Email is already in used! Please try again!" });
                }
            }
        });
    
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
