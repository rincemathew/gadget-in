var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')

//LOGIN
router.get('/',adminController.admin_login)

router.post('/',adminController.login_admin)


//DASHBOARD
router.get('/dashboard',adminController.dashboard)



//PRODUCTS
router.get('/products',adminController.products)

router.get('/products/add-new',adminController.add_product)



//CATEGORIES
router.get('/categories',adminController.categories)


//USER PROFILE
router.get('/user-profile',adminController.user_profile)



module.exports = router;