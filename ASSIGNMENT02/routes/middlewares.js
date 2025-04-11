var express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const passport = require('passport'); // Importa passport si estás usándolo
var router = express.Router();

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // Usuario autenticado, continúa
    return next();
  }
  // Redirige al login si no está autenticado
  res.redirect('/auth/login');
}

// Middleware para verificar si el perfil del usuario está completo
async function isProfileComplete(req, res, next) {
  try {
    // Verificar autenticación antes de continuar
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }

    // Si el usuario ya está en la página de perfil, no lo redirijas
    if (req.originalUrl === '/userprofile') {
      return next();
    }

    // Consultar el usuario en la base de datos
    const user = await User.findById(req.user._id);
    if (!user || !user.username || !user.rut || !user.dob) {
      return res.redirect('/userprofile');
    }

    // Perfil completo, continúa
    next();
  } catch (error) {
    console.error("Error verificando si el perfil está completo:", error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Ocurrió un error al verificar el perfil. Por favor, intenta nuevamente más tarde.'
    });
  }
}

module.exports = { isAuthenticated, isProfileComplete };