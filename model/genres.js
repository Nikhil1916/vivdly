const mongoose = require("mongoose");
const Joi = require('joi');
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = mongoose.model(
  "Genre",
  genreSchema
);
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  }).unknown(true);
  return schema.validate(genre);
}
module.exports = {Genre, validateGenre, genreSchema};
