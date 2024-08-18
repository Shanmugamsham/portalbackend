
const mysql = require('mysql2');
require('dotenv').config()

const urldb=process.env.urldb
const db = mysql.createConnection(urldb);

db.connect( async(err) => {
    if (err) {
       await console.error('Error connecting to the database:', err);
        return;
    }
    await console.log('MySQL Connected...');
});




module.exports = db;