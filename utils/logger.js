const winston = require("winston");
const config = require("config");
require("winston-mongodb")
const transports = [
  new winston.transports.Console(), // Log to console
  new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
  new winston.transports.File({ filename: "logs/combined.log" }), // Log all levels to file,
]
if(config.get("DB_URL")) {
  transports.push(
    new winston.transports.MongoDB({
      db: config.get("DB_URL"), // Replace with your MongoDB URI
      collection: "log_entries", // Collection name where logs will be stored
      level: "info",
      options: { useUnifiedTopology: true },
      metaKey: "meta", // Store metadata under the "meta" field
    }),
  )
}
const logger = winston.createLogger({
  level: "error", // Minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log in JSON format
  ),
  transports
});

module.exports = logger
