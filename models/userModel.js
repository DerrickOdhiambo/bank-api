const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
    },
  },
  { timestamps: true }
);

//static signup method
userSchema.statics.signup = async function (name, email, password) {
  //validations
  if (!name || !email || !password) {
    throw Error('All fields are required');
  }
  if (!validator.isEmail(email)) {
    throw Error('Please provide a valid email');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      'Password should be a minimum of 8 characters. It should contain an uppercase character, a lowercase and a special character'
    );
  }

  //checks to see if email exists in database
  const emailExists = await this.findOne({ email });

  //throw error if email exists
  if (emailExists) {
    throw Error('Email already in use');
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!validator.isEmail(email)) {
    throw Error('Please provide a valid email');
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error('User does not exist. Please sign up');
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
