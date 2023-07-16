const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error404 = require('../errors/Error404');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const getYourself = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ mail: user.email, name: user.name, userID: user._id }))
    .catch(next);
};
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ email: user.email, name: user.name });
      } else {
        throw new Error404('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};
const login = (req, res, next) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'not-so-secret key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      });
      res.send({ mail: email, userID: user._id });
    })
    .catch(next);
};
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(201).send({
        name, email,
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getYourself,
};
