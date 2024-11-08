// backend/routes/products.js

const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middlewares/auth'); // Assuming you have an auth middleware

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product (Seller only)
// @access  Private
router.post('/', auth, createProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/:productId
// @desc    Get product by ID
// @access  Public
router.get('/:productId', getProductById);

// @route   PUT /api/products/:productId
// @desc    Update a product (Seller only)
// @access  Private
router.put('/:productId', auth, updateProduct);

// @route   DELETE /api/products/:productId
// @desc    Delete a product (Seller only)
// @access  Private
router.delete('/:productId', auth, deleteProduct);

module.exports = router;
