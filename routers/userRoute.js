var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var cartController = require('../controllers/cartController')
const userAccountController = require('../controllers/userAccountController')


//// LOGIN AND REGISTER

router.get('/login-register',userController.login_register)

router.post('/register',userController.register)

router.post('/login',userController.login)

router.post('/login-register',userController.verify_otp)

router.get('/logout',userController.user_logout)


///FOR USER ONLY
router.post('/account/add-to-cart/:id/:value',userController.ajaxSessionValidUser,cartController.add_to_cart)

// router.post('/account/add-to-wishlist',userController.sessionValidUser,userController.products)

router.get('/account/cart/',userController.sessionValidUser,cartController.cart_view)


router.get('/account/profile/',userController.sessionValidUser,userAccountController.profile)

router.get('/account/wishlist/',userController.sessionValidUser,userAccountController.wishlist)

router.get('/account/address/',userController.sessionValidUser,userAccountController.address)

router.get('/account/orders/',userController.sessionValidUser,userAccountController.orders)



////VIEWS
router.get('/',userController.sessionValidation,userController.home_page)

router.get('/products',userController.sessionValidation,userController.products)

router.get('/:slug',userController.sessionValidation,userController.categories_view)


router.get('*',userController.sessionValidation,userController.page404)


module.exports = router;