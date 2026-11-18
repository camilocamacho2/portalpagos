const dns = require('node:dns/promises');
const mongoose = require('mongoose');
const connectionstring = "mongodb+srv://pagos:hoysillueve2026@cluster0mongo.tihn5.mongodb.net/pagos";
const conectarDB = async () => {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
    await mongoose.connect(connectionstring);

    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;