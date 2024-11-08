// backend/controllers/productController.js

const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, condition, tradeInAvailable } = req.body;
    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      condition,
      sellerId: req.user.userId, // assuming req.user is populated by auth middleware
      tradeInAvailable,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, condition, tradeInAvailable } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    // Ensure the user is the seller of the product
    if (product.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.images = images || product.images;
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.tradeInAvailable = tradeInAvailable !== undefined ? tradeInAvailable : product.tradeInAvailable;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    // Ensure the user is the seller of the product
    if (product.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await product.remove();
    res.json({ msg: 'Product removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
