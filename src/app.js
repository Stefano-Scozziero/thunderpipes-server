const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const compression = require('compression');
const apicache = require('apicache');
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Product = require('./models/Product');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const cache = apicache.middleware;

app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'https://thunderpipes-client.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Configuración Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);

// D. Mercado Pago
app.post("/create_preference", async (req, res) => {
    let items = [];
    try {
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        if (!req.body.items || req.body.items.length === 0) {
            return res.status(400).json({ error: "No items provided" });
        }

        for (const item of req.body.items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item._id}` });
            }

            items.push({
                id: product._id.toString(),
                title: product.name,
                quantity: Number(item.quantity),
                unit_price: Number(product.price),
                currency_id: "ARS",
                picture_url: product.img
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

module.exports = app;
