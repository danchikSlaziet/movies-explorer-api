const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const commonRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const Error404 = require('./errors/Error404');
const centralErrorHandler = require('./middlewares/centralErrorHandler');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

mongoose.connect(MONGODB_URL)
  .then(() => console.log('MongoDB подключён'))
  .catch(() => console.log('MongoDB не подключён'));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
app.get('/signout', (req, res) => {
  // вот здесь кука удаляется, у меня всё работает и удаляется
  res.clearCookie('jwt', { httpOnly: true });
  res.status(200).json({ message: 'кука удалена' });
});

app.use(auth);
app.use('/', commonRouter);
app.use('/*', (req, res, next) => {
  next(new Error404('Кривой маршрут, прочитайте документацию к API'));
});
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
