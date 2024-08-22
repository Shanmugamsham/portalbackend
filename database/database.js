
const mysql = require('mysql2');
require('dotenv').config()


const db = mysql.createConnection({
    host: 'blqub5m25oqbkdrl2ibr-mysql.services.clever-cloud.com',
    user: 'u9kxri0frynimvz3',
    password: 'xgGXQg4l8R15qUNeAWj4',
    database: 'blqub5m25oqbkdrl2ibr',
    port: 3306,
    connectTimeout: 10000  
  });



// const urldb=process.env.urldb
// const db = mysql.createConnection(urldb);

const databasecall=async()=>{

    try {
        await db.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log('MySQL Connected...');
        });
         
    } catch (error) {
        console.log(error);
        
    }
}

databasecall()


module.exports = db;