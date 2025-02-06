const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const user = require("./routes/users");
const auth = require("./routes/auth");
const cookieParser = require("cookie-parser");
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
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

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
