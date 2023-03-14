const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    console.log('--inside auth');
    throw new UnauthorizedError('Необходима авторизация');
  }
  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, 'secret_code');
  } catch (err) {
    console.log('inside catch---');
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
