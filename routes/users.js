const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updataAvatar,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

// router.get('/:userId', getUserById); такого запроса нет на фронте + есть users/me
// router.post('/', createUser);
router.get('/', auth, getUsers);

router.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.required(),
  }).unknown(true),
}), auth, getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
  headers: Joi.object().keys({
    authorization: Joi.required(),
  }).unknown(true),
}), auth, updateUser);

router.patch('/me/avatar', auth, updataAvatar);
module.exports = router;
