const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const gobalErrorHandler = require('./controllers/errorController');

const app = express();
const toursRouter = require('./routes/tourRoutes');
const servicesRouter = require('./routes/servicesRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewsRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) Global Middleware
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP Headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'You have made too many request from this IP address. Please try again later.'
});
app.use('/api', limiter);
// body-parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization to prevent NOSQL Query injection
app.use(mongoSanitize());
// Data sanitization to prevent XSS atacks
app.use(xss());
// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'difficulty', 'price']
  })
);
// Serving static files
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  next();
});

//Test Middleware TODO: remove prior to deployment
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
//Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

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
