module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
}