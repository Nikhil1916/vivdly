const { Rental, validate } = require("../model/rentals");
const { Movie } = require("../model/movies");
const { Customer } = require("../model/customers");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock.");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        emailId: customer.emailId,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    rental = await rental.save({session});

    // movie.numberInStock--;
    // movie.save();

    await Movie.updateOne(
      { _id: req.body.movieId },
      { $inc: { numberInStock: -1 } }, // 🔹 Decrement by 1
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    res.send(rental);
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).send(e?.message);
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
