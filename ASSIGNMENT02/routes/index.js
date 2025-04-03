var express = require('express');
var router = express.Router();
var userprofileRouter = require('./userprofile');

router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home', stylesheet: 'home.css' });
});

router.use('/', userprofileRouter);

module.exports = router;