var express = require('express');
var router = express.Router();
const passport = require("../configs/passportConfig");
const User = require('../models/User');
const { isAuthenticated } = require('./middlewares');
const bcrypt = require('bcrypt');

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login', stylesheet: 'login.css', script: 'login.js' });
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password.");
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/userprofile');
    });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal server error.");
  }
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register', stylesheet: 'register.css', script: 'register.js' });
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("Email already in use.");
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).send("Error encrypting password.");
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.redirect('/auth/login');
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Error registering user: " + error.message);
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect('/userprofile');
  });

router.get('/logout', isAuthenticated, function (req, res, next) {
  console.log("Logout route reached");  // Verifica que esta ruta se está ejecutando
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid'); // Asegúrate de borrar la cookie de sesión si es necesario
    res.redirect('/');
  });
});

module.exports = router;
