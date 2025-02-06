const winston = require("winston");
const logger = winston.createLogger({
  level: "error", // Minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Log in JSON format
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
    new winston.transports.File({ filename: "logs/combined.log" }) // Log all levels to file
  ],
});

module.exports = logger
