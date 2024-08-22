const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require("../database/database");

exports.isAuthenticate = async (req, res, next) => {
  
   
    

    try {
        const token  = req.headers.token||req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'Login first to handle this resource' });
        }

        const decoded = await jwt.verify(token, 'defaultSecretKey');
        const id = decoded.id;
       
         if(!id){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid or missing token"
            });
         }
        

        let sql = 'SELECT * FROM users WHERE id = ?';
        db.query(sql, [id], async(err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Database error'
                });
            }

            if (result.length > 0) {
                const user = await result[0];
                 req.user = await user;
                next(); 
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'No user found'
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
