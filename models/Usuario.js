const mongoose = require("mongoose");

const usuarios_table = new mongoose.Schema({
    cedula: {
        type: Number,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        default: Date.now
    },
    rol: {
        type: String,
        default: "1"
    }
});

const UsuarioModel = mongoose.model("usuarios", usuarios_table);

module.exports = UsuarioModel;