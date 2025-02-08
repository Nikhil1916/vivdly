const express = require("express");
const cookieParser = require("cookie-parser");
const error = require("../middleware/error");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const user = require("../routes/users");
const auth = require("../routes/auth");
module.exports = function(app) {
    app.use(express.json());
    app.use(cookieParser());
    
    app.use("/genres", genres);
    app.use("/customers", customers);
    app.use("/movies", movies);
    app.use("/rentals", rentals);
    app.use("/user", user);
    app.use("/auth", auth);
    app.use(error);
    
}