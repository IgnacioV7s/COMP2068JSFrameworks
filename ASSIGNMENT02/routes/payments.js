var express = require('express');
var router = express.Router();

const Payment = require('../models/payment');
const User = require('../models/User');
const mongoose = require('mongoose');

const { isAuthenticated, isProfileComplete } = require('./middlewares');

router.get('/general', isAuthenticated, isProfileComplete, (req, res, next) => {
  res.render('payments/general', { title: 'Payments', stylesheet: 'payments.css' });
});

router.get('/addpayment', async (req, res, next) => {
  let data = await User.find().sort({ username: 1 });
  res.render('payments/addpayment', { title: 'Payments', stylesheet: 'addpayment.css', players: data });
})

router.post('/add', async (req, res, next) => {
  try {
    const { playerName, paymentAmount, paymentDate } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(playerName);

    console.log("Datos recibidos",req.body);

    // Validar si el usuario existe
    const user = await User.findById(userObjectId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Crear el nuevo pago
    const newPayment = new Payment({
      userId: userObjectId,
      username: user.username,
      amountPaid: paymentAmount,
      lastPayment: new Date(paymentDate),
    });

    // Guardar (registrar) el pago en la DB
    await newPayment.save();
    res.redirect('/payments/general');
  } catch (error) {
    console.error(error);
    res.status(400).send("Error procesando el pago: " + error.message);
  }
});

module.exports = router;