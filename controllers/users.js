/* eslint-disable object-curly-newline */
const { default: mongoose } = require('mongoose');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const {
  userValidationError,
  // defErrorMessage,
  userFindError,
  userValidationUpdateError,
  userValidationAvatarError,
  userIdError,
  userEmailConflictError,
  userAuthError,
} = require('../errors/badUserResponces');
// const {
//   BAD_REQUEST,
//   INTERNAL_SERVER_ERROR,
//   NOT_FOUND,
//   CONFLICT,
//   UNAUTHORIZED,
// } = require('../errors/httpErros');

const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
// const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

// function sendStatusMessage(res, code, message) {
//   res.status(code).send({ message });
// }

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcryptjs.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => User.findById(user._id.valueOf()))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        console.log('inside 11000');
        next(new ConflictError(userEmailConflictError));
        // sendStatusMessage(res, CONFLICT, userEmailConflictError);
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        console.log('inside Validation');
        next(new BadRequestError(userValidationError));
        // sendStatusMessage(res, BAD_REQUEST, userValidationError);
      } else {
        console.log('500');
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    // .orFail(() => new Error(userAuthError))
    .orFail(() => {
      throw new UnauthorizedError(userAuthError);
    })
    .then((user) => bcryptjs.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      throw new UnauthorizedError(userAuthError);
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'secret_code', { expiresIn: '7d' });
      res.send({ token: jwt });
    })
    // .catch(next);
    .catch((err) => {
      console.log('inside catch:', err.name);
      next(err);
      // sendStatusMessage(res, UNAUTHORIZED, err.message);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
      // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
    });
};

module.exports.getUserById = (req, res, next) => {
  // console.log(req.user);
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError(userFindError);
        // sendStatusMessage(res, NOT_FOUND, userFindError);
        // return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        // console.log('inside getUserById ');
        next(new BadRequestError(userIdError));
        // sendStatusMessage(res, BAD_REQUEST, userIdError);
      } else {
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user == null) {
        throw new NotFoundError(userFindError);
        // sendStatusMessage(res, NOT_FOUND, userFindError);
        // return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(userValidationUpdateError));
        // sendStatusMessage(res, BAD_REQUEST, userValidationUpdateError);
      } else {
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.updataAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: false })
    .then((user) => {
      if (user == null) {
        console.log('inside if null');
        throw new NotFoundError(userFindError);
        // sendStatusMessage(res, NOT_FOUND, userFindError);
        // return;
      }
      res.send(user);
    })
    .catch((err) => {
      console.log('inside catch update avatar');
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(userValidationAvatarError));
        // sendStatusMessage(res, BAD_REQUEST, userValidationAvatarError);
      } else {
        console.log(err.name);
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};
