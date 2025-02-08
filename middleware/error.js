const logger = require("../utils/logger");
require("express-async-errors"); //add this for all routes

module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    logger.error(err?.message, {
        meta: err
    });
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
}