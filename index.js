const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

//add this for all routes
require("express-async-errors");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const user = require("./routes/users");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
const error = require("./middleware/error");
const express = require("express");
const app = express();

//for test set it secret only
if(!config.get("JWT_SECRET")) {
  // console.log(process.env.VIDLY_JWT_SECRET);
  // console.log(config.get("JWT_SECRET")+" p");
  console.error("FATAL ERROR: jwt secret not found");
  process.exit(1);
}


if(!config.get("DB_URL")) {
  // console.log(process.env.VIDLY_JWT_SECRET);
  // console.log(config.get("JWT_SECRET")+" p");
  console.error("FATAL ERROR: database url not found");
  process.exit(1);
}


mongoose
  .connect(config.get("DB_URL"))
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use(cookieParser());

app.use("/genres", genres);
app.use("/customers", customers);
app.use("/movies", movies);
app.use("/rentals", rentals);
app.use("/user", user);
app.use("/auth", auth);
app.use(error);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit process to avoid unknown state
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
