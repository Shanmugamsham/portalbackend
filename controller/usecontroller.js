const db = require('../database/database');
const bcrypt = require('bcrypt');

const sendtoken=require("../utils/jwt")
exports.registerUser = async (req, res) => {
    
    try {
        const password=  await bcrypt.hash(req.body.password,10)
    
    let newUser = { name: req.body.name, email: req.body.email,password: password };
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, newUser,async(err, result) => {
        if (err){
            return res.status(500).json({
                success:false,
                data:err.sqlMessage,  
                message:'User registration failed.'
            }
        );
        };
        return  res.status(200).json({
          success:true,
          data:result,  
          message:'User registration successfully...'});
        
    });
    } catch (error) {
        return  res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })

    }
    
};



exports.login = async (req, res) => {
    
   try {
    if(!req.body.email){
        return res.status(400).json({msg:"please enter your mail id"})
    }
    if(!req.body.password){
        return  res.status(400).json({msg:"please enter your password"})
}
   

    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.body.email],async(err, result) => {
        
        if (err){
            return   res.status(500).json({
                success:false,
                data:err.sqlMessage,  
                message:'User failed'
            });
        };
       
        if (result.length > 0) {
            
            const user = result[0];
            
            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {

                let message="login successfully"
               sendtoken(result,200,res,message,user.id)
                
           
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect password'
                });
            }
        } else {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }
    });
   } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })

   }



       
};








exports.getAllUsers = async(req, res) => {
   try {
    let sql = 'SELECT * FROM users';
    db.query(sql, async(err, results) => {
       
        if (err)throw err
        if(results.length>0){
            return res.status(200).json({
                success:true,
                data:results,  
                message:'allUserdata successfully...'});
          }else{
            return res.status(404).json({
                success:false,
                message:'no records...'});
          }
    });
   } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }
};

exports.getUserById =async (req, res) => {
  try {
    let sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.user.id],async (err, result) => {
        if (err){
            return res.status(500).json({
                success:false,
                data:err.sqlMessage,  
                message:'User faild'
            });
        };
        if(result.length>0){
            return res.status(200).json({
                success:true,
                data:result,  
                message:'singUserdata successfully...'});
          }else{
            return res.status(404).json({
                success:false,
                message:'no records...'});
          }
    });
  } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
  }
};



exports.updateUser = async(req, res) => {
   try {
    const password=  await bcrypt.hash(req.body.password,10)
    
    let updatedUser = { name: req.body.name, email: req.body.email,password:password };
    let sql = 'UPDATE users SET ? WHERE id = ?';
     db.query(sql, [updatedUser, req.user.id],async (err, result) => {
        if (err){
            return res.status(500).json({
                success:false,
                data:err.sqlMessage,  
                message:'User faild'
            });
        };
        return res.status(200).json({
            success:true,
            message:'updateUser successfully...'})
});
   } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }
}

exports.deleteUser = async(req, res) => {
  try {
    let sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.user.id],async (err, result) => {
        if (err){
            return res.status(500).json({
                success:false,
                data:err.sqlMessage,  
                message:'User faild'
            });
        };
        return res.status(200).json({
            success:true,
            data:result,  
            message:'deleteUser successfully...'});
    });
  } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   
  }
};