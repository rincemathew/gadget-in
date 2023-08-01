var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')


//// LOGIN AND REGISTER

router.get('/login-register',userController.login_register)

router.post('/register',userController.register)

router.post('/login',userController.login)

router.post('/login-register',userController.verify_otp)

router.get('/logout',userController.user_logout)


////VIEWS
router.get('/',userController.sessionValidation,userController.home_page)

router.get('/smartphones',userController.sessionValidation,userController.smartphones)

router.get('/wearables',userController.sessionValidation,userController.wearables)

router.get('/earwear',userController.sessionValidation,userController.earwears)

router.get('/products',userController.sessionValidation,userController.products)


module.exports = router;