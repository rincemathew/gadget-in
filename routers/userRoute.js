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

router.post('/re-sent-otp',userController.resentOTP)

router.get('/forget-password',userController.forgetPassword)

router.post('/forget-password',userController.forgetPasswordPost)

router.post('/verify-forget-otp',userController.verifyForgetOtp)

router.post('/forget-resent',userController.resentForgetOTP)

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

router.get('/account/wishlist/',userController.sessionValidUser,userAccountController.wishlist,userController.page404)

router.post('/account/wishlist-add/:id',userController.ajaxSessionValidUser,userAccountController.wishlistAdd)

router.post('/account/wishlist-delete/:id',userController.sessionValidUser,userAccountController.wishlistDelete)

router.post('/account/wishlist-addtocart/:id/:value',userController.sessionValidUser,userAccountController.wishlistToCart)

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

router.get('/account/walletcheck',userController.sessionValidUser,userAccountController.walletCheck)



////VIEWS
router.get('/',userController.sessionValidation,userController.home_page)

router.get('/category/:slug',userController.sessionValidation,userController.categories_view)

router.get('/products',userController.sessionValidation,userController.products)

router.post('/productslist',userController.sessionValidation,userController.categoriesDisplayItems)




//search box
router.post('/search/searchbox/:value',userController.search_box)



router.get('*',userController.sessionValidation,userController.page404)


module.exports = router;