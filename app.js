const express = require('express');
const morgan = require('morgan');

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
// app.use(express.static(`${__dirname}/public`));
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

module.exports = app;
