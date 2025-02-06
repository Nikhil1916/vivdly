const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    logger.error(err?.message, err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
}