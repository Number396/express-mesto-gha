const { default: mongoose } = require('mongoose');
const Card = require('../models/cards');
// const {
//   BAD_REQUEST,
//   INTERNAL_SERVER_ERROR,
//   NOT_FOUND,
//   FORBIDDEN,
// } = require('../errors/httpErros');

const {
  cardValidationError,
  // defErrorMessage,
  cardFindError,
  cardLikeError,
  cardIdError,
  cardDeleteError,
} = require('../errors/badCardResponces');

const BadRequestError = require('../errors/bad-request-err');
// const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
// const ConflictError = require('../errors/conflict-err');

// function sendStatusMessage(res, code, message) {
//   res.status(code).send({ message });
// }

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(cardValidationError));
        // sendStatusMessage(res, BAD_REQUEST, cardValidationError);
      } else {
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      next(err);
      // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(() => {
      throw new NotFoundError(cardFindError);
      // new mongoose.Error(cardFindError);
    })
    .then((card) => {
      console.log(req.user._id, ':', card.owner.valueOf());
      if (req.user._id !== card.owner.valueOf()) {
        throw new ForbiddenError(cardDeleteError);
        // throw new mongoose.Error.ValidationError();
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send(card);
        });
    })
    .catch((err) => {
      console.log(err.name, err.code, err.message);
      // if (err instanceof mongoose.Error.ValidationError) {
      //   sendStatusMessage(res, FORBIDDEN, cardDeleteError);
      //   return;
      // }

      // if (err instanceof mongoose.Error) {
      //   sendStatusMessage(res, NOT_FOUND, err.message);
      //   return;
      // }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(cardIdError));
        // sendStatusMessage(res, BAD_REQUEST, cardIdError);
      } else {
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card == null) {
        throw new NotFoundError(cardFindError);
        // sendStatusMessage(res, NOT_FOUND, cardFindError);
        // return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(cardLikeError));
        // sendStatusMessage(res, BAD_REQUEST, cardLikeError);
      } else {
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card == null) {
        throw new NotFoundError(cardFindError);
        // sendStatusMessage(res, NOT_FOUND, cardFindError);
        // return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(cardLikeError));
        // sendStatusMessage(res, BAD_REQUEST, cardLikeError);
      } else {
        next(err);
        // sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};
