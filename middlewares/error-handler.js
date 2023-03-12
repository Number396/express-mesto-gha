const errorHandler = (err, req, res, next) => {
  console.log('inside error handler');
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500
    ? `На сервере произошла ошибка: ${err.message}`
    : err.message;
  console.log(statusCode);
  console.log(message);

  res.status(statusCode).send({ message });

  // res.status(err.statusCode).send({ message: err.message });

  next();
};

module.exports = errorHandler;
