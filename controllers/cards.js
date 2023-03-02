const { default: mongoose } = require('mongoose');
const Card = require('../models/cards');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../errors/httpErros');

const {
  cardValidationError,
  defErrorMessage,
  cardFindError,
  cardLikeError,
  cardIdError,
} = require('../errors/badCardResponces');

function sendStatusMessage(res, code, message) {
  res.status(code).send({ message });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (name === undefined || link === undefined) {
    sendStatusMessage(res, BAD_REQUEST, cardValidationError);
    return;
  }
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, BAD_REQUEST, cardValidationError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new mongoose.Error.ValidationError();
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, NOT_FOUND, cardFindError);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, BAD_REQUEST, cardIdError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card == null) {
        throw new mongoose.Error.ValidationError();
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, NOT_FOUND, cardIdError);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, BAD_REQUEST, cardLikeError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card == null) {
        throw new mongoose.Error.ValidationError();
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        sendStatusMessage(res, NOT_FOUND, cardIdError);
        return;
      }

      if (err instanceof mongoose.Error.CastError) {
        sendStatusMessage(res, BAD_REQUEST, cardLikeError);
        return;
      }

      if (err instanceof mongoose.Error) {
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
      }
    });
};
