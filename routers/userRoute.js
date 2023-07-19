var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')


//// LOGIN AND REGISTER


////VIEWS
router.get('/',userController.home_page)

module.exports = router;