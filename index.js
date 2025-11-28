// server/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Product = require('./src/models/Product'); // Importamos el modelo nuevo

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch((err) => console.error("❌ Error conectando a DB:", err));

// Configuración Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// RUTAS DE LA API
const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

// D. Mercado Pago (Tu lógica existente mejorada)
app.post("/create_preference", async (req, res) => {
    try {
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        const body = {
            items: req.body.items.map(item => ({
                title: item.name,
                quantity: Number(item.quantity),
                unit_price: Number(item.price),
                currency_id: "ARS",
            })),
            back_urls: {
                success: `${FRONTEND_URL}/success`,
                failure: `${FRONTEND_URL}/failure`,
                pending: `${FRONTEND_URL}/pending`
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear preferencia" });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});