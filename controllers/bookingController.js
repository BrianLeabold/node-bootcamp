const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
// const factory = require('./handlerFactory');
//const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getCheckouSession = catchAsync(async (req, res, next) => {
  // Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      req.params.tourId
      }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  // Create check out session response
  res.status(200).json({
    status: 'success',
    session
  });
});
