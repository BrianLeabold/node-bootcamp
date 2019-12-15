const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invaild ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDupFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value ${value}. Please use a different value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `${errors.join('. ')}`;
  return new AppError(message, 400);
};

// const handleJWTError = () =>
//   new AppError('Invalid token: Please login again.', 401);

const handleJWTError = () =>
  new AppError('Invalid authentication token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError(
    'Your authentication token has expired! Please log in again.',
    401
  );

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err.stack
  });
  //   console.log(err.stack);
};
const sendProdError = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Opps, something went wrong. Please try again.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // TODO: Remove spread operator after tesing is complete
    // let error = { ...err };

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDupFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

    sendProdError(err, res);
  }
};
