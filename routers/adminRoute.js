const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController')
const {upload,category_img} = require('../helpers/multer')
const cartController = require('../controllers/cartController')

//LOGIN

//login page view
router.get('/',adminController.admin_login)
// logout
router.get('/logout',adminController.admin_logout)
// login validation
router.post('/',adminController.login_admin)


//DASHBOARD
router.get('/dashboard',adminController.session_check,adminController.dashboard)



//PRODUCTS
router.get('/products',adminController.session_check,adminController.products)

router.get('/products/add-new',adminController.session_check,adminController.add_product)

router.post('/products/add-new',adminController.session_check,upload,adminController.add_product_post)

router.get('/products/edit/:id',adminController.session_check, adminController.edit_product)

router.post('/products/edit/:id',adminController.session_check,upload, adminController.edit_product_post)

// router.post('/products/visbility',adminController.products_visibility)

router.post('/products/:id/unblock',adminController.session_check, adminController.unblock_product)

router.post('/products/:id/block',adminController.session_check, adminController.block_product)


// router.post('/products/block',adminController.block_products)



//CATEGORIES
router.get('/categories',adminController.session_check,adminController.categories)

router.get('/categories/add-new',adminController.session_check,adminController.add_categories)

router.post('/categories/add-new',adminController.session_check,category_img,adminController.add_categories_post)

// router.post('/categories/update',adminController.session_check,adminController.update_categories_post)

router.post('/categories/toggle/:id/',adminController.session_check,adminController.categories_block_unblock)


//USER PROFILE
router.get('/user-profile',adminController.session_check,adminController.user_profile)

router.post('/user-profile/toggle/:id',adminController.session_check,adminController.user_block_unblock)


///order profile
router.get('/orders',adminController.session_check,cartController.order_admin_controller)



router.get('*',adminController.session_check,adminController.page404)


module.exports = router;