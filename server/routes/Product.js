const express = require('express');
const Product = require('../models/Product');
const router = new express.Router();

// Auth Middleware
const userAuth = require('../middleware/UserAuth');

// Admin Users can only create a new Product
router.post('/product', userAuth, async (req, res) => {
  if (req.user.isAdmin) {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      productImage: req.body.productImage,
      subcategory: req.body.subcategory,
      stock: req.body.stock,
      price: req.body.price,
    });

    try {
        await product.save();
        res.status(201).send(product);
      } catch (err) {
        res.status(400).send()
      }
  } else {
    throw new Error('Non admin users cannot add new products.');
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.send(products)
  } catch (err) {
    res.status(500).send();
  }
});


// DELETE PRODUCT BY ITS ID
router.delete('/product/:id', userAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });

    if (!product) {
      return res.status(404).send()
    }

    res.status(200).send(product)
  } catch (err) {
    res.status(500).send(err)
  }
});

router.get('/product/:category/:subcategory/:id', async (req, res) => {
  let _id = req.params.id;
  let category = req.params.category;
  let subcategory = req.params.subcategory;

  try {
    const product = await Product.find({ _id, category, subcategory })
      
    if (!product) {
      return res.status(404).send()
    };

    res.send(product)
  } catch(err) {
    res.status(500).send(err)
  }
})

module.exports = router;