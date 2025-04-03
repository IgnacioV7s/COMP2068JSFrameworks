const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  amountPaid: { type: Number, default: 0 },
  status: { type: String, enum: ['On Time', 'Late', 'Paid'], default: 'Late' },
  lastPayment: { type: Date }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;