const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const Product = require('../models/Product');
const Order = require('../models/Order');

// Configuración Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

exports.createPreference = async (req, res) => {
    let items = [];
    let total = 0;
    try {
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
        const userId = req.user ? req.user.id : null;

        const { items: requestItems, shippingAddress, email } = req.body;

        if (!requestItems || requestItems.length === 0) {
            return res.status(400).json({ error: "No items provided" });
        }

        if (!shippingAddress) {
            return res.status(400).json({ error: "Shipping address is required" });
        }

        if (!userId && !email) {
            return res.status(400).json({ error: "Email is required for guest checkout" });
        }

        for (const item of requestItems) {
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
            total += Number(product.price) * Number(item.quantity);
        }

        // Create Pending Order
        const orderData = {
            items: items.map(i => ({
                product: i.id,
                title: i.title,
                quantity: i.quantity,
                price: i.unit_price
            })),
            total: total,
            status: 'pending',
            shippingAddress: shippingAddress
        };

        if (userId) {
            orderData.user = userId;
        } else {
            orderData.email = email;
        }

        const order = new Order(orderData);
        await order.save();

        const body = {
            items: items,
            back_urls: {
                success: `${FRONTEND_URL}/success`,
                failure: `${FRONTEND_URL}/failure`,
                pending: `${FRONTEND_URL}/pending`
            },
            external_reference: order._id.toString()
        };

        if (!FRONTEND_URL.includes('localhost')) {
            body.auto_return = "approved";
        }

        // Webhook URL (Must be HTTPS and public)
        const BACKEND_URL = process.env.BACKEND_URL || "https://thunderpipes-server.onrender.com";
        body.notification_url = `${BACKEND_URL}/webhook`;

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
};

exports.receiveWebhook = async (req, res) => {
    const { query } = req;
    const topic = query.topic || query.type;

    try {
        if (topic === "payment") {
            const paymentId = query.id || query['data.id'];
            const payment = await new Payment(client).get({ id: paymentId });

            const { status, external_reference } = payment;

            if (external_reference) {
                await Order.findByIdAndUpdate(external_reference, {
                    status: status === 'approved' ? 'paid' : status
                });
                console.log(`Order ${external_reference} updated to ${status}`);
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook error:", error);
        res.sendStatus(500);
    }
};
