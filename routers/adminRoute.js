var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')

//login
router.get('/',adminController.admin_login)

router.post('/',adminController.login_admin)



module.exports = router;