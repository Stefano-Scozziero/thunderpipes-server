const productService = require('../services/productService');
const logger = require('../utils/logger');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        logger.error('Error fetching products', { error: error.message });
        res.status(500).json({ error: "Error fetching products" });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        logger.error('Error fetching product', { id: req.params.id, error: error.message });
        res.status(500).json({ error: "Error fetching product" });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const savedProduct = await productService.createProduct(req.body);
        res.status(201).json(savedProduct);
    } catch (error) {
        logger.error('Error creating product', { error: error.message });
        res.status(400).json({ error: "Error creating product", details: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
        res.json(updatedProduct);
    } catch (error) {
        logger.error('Error updating product', { id: req.params.id, error: error.message });
        res.status(400).json({ error: "Error updating product", details: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        logger.error('Error deleting product', { id: req.params.id, error: error.message });
        res.status(500).json({ error: "Error deleting product" });
    }
};
