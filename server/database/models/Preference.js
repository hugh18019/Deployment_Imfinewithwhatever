const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
  restaurant_id: {
    type: String,
  },
  email: {
    type: String,
  },
  location: {
    type: String,
  },
  categories: {
    type: [String],
  },
  like: {
    type: String,
  },
});

module.exports = mongoose.model('Preference', preferenceSchema);
