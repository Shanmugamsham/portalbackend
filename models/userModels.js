const db=require("../database/database")
require('dotenv').config()
const mysql = require('mysql2');
const createUsersTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(250) NOT NULL,
            email VARCHAR(250) NOT NULL UNIQUE,
            password VARCHAR(250) NOT NULL
        )
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Users table created successfully.');
        }
    });
};

// Call the function to create the table
createUsersTable();