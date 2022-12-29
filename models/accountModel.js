const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address'],
      unique: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: [false],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
