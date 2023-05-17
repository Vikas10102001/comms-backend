const express= require("express")
const router = express.Router();
const authController = require("../controller/authController")
const userController = require("../controller/userController")

//signUp
router.route('/register').post(authController.signUp)
router.route('/login').post(authController.login)
//Getting User
router.route('/').get(userController.getUser)
//Updating User
//Deleting User

module.exports=router