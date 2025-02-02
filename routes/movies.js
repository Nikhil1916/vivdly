const express = require("express");
const { Movie, validate } = require("../model/movies");
const { Genre } = require("../model/genres");
class Movies {
  constructor() {
    this.router = express.Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.deleteRoute();
  }

  getRoutes() {
    this.router.get("/", async (req, res) => {
      try {
        const movies = await Movie.find({}).populate("genre");
        console.log(movies);
        res.send(movies);
      } catch (e) {
        res.status(400).send(e?.message);
      }
    });

    this.router.get("/:id", async (req, res) => {
      const movie = await Movie.findById(req.params.id);

      if (!movie)
        return res
          .status(404)
          .send("The movie with the given ID was not found.");

      res.send(movie);
    });
  }

  postRoutes() {
    this.router.post("/", async (req, res) => {
      try {
        const { error } = validate(req?.body);
        if (error) {
          return res.status(400).send(error?.details[0]?.message);
        }
        const { title, numberInStock, dailyRentalRate, genreId } = req?.body;
        const genre = await Genre.findById(genreId);
        if (!genre) {
          return res.status(400).send("Genre not found");
        }
        const movie = new Movie({
          title,
          genre: {
            _id: genre?._id,
            name: genre?.name,
          },
          numberInStock,
          dailyRentalRate,
        });
        await movie.save();
        res.json({
          movie,
        });
      } catch (e) {
        res.status(400).send(e?.message);
      }
    });
  }

  putRoutes() {
    this.router.put("/:id", async (req, res) => {
      try {
        const { error } = validate(req?.body);
        if (error) return res.status(400).send(error.details[0].message);
        const { title, genreId, numberInStock, dailyRentalRate } = req?.body;
        const genre = await Genre.findById(genreId);
        if (!genre) return res.status(400).send("Invalid genre.");

        const movie = await Movie.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              title,
              genre: {
                _id: genre._id,
                name: genre.name,
              },
              numberInStock,
              dailyRentalRate,
            },
          },
          {
            new: true,
          }
        );
        return res.json(movie);
      } catch (e) {
        return res.status(400).send(e?.message);
      }
    });
  }

  deleteRoute() {
    this.router.delete("/:id", async (req, res) => {
      const movie = await Movie.findByIdAndDelete(req.params.id);

      if (!movie)
        return res
          .status(404)
          .send("The movie with the given ID was not found.");

      res.send(movie);
    });
  }
}

module.exports = new Movies().router;
