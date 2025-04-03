// Nombres de los modelos usualmente van en singular y en mayúscula

// Importar mongoose
const mongoose = require('mongoose');

// Definir el esquema del proyecto
const UserSchema = {
    // username: { type: String, required: function () { return !this.googleId; }, trim: true },
    // email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // password: { type: String, required: function () { return !this.googleId; }, minlength: 6 },
    // googleId: { type: String, unique: true, sparse: true }, // Permite valores null, pero mantiene la unicidad si se usa
    // role: { type: String, enum: ['admin', 'player'], default: 'player' },
    // rut: { type: String, required: function() { return !this.googleId; }, unique: true},
    // dob: { type: Date, required: function() { return !this.googleId; } },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    googleId: { type: String }, // Permite valores null, pero mantiene la unicidad si se usa
    role: { type: String, default: 'player' },
    rut: { type: String, default: null },
    dob: { type: String, default: null },
}

// Create Mongoose Schema
const mongooseSchema = mongoose.Schema(UserSchema);

// Create and export Mongoose Model
module.exports = mongoose.model('User', mongooseSchema);