const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
};

// const { name, about } = req.body;
// User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//   .then((user) => {
//     if (user == null) {
//       sendStatusMessage(res, NOT_FOUND, userFindError);
//       return;
//     }
//     res.send(user);
//   })
//   .catch((err) => {
//     if (err instanceof mongoose.Error.ValidationError) {
//       sendStatusMessage(res, BAD_REQUEST, userValidationUpdateError);
//     } else {
//       sendStatusMessage(res, INTERNAL_SERVER_ERROR, defErrorMessage);
//     }
//   });
