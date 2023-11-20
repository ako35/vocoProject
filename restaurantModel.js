const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  logo: String,
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
  },
  branches: [],
  menus: [],
  cuisineTypes: [],
});

const restaurant = mongoose.model('restaurants', restaurantSchema);

module.exports = restaurant;
