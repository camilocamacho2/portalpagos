const mongoose = require("mongoose");

const productos_table = new mongoose.Schema({
    idProducto: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    valor: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: false
    }
});

const ProductosModel = mongoose.model("productos", productos_table);

module.exports = ProductosModel;