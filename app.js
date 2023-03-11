/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.set('strictQuery', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '640a1e2af504925872d653c0',
//   };

//   next();
// });
app.use('/users', users);
app.use('/cards', cards);
app.post('/signin', login);
app.post('/signup', createUser);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
