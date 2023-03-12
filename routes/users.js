const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updataAvatar,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getUsers);
// router.get('/:userId', getUserById);
router.get('/me', auth, getUserById);
// router.post('/', createUser);
router.patch('/me', auth, updateUser);
router.patch('/me/avatar', auth, updataAvatar);
module.exports = router;
