const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');
const Movie = require('../models/movie');

const getAllMovies = (req, res, next) => {
  Movie.find({}, '-_id')
    .then((movie) => res.send(movie))
    .catch(next);
};
const addNewMovie = (req, res, next) => {
  const {
    name,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    name,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.send({
        name: movie.name,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
        owner: movie.owner,
      });
    })
    .catch(next);
};
const deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new Error404('Фильм с данным ID не найден');
      } else if (movie.owner.toString() === req.user._id.toString()) {
        Movie.findOneAndRemove({ movieId: req.params.movieId })
          .then((movieItem) => res.send({
            name: movieItem.name,
            country: movieItem.country,
            director: movieItem.director,
            duration: movieItem.duration,
            year: movieItem.year,
            description: movieItem.description,
            image: movieItem.image,
            trailerLink: movieItem.trailerLink,
            nameRU: movieItem.nameRU,
            nameEN: movieItem.nameEN,
            thumbnail: movieItem.thumbnail,
            movieId: movieItem.movieId,
            owner: movieItem.owner,
          }))
          .catch(next);
      } else {
        throw new Error403('у вас нет прав на удаление чужого фильма');
      }
    })
    .catch(next);
};

module.exports = {
  getAllMovies,
  addNewMovie,
  deleteMovie,
};
