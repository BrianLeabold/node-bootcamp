const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const slugify = require('slugify');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter you name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter you email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 8,
    unique: true,
    trim: true,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE AND SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Your password and confirmPassword do not match'
    }
  },
  photo: String
});

userSchema.pre('save', async function(next) {
  // Only runs if password was modified
  if (!this.isModified('password')) return next();
  // Hash password
  this.password = await bcrypt.hash(this.password, 12);
  // Delete confimPassord field before persisting to the database
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
