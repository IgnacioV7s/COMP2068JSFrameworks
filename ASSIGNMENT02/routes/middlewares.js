var express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta esté correcta
var router = express.Router();

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {  // Si está autenticado, sigue adelante
    return next();
  }
  res.redirect('/auth/login');  // Si no, redirige al login
}

// Middleware para verificar si el perfil está completo
async function isProfileComplete(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }

  // Si el usuario ya está en la página de perfil, no lo redirijas nuevamente
  if (req.originalUrl === '/userprofile') {
    return next();
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user.username || !user.rut || !user.dob) {
      return res.redirect('/userprofile');
    }
    next();
  } catch (error) {
    console.error("Error checking profile completion:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { isAuthenticated, isProfileComplete };