const centralErrorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    if (err.message.includes('index: movieId')) {
      res.status(409).send({ message: 'Фильм с таким ID уже существует' });
    } else {
      res.status(409).send({ message: 'Пользователь с такой почтой уже существует' });
    }
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ message: err.message });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: err.message });
  } else if (err.statusCode === 404 || err.statusCode === 401
    || err.statusCode === 400 || err.statusCode === 403) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Непредвиденная ошибка сервера' });
  }
  next();
};

module.exports = centralErrorHandler;
