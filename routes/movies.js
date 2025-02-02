const express = require("express");
const { Movie, validateMovie } = require("../model/movies");
const {Genre} = require("../model/genres");
class Movies {
    constructor() {
        this.router = express.Router();
        this.getRoutes();
        this.postRoutes();
    }

     getRoutes() {
        this.router.get("/",async (req,res)=>{
            try {
                const movies = await Movie.find({}).populate("genre");
                console.log(movies);
                res.send(movies);
            } catch(e) {
                res.status(400).send(e?.message);
            }
        })
    }

    postRoutes() {
        this.router.post("/",async(req,res)=>{
            console.log("post route reached")
            try {
                const {error} = validateMovie(req.body);
                if(error) {
                    return res.status(400).send(error?.details[0]?.message);
                }
                const {title, numberInStock, dailyRentalRate, genreId} = req.body;
                const genre = await Genre.findById(genreId);
                if(!genre) {
                    return res.status(400).send("Genre not found");
                }
                const movie = new Movie({
                    title,
                    genre: {
                        _id: genre?._id,
                        name: genre?.name
                    },
                    numberInStock,
                    dailyRentalRate
                });
                await movie.save();
                res.json({
                    movie
                })
            } catch(e) {
                res.status(400).send(e?.message);
            }
        })
    }
}

module.exports = new Movies().router;