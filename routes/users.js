const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { createUser, getUsers, getUserById, updateUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
module.exports = router;
