const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController')
const multer = require('../helpers/multer')

//LOGIN
router.get('/',adminController.admin_login)

router.post('/dashboard',adminController.login_admin)


//DASHBOARD
router.get('/dashboard',adminController.dashboard)



//PRODUCTS
router.get('/products',adminController.products)

router.get('/products/add-new',adminController.add_product)

router.post('/products/add-new',multer,adminController.add_product_post)

router.get('/products/edit/:id', adminController.edit_product)

// router.post('/products/edit/:id', adminController.edit_product_post)

// router.post('/products/visbility',adminController.products_visibility)

router.post('/products/:id/unblock', adminController.unblock_product)

router.post('/products/:id/block', adminController.block_product)


// router.post('/products/block',adminController.block_products)



//CATEGORIES
router.get('/categories',adminController.categories)


//USER PROFILE
router.get('/user-profile',adminController.user_profile)



module.exports = router;