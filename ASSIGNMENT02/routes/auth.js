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
      // Renderiza el formulario de login con un mensaje de error
      return res.status(400).render('login', {
        title: 'Login',
        stylesheet: 'login.css',
        script: 'login.js',
        errorMessage: 'El correo electrónico no está registrado.',
        email // Mantén el email ingresado para no borrarlo del formulario
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Renderiza el formulario de login con un mensaje de error
      return res.status(400).render('login', {
        title: 'Login',
        stylesheet: 'login.css',
        script: 'login.js',
        errorMessage: 'Contraseña incorrecta. Verifica e intenta nuevamente.',
        email // Mantén el email ingresado para no borrarlo del formulario
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).render('login', {
          title: 'Login',
          stylesheet: 'login.css',
          script: 'login.js',
          errorMessage: 'Error al iniciar sesión. Por favor, intenta nuevamente más tarde.'
        });
      }
      if (!user.isProfileComplete) {
        return res.redirect('/userprofile');
      }
      res.redirect('/payments/general');
    });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).render('login', {
      title: 'Login',
      stylesheet: 'login.css',
      script: 'login.js',
      errorMessage: 'Ocurrió un error interno. Por favor, intenta nuevamente más tarde.'
    });
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
      return res.status(400).render('error', {
        title: 'Error',
        message: 'El correo electrónico ya está en uso. Por favor, utiliza otro o recupera tu cuenta.'
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Error al encriptar la contraseña. Por favor, intenta nuevamente más tarde.'
      });
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
    console.error("Error registering user:", error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Ocurrió un error al registrar al usuario. Por favor, intenta nuevamente más tarde.'
    });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect('/userprofile');
  });

router.get('/logout', isAuthenticated, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
