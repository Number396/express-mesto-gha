const { default: mongoose } = require('mongoose');
const User = require('../models/users');
const {
  userValidationError,
  defErrorMessage,
  userFindError,
  userValidationUpdateError,
  userValidationAvatarError,
} = require('../errors/badUserResponces');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../errors/httpErros');

function sendStatusMessage(res, code, message) {
  res.status(code).send({ message });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(BAD_REQUEST, userValidationError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, BAD_REQUEST, userFindError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, BAD_REQUEST, userValidationUpdateError);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, NOT_FOUND, userFindError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.updataAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, BAD_REQUEST, userValidationAvatarError);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, NOT_FOUND, userFindError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};
