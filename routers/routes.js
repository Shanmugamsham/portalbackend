const express = require('express');
const router = express.Router();
const userController = require('../controller/usecontroller');
const { isAuthenticate } = require('../middleware/userauthecate');



router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/users',isAuthenticate, userController.getAllUsers);
router.get('/user',isAuthenticate, userController.getUserById);
router.put('/usersupdate',isAuthenticate,userController.updateUser);
router.delete('/userdelete',isAuthenticate,userController.deleteUser);

module.exports = router;