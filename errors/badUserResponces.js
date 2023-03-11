const userValidationError = 'Переданы некорректные данные в методы создания пользователя';
const defErrorMessage = 'На сервере произошла ошибка';
const userFindError = 'Пользователь с указанным id не найден';
const userIdError = 'Переданы некорректные данные id';
const userValidationUpdateError = 'Переданы некорректные данные при обновлении профиля';
const userValidationAvatarError = 'Переданы некорректные данные при обновлении аватара';
const userEmailConflictError = 'При регистрации указан email, который уже существует на сервере.';
const userAuthError = 'Передан неверный логин или пароль';

module.exports = {
  userValidationError,
  defErrorMessage,
  userFindError,
  userValidationUpdateError,
  userValidationAvatarError,
  userIdError,
  userEmailConflictError,
  userAuthError,
};
