var express = require('express');
var router = express.Router();

const Payment = require('../models/Payment');
const transporter = require('../routes/emailTransporter');
const User = require('../models/User');
const mongoose = require('mongoose');
const { isAuthenticated, isProfileComplete } = require('./middlewares');

router.get('/general', isAuthenticated, isProfileComplete, async (req, res, next) => {
  try {
    let payments;
    let totalPaid = 0;

    // Asignar totalToPay según el rol del usuario
    let totalToPay;
    if (req.user.role === 'admin') {
      payments = await Payment.find().populate('userId');
      totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amountPaid), 0);
      totalToPay = 3500000; // Valor fijo para admin
    } else if (req.user.role === 'player') {
      payments = await Payment.find({ userId: req.user._id }).populate('userId');
      totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amountPaid), 0);
      totalToPay = 150000; // Valor fijo para jugador
    }

    // Calcular cuánto falta por pagar
    const remainingToPay = Math.max(totalToPay - totalPaid, 0); // No puede ser negativo

    res.render('payments/general', {
      title: 'Payments',
      stylesheet: 'payments.css',
      payments,
      userIsAdmin: req.user.role === 'admin',
      totalPaid,
      totalToPay,
      remainingToPay // Enviar el resultado a la vista
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving payments: " + error.message);
  }
});

router.get('/addpayment', async (req, res, next) => {
  let data = await User.find().sort({ username: 1 });
  res.render('payments/addpayment', { title: 'Payments', stylesheet: 'addpayment.css', 
    players: data, currentUser: req.user, userIsAdmin: req.user.role === 'admin' });
})

router.post('/add', async (req, res, next) => {
  try {
    const { playerName, paymentAmount, paymentDate } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(playerName);

    const user = await User.findById(userObjectId); // Validar si el usuario existe
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    const newPayment = new Payment({ // Crear el nuevo pago
      userId: userObjectId,
      username: user.username,
      amountPaid: paymentAmount,
      paymentDate: new Date(paymentDate),
    });

    await newPayment.save(); // Guardar el pago en la base de datos

    const adminUser = await User.findOne({ role: 'admin' }); // Search for users with role 'admin'
    if (!adminUser) {
      console.error("No admin users were found.");
    } else {
      const mailOptions = { // Create email content
        from: process.env.EMAIL_USER,
        to: 'nashoooox3@gmail.com', // Admin email
        subject: 'New payment register',
        text: `Hello ${adminUser.username},\n\nNew payment registered:\n\n` +
          `User: ${user.username}\n` +
          `Amount: $${paymentAmount}\n` +
          `Date: ${new Date(paymentDate).toLocaleDateString()}\n\nBest regards.`
      };

      await transporter.sendMail(mailOptions); // To send the email
      console.log("Confirmation email was sent to the admin."); // Flag to debug
    }

    res.redirect('/payments/general');
  } catch (error) {
    console.error("Error al procesar el pago:", error.message);
    res.status(400).send("Error al procesar el pago: " + error.message);
  }
});


router.post('/update-status/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Not authorized');
    }

    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send('Invalid status');
    }

    await Payment.findByIdAndUpdate(req.params.id, { status });

    res.redirect('/payments/general');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;