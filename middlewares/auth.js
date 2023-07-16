const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const auth = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return next(new Error401('Необходима авторизация'));
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'not-so-secret key');
  } catch (err) {
    return next(new Error401('Передан неверный jwt'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
