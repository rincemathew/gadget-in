var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController')


router.get('/',adminController.admin_login)

router.get('/admun', (req, res) => {
  res.render('admin/index')
})


module.exports = router;