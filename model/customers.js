const mongoose = require("mongoose");
const Joi = require('joi');
const customerSchema = mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  emailId: {
    type: String,
    required: true,
    unique: true
  }
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(genre) {
  const schema = Joi.object({
    emailId: Joi.string().min(3).required(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean()
  })

  return schema.validate(genre);
}

module.exports = {Customer ,validateCustomer };