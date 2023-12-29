const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  user_fName: {
    type: String,
    require: true,
  },
  user_lName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  data: {
    type: String,
  },
  preference: {
    type: [mongoose.Types.ObjectId],
    ref: 'Preference',
  },
  access_token: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
