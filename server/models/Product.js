const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },

  description: {
    type: String,
    minlength: 1
  },

  price: {
    type: Number,
    required: true,
    minlength: 1,
  },

  stock: {
    type: Number,
    required: true,
    minlength: 1,
  },

  category: {
    type: String,
    required: true,
    minlength: 1,
  },

  subcategory: {
    type: String,
  },

  productImage: {
    type: String,
    required: true,
    minlength: 1,
  },
});

let Product = mongoose.model('Product', productSchema)

module.exports = Product;