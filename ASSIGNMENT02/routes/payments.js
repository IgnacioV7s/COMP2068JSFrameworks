var express = require('express');
var router = express.Router();

const Payment = require('../models/Payment');
const User = require('../models/User');
const mongoose = require('mongoose');

const { isAuthenticated, isProfileComplete } = require('./middlewares');

router.get('/general', isAuthenticated, isProfileComplete, async (req, res, next) => {
  try {
    let payments;

    if (req.user.role === 'admin') {
      payments = await Payment.find().populate('userId');
    }
    else {
      payments = await Payment.find({ userId: req.user._id }).populate('userId');
    }

    res.render('payments/general', {
      title: 'Payments', stylesheet: 'payments.css', payments, userIsAdmin: req.user.role === 'admin'
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving payments: " + error.message);
  }
});

router.get('/addpayment', async (req, res, next) => {
  let data = await User.find().sort({ username: 1 });
  res.render('payments/addpayment', { title: 'Payments', stylesheet: 'addpayment.css', players: data, currentUser: req.user, userIsAdmin: req.user.role === 'admin' });
})

router.post('/add', async (req, res, next) => {
  try {
    const { playerName, paymentAmount, paymentDate } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(playerName);

    console.log("Datos recibidos", req.body);

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
      paymentDate: new Date(paymentDate),
    });

    // Guardar (registrar) el pago en la DB
    await newPayment.save();
    res.redirect('/payments/general');
  } catch (error) {
    console.error(error);
    res.status(400).send("Error procesando el pago: " + error.message);
  }
});

router.post('/update-status/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Not authorized');
    }

    const { status } = req.body;

    // Validación rápida por seguridad
    const validStatuses = ['Pending', 'Confirmed', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send('Invalid status');
    }

    await Payment.findByIdAndUpdate(req.params.id, { status });

    res.redirect('/payments/general'); // o donde estés renderizando
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;