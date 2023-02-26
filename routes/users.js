const router = require('express').Router();
// eslint-disable-next-line object-curly-newline
const { createUser, getUsers, getUserById, updateUser, updataAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updataAvatar);
module.exports = router;
