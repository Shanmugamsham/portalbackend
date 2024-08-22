const express = require('express');
const router = express.Router();
const userController = require('../controller/usecontroller');
const { isAuthenticate } = require('../middleware/userauthecate');
const multer = require('multer');
const path = require('path')
const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/user' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })


// *          content:
//  *            application/json:
//  *              schema:
//  *                $ref: '#/components/schemas/User'



/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - avatar
 *      properties:
 *        id:
 *          type: number
 *          description: The Auto-generated ID of the user
 *          example : 4
 *        name:
 *          type: string
 *          description: User name
 *        email:
 *          type: string
 *          description: user email address
 *        password:
 *          type: string
 *          description: user password should be greater then 6 character
 *        avatar:
 *          type: string
 *          description: upload images
 *      example:
 *        name: shanmugam
 *        email: shan@gmail.com
 *        password: test@123
 *        avatar: images-file
 */

/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: Authentication apis
 */
/**
 * @swagger
 * /api/register:
 *    post:
 *      summary: Register New User
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        201:
 *          description: User registered successfully
 *        400:
 *           description: Email already registered || Please provide both email and password
 *        500:
 *          description: internal serevr error || Database error
 */





router.post('/register',upload.single('avatar'), userController.registerUser);



/**
 * @swagger
 * components:
 *  schemas:
 *    Userlogin:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: user email address
 *        password:
 *          type: string
 *          description: user password should be greater then 6 character
 *      example:   
 *        email: shan@gmail.com
 *        password: test@123
 */

/**

 * @swagger
 * /api/login:
 *  post:
 *    summary: Login User
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Userlogin'
 *    responses:
 *      201:
 *        description: login successfully
 *      400:
 *        description: please enter your mail id or please enter your password or Incorrect password orNo user found with this email
 *      500:
 *        description: Internal Server Error
 */

router.post('/login', userController.login);


/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: User apis
 */

/**
 * @swagger
 * /api/user:
 *  get:
 *    summary: Get logged-in user's data. 
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      201:
 *        description: Userdata successfully...
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */







router.get('/user',isAuthenticate, userController.getUserById);


/**
 * @swagger
 * components:
 *  schemas:
 *    Userupdate:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - avatar
 *      properties:
 *        name:
 *          type: string
 *          description: User name
 *        email:
 *          type: string
 *          description: user email address
 *        password:
 *          type: string
 *          description: user password should be greater then 6 character
 *        avatar:
 *          type: string
 *          description: upload images
 *      example:
 *        id: 1
 *        name: shanmugasundaram
 *        email: shanddy@gmail.com
 *        password: test@123
 *        avatar: images-file
 */



/**
 * @swagger
 * /api/userupdate:
 *  put:
 *    summary: Update logged-in user's data. 
 *    tags: [User]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Userupdate'
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      201:
 *        description: User updated successfully..
 *      400:
 *        description: Email already registered or Please provide name, email and password
 *      500:
 *        description: Internal server error or Database error
 */





router.put('/userupdate',upload.single('avatar'),isAuthenticate,userController.updateUser);







/**
 * @swagger
 * /api/userdelete:
 *  delete:
 *    summary: Delete logged-in user's data
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      201:
 *        description: User deleted successfully
 *      500:
 *        description: Internal server error
 */

router.delete('/userdelete',isAuthenticate,userController.deleteUser);


/**
 *  @swagger
 *  tags:
 *    name: Admin
 *    description: Admin apis
 */

/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Retrieve all user data. 
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user ID
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      201:
 *        description: Retrieve all user data successfully.
 *      404:
 *        description: No records found.
 *      500:
 *        description: Internal server error
 */


router.get('/users',isAuthenticate, userController.getAllUsers);


/**
 * @swagger
 * /api/alluser/{id}:
 *  get:
 *    summary: Retrieve user by ID
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user ID
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      201:
 *        description: User data retrieved successfully.
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 */



router.get('/alluser/:id',isAuthenticate, userController.getallUserById);


/**
 * @swagger
 * /api/usersallupdate/{id}:
 *  put:
 *    summary: Update user by ID
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user ID
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Userupdate'
 *    responses:
 *      201:
 *        description: User updated successfully.
 *      400:
 *        description: Email already registered or Please provide name, email and password
 *      500:
 *        description: Internal server error or Database error
 */

router.put('/usersallupdate/:id',upload.single('avatar'),isAuthenticate,userController.updateallUser);

/**
 * @swagger
 * /api/useralldelete/{id}:
 *  delete:
 *    summary: Delete user by ID
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user ID
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      200:
 *        description: User deleted successfully.
 *      500:
 *        description: Internal server error
 */


router.delete('/useralldelete/:id',isAuthenticate,userController.deleteallUser);
/**
 * @swagger
 * /api/protected:
 *  get:
 *    summary: Access protected resource
 *    tags: [Admin]
 *    security:
 *     - jwtAuth: []
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Bearer token for authorization
 *    responses:
 *      200:
 *        description: Successfully accessed protected resource
 *      401:
 *         description: Unauthorized - Invalid or missing token
 *      500:
 *        description: Internal server error
 */




/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Access protected resource
 *     tags: [Auth]
 *     security:
 *       - jwtAuth: [""]
 * 
 */
router.get('/protected',isAuthenticate,(req,res)=>{
    res.status(201).json({
        success: true,
        message: 'Successfully accessed protected resource'
    });
});
 

module.exports = router;