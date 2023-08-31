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


router.get('/account/profile',userController.sessionValidUser,userAccountController.profile)

router.post('/account/profile',userController.sessionValidUser,userAccountController.profilePost)

router.get('/account/wishlist/',userController.sessionValidUser,userAccountController.wishlist)

router.get('/account/address/',userController.sessionValidUser,userAccountController.address)

router.get('/account/addressget/',userController.sessionValidUser,userAccountController.address_get)

router.post('/account/address',userController.sessionValidUser,userAccountController.address_add)

// router.post('/account/address/',userController.sessionValidUser,userAccountController.address_edit)

router.post('/account/address_delete',userController.sessionValidUser,userAccountController.address_delete)

router.get('/account/orders/',userController.sessionValidUser,userAccountController.orders)

router.post('/account/cancelorder/:id',userController.sessionValidUser,userAccountController.cancel_order)


router.get('/account/checkout',userController.sessionValidUser,cartController.checkout)

router.post('/account/checkout',userController.sessionValidUser,cartController.checkout_post)



////VIEWS
router.get('/',userController.sessionValidation,userController.home_page)

router.get('/products',userController.sessionValidation,userController.products)

router.get('/:slug',userController.sessionValidation,userController.categories_view)


router.get('*',userController.sessionValidation,userController.page404)


module.exports = router;