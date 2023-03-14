/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.set('strictQuery', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', users);
app.use('/cards', cards);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2),
  }).unknown(true),
}), createUser);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
  next();
});

app.use(errorHandler);
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
