// server/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Product = require('./src/models/Product'); // Importamos el modelo nuevo

const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
app.set('trust proxy', 1); // Necesario para cookies seguras en Render/Vercel
const port = process.env.PORT || 3000;
console.log("Environment:", process.env.NODE_ENV);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://thunderpipes-client.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 1. Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch((err) => console.error("❌ Error conectando a DB:", err));

// Configuración Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// D. Mercado Pago (Tu lógica existente mejorada)
app.post("/create_preference", async (req, res) => {
    let items = [];
    try {
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Validar que lleguen items
        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ error: "No items provided" });
        }

        // Iterar sobre los items solicitados y buscar su precio real en la DB
        for (const item of req.body.items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item._id}` });
            }

            items.push({
                id: product._id.toString(),
                title: product.name,
                quantity: Number(item.quantity),
                unit_price: Number(product.price), // PRECIO REAL DE LA DB
                currency_id: "ARS",
                picture_url: product.img // Opcional: enviar imagen a MP
            });
        }



        const body = {
            items: items,
            back_urls: {
                success: `${FRONTEND_URL}/success`,
                failure: `${FRONTEND_URL}/failure`,
                pending: `${FRONTEND_URL}/pending`
            },
        };

        if (!FRONTEND_URL.includes('localhost')) {
            body.auto_return = "approved";
        }

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });

    } catch (error) {
        console.error("Error creating preference:", error);
        if (error.response) {
            console.error("MP Error Response:", JSON.stringify(error.response.data, null, 2));
        }
        res.status(500).json({ error: "Error al crear preferencia" });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});