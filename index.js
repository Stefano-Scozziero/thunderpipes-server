// server/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Product = require('./models/Product'); // Importamos el modelo

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

// A. Obtener todos los productos (Para el Home)
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// B. Crear un producto nuevo (Para el Admin Panel)
app.post("/api/products", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: "Error al crear producto" });
    }
});

// C. Borrar un producto (Para el Admin Panel)
app.delete("/api/products/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

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