var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var cartController = require('../controllers/cartController')
const userAccountController = require('../controllers/userAccountController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')


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

router.get('/account/cartview',userController.sessionValidUser,cartController.cart_view_ajax)

router.post('/account/cartincrese/:id',userController.sessionValidUser,cartController.cart_count_increse)

router.post('/account/cartdecrese/:id',userController.sessionValidUser,cartController.cart_count_decrese)

router.post('/account/deletecart/:id',userController.sessionValidUser,cartController.delete_cart_item)

router.get('/account/profile',userController.sessionValidUser,userAccountController.profile)

router.post('/account/profile',userController.sessionValidUser,userAccountController.profilePost)

//wishlist

router.get('/account/wishlist/',userController.sessionValidUser,userAccountController.wishlist)


//coupon

router.get('/account/coupon',userController.sessionValidUser,couponController.display_coupon)



//addresses

router.get('/account/address/',userController.sessionValidUser,userAccountController.address)

router.get('/account/addressget/',userController.sessionValidUser,userAccountController.address_get)

router.post('/account/address',userController.sessionValidUser,userAccountController.address_add)

// router.post('/account/address/',userController.sessionValidUser,userAccountController.address_edit)

router.post('/account/address_delete',userController.sessionValidUser,userAccountController.address_delete)

//orders

router.get('/account/orders/',userController.sessionValidUser,orderController.orders)

router.post('/account/cancelorder/:id',userController.sessionValidUser,orderController.cancel_order)

//Wallet

router.get('/account/wallet',userController.sessionValidUser,userAccountController.wallet)


router.get('/account/checkout',userController.sessionValidUser,orderController.checkout)

router.post('/account/checkout',userController.sessionValidUser,orderController.checkout_post)



////VIEWS
router.get('/',userController.sessionValidation,userController.home_page)

router.get('/products',userController.sessionValidation,userController.products)

router.get('/:slug',userController.sessionValidation,userController.categories_view)


//search box
router.post('/search/searchbox/:value',userController.search_box)



router.get('*',userController.sessionValidation,userController.page404)


module.exports = router;