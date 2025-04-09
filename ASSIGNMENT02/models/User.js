const mongoose = require('mongoose');

const UserSchema = {
    username: { type: String },
    email: { type: String },
    password: { type: String },
    googleId: { type: String }, // Permite valores null, pero mantiene la unicidad si se usa
    role: { type: String, default: 'player' },
    rut: { type: String, default: null },
    dob: { type: String, default: null },
}

const mongooseSchema = mongoose.Schema(UserSchema);

module.exports = mongoose.model('User', mongooseSchema);