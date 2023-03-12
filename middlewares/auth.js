const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    console.log('--inside auth');
    throw new UnauthorizedError('Необходима авторизация');
    // return res.status(401).send({ message: 'Передан неверный логин или пароль' });
  }
  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, 'secret_code');
  } catch (err) {
    console.log('inside catch---');
    next(new UnauthorizedError('Необходима авторизация'));
    // return res.status(401).send({ message: 'Передан неверный логин или пароль' });
  }
  req.user = payload;
  // console.log(payload);
  next();
};
