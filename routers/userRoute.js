var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')


//// LOGIN AND REGISTER


////VIEWS
router.get('/',userController.home_page)

router.get('/smartphones',userController.smartphones)

router.get('/wearables',userController.wearables)

router.get('/earwear',userController.earwears)

module.exports = router;