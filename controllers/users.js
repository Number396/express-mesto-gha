/* eslint-disable object-curly-newline */
const { default: mongoose } = require('mongoose');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const {
  userValidationError,
  userFindError,
  userValidationUpdateError,
  userValidationAvatarError,
  userIdError,
  userEmailConflictError,
  userAuthError,
} = require('../errors/badUserResponces');

const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

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
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        console.log('inside Validation');
        next(new BadRequestError(userValidationError));
      } else {
        console.log('500');
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
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
    .catch((err) => {
      console.log('inside catch:', err.name);
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        throw new NotFoundError(userFindError);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(userIdError));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user == null) {
        throw new NotFoundError(userFindError);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(userValidationUpdateError));
      } else {
        next(err);
      }
    });
};

module.exports.updataAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user == null) {
        console.log('inside if null');
        throw new NotFoundError(userFindError);
      }
      res.send(user);
    })
    .catch((err) => {
      console.log('-inside catch update avatar');
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(userValidationAvatarError));
      } else {
        console.log(err.name);
        next(err);
      }
    });
};
