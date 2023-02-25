const router = require('express').Router();
const { createCard, getCards, deletCardById } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deletCardById);

module.exports = router;
