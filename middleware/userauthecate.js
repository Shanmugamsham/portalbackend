const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require("../database/database");

exports.isAuthenticate = async (req, res, next) => {
    const { token } = req.headers;
   
    if (!token) {
        return res.status(400).json({ message: 'Login first to handle this resource' });
    }

    try {
        const decoded = await jwt.verify(token, 'defaultSecretKey');
        const id = decoded.id;

        

        let sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    data: err.sqlMessage,
                    message: 'User query failed'
                });
            }

            if (result.length > 0) {
                const user = result[0];

                 req.user = user;

                next(); 
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'No user found'
                });
            }
        });
    } catch (error) {
    
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token or token expired'
        });
    }
};
