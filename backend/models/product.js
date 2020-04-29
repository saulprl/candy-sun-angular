const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  purchase_price: { type: Number, required: true },
  purchase_date: { type: Date, required: true },
  selling_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  calories: { type: Number, required: true },
  brand: { type: String, required: true },
  expiration: { type: Date, required: true }
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema);
