const { default: mongoose } = require('mongoose');
const User = require('../models/users');
const {
  ERROR_CODE,
  userValidationError,
  defErrorMessage,
  INTERNAL_SERVER_ERROR,
} = require('../errors/badUserRequest');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_CODE).send({ message: userValidationError });
        // console.log('this is an error Name-----:', err.name);
        // console.log('this is an error Message-----:', userValidationError);
      }

      if (err instanceof mongoose.Error) {
        res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }

      // res.status(500).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error) {
        console.log('this is an error Name-----:', err.name);
        console.log('this is an error Message-----:', userValidationError);
        res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log('this is an error name-----:', err.name);
      console.log('this is an error message-----:', err.message);
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.updataAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
