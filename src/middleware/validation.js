// Simple validation middleware example
// In a real app, use Joi or Zod

exports.validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
        return res.status(400).json({ error: "Missing required fields: name, price, category" });
    }
    next();
};
