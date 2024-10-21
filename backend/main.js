const express = require('express');
const app = express();

const database = mysql.createDatabase({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'warmot'
});

database.connect((err) => {
    if (err) throw err;
    console.log('Database connected');
});

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});