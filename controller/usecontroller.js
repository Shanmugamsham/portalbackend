const db = require('../database/database');
const bcrypt = require('bcrypt');
const multer=require("multer")
const path =require("path")
const sendtoken=require("../utils/jwt")


//  const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"./uploads/user")

//     },
//     filename:(req,file,cb)=>{
//          cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))

//      },
// })

//  let maxsize=2*1000*1000

// const upload=multer({
//      storage:storage,
//      limits:{
//          fileSize:maxsize
//      }
//  })

//  let uploadhaldle=upload.single('avatar')

    

//  exports.upload=(req,res)=>{
//     uploadhaldle(req,res,function(err){
//         if(err instanceof multer.MulterError){
//           if(err.code=="LIMIT_FILE_SIZE"){
//                res.status(400).json({
//                   message:"maximum file 2 mp"
//                })
//            }
//            return;
//        }
//        if(!req.file){
//           res.status(400).json({message:"No file"})
//       }else
//       { res.status(400).json({message:"uploaded"})
//             // avatar =`${BASE_URL}/uploads/user/${req.file.originalname}`
//       }

//     })
//  }






exports.registerUser = async (req, res) => {


     let avatar;
   let BASE_URL = `${req.protocol}://${req.get('host')}`
    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
         console.log(avatar);
        
     }

    try {
        const { email, password } = req.body;
     
        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide both email and password" });
        }

        let sqlCheck = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlCheck, [email], async (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                 let newUser = { name: req.body.name, email: req.body.email,password:hashedPassword,avatar:avatar }
                let sqlInsert = 'INSERT INTO users SET ?';
                db.query(sqlInsert, newUser, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Database error: ' + err.message
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: 'User registered successfully',
                        userId: result.insertId
                    });
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
};
    




exports.login = async (req, res) => {
    
   try {
    if(!req.body.email){
        return res.status(400).json({message:"please enter your mail id"})
    }
    if(!req.body.password){
        return  res.status(400).json({message:"please enter your password"})
}
   

    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.body.email],async(err, result) => {
       
        if (err)throw err
       
        if (result.length > 0) {
            
            const user = result[0];
            
            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {

                let message="login successfully"
               sendtoken(result,201,res,message,user.id)
                
           
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
            return res.status(201).json({
                success:true,
                data:results,  
                message:'Retrieve all user data successfully.'});
          }else{
            return res.status(404).json({
                success:false,
                message:'No records found.'});
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
        if (err) throw err
        if(result.length>0){
            return res.status(201).json({
                success:true,
                data:result,  
                message:'Userdata successfully...'});
          }else{
            return res.status(404).json({
                success:false,
                message:'User not found'});
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
    
    let avatar;
    let BASE_URL = `${req.protocol}://${req.get('host')}`
     if(req.file){
         avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`

      }
      
   try {
    const {name, email, password } = req.body;
    if (!email || !password ||!name) {
        return res.status(400).json({ msg: "Please provide name, email and password" });
    }

    let sqlCheck = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlCheck, [email], async (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            } else {

                const password=  await bcrypt.hash(req.body.password,10)
    
                let updatedUser = { name: req.body.name, email: req.body.email,password:password,avatar:avatar };
                let sql = 'UPDATE users SET ? WHERE id = ?';
                 db.query(sql, [updatedUser, req.user.id],async (err, result) => {
                    if (err) {
                               return res.status(500).json({
                                     success: false,
                                     message: 'Database error: ' + err.message
                                 });
                             }
                    return res.status(201).json({
                        success:true,
                       message:'User updated successfully.'})

            })

            }



  
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
        if (err) throw err
        return res.status(201).json({
            success:true,
            data:result,  
            message:'User deleted successfully'});
    });
  } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   
  }
};


exports.deleteallUser = async(req, res) => {
    try {
      let sql = 'DELETE FROM users WHERE id = ?';
      db.query(sql, [req.params.id],async (err, result) => {
          if (err) throw err
          return res.status(201).json({
              success:true,
              data:result,  
              message:'User deleted successfully.'});
      });
    } catch (error) {
      return  res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
      })
     
    }
  };

  
exports.updateallUser = async(req, res) => {
    let avatar;
    let BASE_URL = `${req.protocol}://${req.get('host')}`
     if(req.file){
         avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
          console.log(avatar);
         
      }
   try {
    const {name, email, password } = req.body;
  
    
     
    if (!email || !password ||!name) {
        return res.status(400).json({ msg: "Please provide name, email and password" });
    }

    let sqlCheck = 'SELECT * FROM users WHERE email = ?';
        db.query(sqlCheck, [email], async (err, result) => {
            if (err) throw err;

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            } else {

                const password=  await bcrypt.hash(req.body.password,10)
    
                let updatedUser = { name: req.body.name, email: req.body.email,password:password,avatar:avatar };
                let sql = 'UPDATE users SET ? WHERE id = ?';
                 db.query(sql, [updatedUser, req.params.id],async (err, result) => {
                    if (err) {
                               return res.status(500).json({
                                     success: false,
                                     message: 'Database error: ' + err.message
                                 });
                             }
                    return res.status(201).json({
                        success:true,
                       message:'User updated successfully.'})

            })

            }



  
});
   } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }

}


exports.getallUserById =async (req, res) => {
    try {
      let sql = 'SELECT * FROM users WHERE id = ?';
      db.query(sql, [req.params.id],async (err, result) => {
          if (err) throw err
          if(result.length>0){
              return res.status(201).json({
                  success:true,
                  data:result,  
                  message:'User data retrieved successfully.'});
            }else{
              return res.status(404).json({
                  success:false,
                  message:'User not found.'});
            }
      });
    } catch (error) {
      return  res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
      })
    }
  };
  