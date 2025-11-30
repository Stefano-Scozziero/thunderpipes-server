const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const compression = require('compression');
const apicache = require('apicache');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Product = require('./models/Product');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

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

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(compression());

// RUTAS DE LA API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/', paymentRoutes); // Mounts /create_preference

module.exports = app;
