const mongoose = require("mongoose");
const Joi = require('joi');
const PasswordComplexity = require("joi-password-complexity");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    min:5,
    max: 255
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    max:255
  },
  password: {
    type: String,
    required: true,
    max:1024
  }
});

const User = mongoose.model("User", userSchema);
const complexityOptions = {
    min: 8, // Minimum length of 8 characters
    max: 30, // Maximum length of 30 characters
    lowerCase: 1, // At least 1 lowercase letter
    upperCase: 1, // At least 1 uppercase letter
    numeric: 1, // At least 1 number
    symbol: 1, // At least 1 special character
    requirementCount: 4, // Ensures all requirements are met
};

function validate(user) {
  const schema = Joi.object({
    emailId: Joi.string().min(5).required(),
    name: Joi.string().min(5).required(),
    password: PasswordComplexity(complexityOptions).required()
  })

  return schema.validate(user);
}

module.exports = {User ,validate };