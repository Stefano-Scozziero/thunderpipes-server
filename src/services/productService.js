const Product = require('../models/Product');

exports.getAllProducts = async () => {
    return await Product.find();
};

exports.getProductById = async (id) => {
    return await Product.findById(id);
};

exports.createProduct = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

exports.updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
};

exports.deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};
