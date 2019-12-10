const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const gobalErrorHandler = require('./controllers/errorController');

const app = express();
const toursRouter = require('./routes/tourRoutes');
const servicesRouter = require('./routes/servicesRoutes');
const usersRouter = require('./routes/userRoutes');

// 1) Middleware
///TODO:Remove Console Log
// console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  ///TODO:Remove Console Log
  // console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `The resource you are looking for may have changed or been removed completely. Can not find https://consultbrian.com${req.originalUrl}.`,
      404
    )
  );
});

app.use(gobalErrorHandler);

module.exports = app;
