var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')


//// LOGIN AND REGISTER

router.get('/login-register',userController.login_register)

router.post('/register',userController.register)

router.post('/login',userController.login)


////VIEWS
router.get('/',userController.home_page)

router.get('/smartphones',userController.smartphones)

router.get('/wearables',userController.wearables)

router.get('/earwear',userController.earwears)

router.get('/products',userController.earwears)

module.exports = router;