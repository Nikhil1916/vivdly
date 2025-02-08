const logger = require("../utils/logger");
module.exports = function () {
  // we can use winston inbuilt function for exception as well
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    logger.error(err.message, { meta: err });
    process.exit(1); // Exit process to avoid unknown state
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    logger.error(err.message, { meta: err });
    process.exit(1);
  });
};
