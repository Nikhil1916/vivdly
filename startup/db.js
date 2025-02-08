const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("DB_URL"))
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => {
      console.error("MongoDB connection failed:", err);
      throw err; // This will now be caught by process.on("unhandledRejection")
    });
};
