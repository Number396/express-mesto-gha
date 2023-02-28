const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const userValidationError = 'Переданы некорректные данные в методы создания пользователя';
const defErrorMessage = 'На сервере произошла ошибка';
const userFindError = 'Пользователь с указанным id не найден';
const userValidationUpdateError = 'Переданы некорректные данные при обновлении профиля';
const userValidationAvatarError = 'Переданы некорректные данные при обновлении аватара';

module.exports = {
  BAD_REQUEST,
  userValidationError,
  defErrorMessage,
  INTERNAL_SERVER_ERROR,
  userFindError,
  userValidationUpdateError,
  NOT_FOUND,
  userValidationAvatarError,
};
