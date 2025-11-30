var express = require('express');
const User = require('../models/User');
var router = express.Router();

const { isAuthenticated, isProfileComplete } = require('./middlewares');

// Función para validar el RUT
function validarRut(rut) {
    const rutRegex = /^[0-9]{1,8}-[0-9kK]$/;
    return rutRegex.test(rut);
}

// Función para normalizar el RUT
function normalizeRut(rut) {
    return rut.replace(/\./g, "").toLowerCase();
}

// Ruta GET para renderizar el perfil del usuario
router.get('/', isAuthenticated, isProfileComplete, function (req, res, next) {
    res.render('userprofile', {
        title: 'User Profile',
        stylesheet: 'userprofile.css',
        script: 'userprofile.js',
        user: req.user
    });
});

// Ruta POST para actualizar el perfil del usuario
router.post("/", isAuthenticated, async function (req, res, next) {
    const { id, rut } = req.body;

    try {
        // Obtener el usuario actual desde la base de datos
        const user = await User.findById(id);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).render("userprofile", {
                title: "User Profile",
                stylesheet: "userprofile.css",
                script: "userprofile.js",
                error: "Usuario no encontrado."
            });
        }

        // Normalizar el RUT actual y el nuevo RUT
        const normalizedStoredRut = normalizeRut(user.rut);
        const normalizedNewRut = normalizeRut(rut);

        // Si el RUT es equivalente, redirigir directamente
        if (normalizedStoredRut === normalizedNewRut) {
            return res.redirect("/payments/general");
        }

        // Validar el nuevo RUT
        if (!validarRut(normalizedNewRut)) {
            return res.status(400).render("userprofile", {
                title: "User Profile",
                stylesheet: "userprofile.css",
                script: "userprofile.js",
                user: req.user,
                errorRut: "El RUT ingresado no es válido. Debe tener el formato chileno con o sin puntos (Ej: 19.208.330-3 o 19208330-3)."
            });
        }

        // Actualizar el RUT en la base de datos
        await User.findByIdAndUpdate(id, { rut: rut });
        res.redirect("/payments/general");

    } catch (err) {
        console.error(`Error al procesar el RUT para el usuario con ID: ${id}. Detalles:`, err);
        res.status(500).render("userprofile", {
            title: "User Profile",
            stylesheet: "userprofile.css",
            script: "userprofile.js",
            user: req.user,
            error: "Ocurrió un error inesperado. Intenta nuevamente más tarde."
        });
    }
});

module.exports = router;
