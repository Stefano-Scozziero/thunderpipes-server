require('dotenv').config();
const mongoose = require("mongoose");
const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info("✅ Conectado a MongoDB Atlas"))
    .catch((err) => logger.error("❌ Error conectando a DB:", { error: err.message }));

app.listen(port, () => {
    logger.info(`Servidor corriendo en puerto ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
});
