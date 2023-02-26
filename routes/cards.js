const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { createCard, getCards, deletCardById, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deletCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
