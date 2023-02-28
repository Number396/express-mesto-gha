const Card = require('../models/cards');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require('../errors/httpErros');

function sendStatusMessage(res, code, message) {
  res.status(code).send({ message });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // console.log(req.user._id);
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error) {
        // console.log('this is an error Name-----:', err.name);
        // console.log('this is an error Message-----:', userValidationError);
        sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
        // res.status(INTERNAL_SERVER_ERROR).send({ message: defErrorMessage });
      }
      // res.status(500).send({ message: err.message });
    });
};

module.exports.deletCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
