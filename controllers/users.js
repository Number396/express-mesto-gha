/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const User = require('../models/users');
const {
  BAD_REQUEST,
  userValidationError,
  defErrorMessage,
  INTERNAL_SERVER_ERROR,
  userFindError,
  userValidationUpdateError,
  NOT_FOUND,
  userValidationAvatarError,
} = require('../errors/badUserResponces');

function sendStatusMessage(res, code, message) {
  res.status(code).send({ message });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(BAD_REQUEST, userValidationError);
        // res.status(BAD_REQUEST).send({ message: userValidationError });
        // console.log('this is an error Name-----:', err.name);
        // console.log('this is an error Message-----:', userValidationError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
        // res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }

      // res.status(500).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error) {
        // console.log('this is an error Name-----:', err.name);
        // console.log('this is an error Message-----:', userValidationError);
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
        // res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, BAD_REQUEST, userFindError);
        // res.status(BAD_REQUEST).send({ message: userFindError });
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
        // res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, BAD_REQUEST, userValidationUpdateError);
        // res.status(BAD_REQUEST).send({ message: userValidationUpdateError });
        // console.log('this is an error Name-----:', err.name);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, NOT_FOUND, userFindError);
        // res.status(NOT_FOUND).send({ message: userFindError });
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
        // res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }
    });
};

module.exports.updataAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, BAD_REQUEST, userValidationAvatarError);
        // res.status(BAD_REQUEST).send({ message: userValidationUpdateError });
        // console.log('this is an error Name-----:', err.name);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, NOT_FOUND, userFindError);
        // res.status(NOT_FOUND).send({ message: userFindError });
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
        // res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }
    });
};
