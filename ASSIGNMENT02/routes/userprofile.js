var express = require('express');
const User = require('../models/User');
var router = express.Router();

const { isAuthenticated, isProfileComplete } = require('./middlewares');

router.get('/userprofile', isAuthenticated, isProfileComplete, function (req, res, next) {
  res.render('userprofile', {
    title: 'User Profile',
    stylesheet: 'userprofile.css',
    script: 'userprofile.js',
    user: req.user
  });
});

router.post('/userprofile/:_id', isAuthenticated, function (req, res, next) {
  const ID = req.params._id.replace(":", "").replace("_", "");
  User.findByIdAndUpdate(ID, {
    name: req.body.name,
    rut: req.body.rut,
    dob: req.body.dob
  })
    .then(() => {
      res.redirect('/payments/general');
    })
    .catch((err) => {
      console.error('Error updating user profile: ', err);
    })
});

module.exports = router;