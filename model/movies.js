const mongoose = require("mongoose");
const {genreSchema} = require("./genres");
const Joi = require('joi');
const movieSchema = new mongoose.Schema({
    title:{
        type: String, 
        required: true,
        trim: true,
        minlength:5,
        maxlength: 50,
        unique: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type:Number,
        default: 0,
        min:0
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min:0
    }
});

const Movie = mongoose.model("Movie",movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  }).unknown(true);

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;