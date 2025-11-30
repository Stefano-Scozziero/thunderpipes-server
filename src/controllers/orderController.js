const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { items, total, paymentId, preferenceId } = req.body;
        const userId = req.user.id; // From auth middleware

        const order = new Order({
            user: userId,
            items,
            total,
            paymentId,
            preferenceId,
            status: 'pending' // Default status
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Error al crear la orden" });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ error: "Error al obtener las órdenes" });
    }
};

exports.getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ error: "Error al obtener las órdenes del usuario" });
    }
};
