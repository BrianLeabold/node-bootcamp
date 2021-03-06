/* eslint-disable prettier/prettier */
const expresss = require('express');
const viewController = require('../controllers/viewController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = expresss.Router();

router.use(viewController.alerts);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
// Finish implementation TODO: ====
router.get('/forgotpassword', viewController.getForgotPasswordForm);
router.get('resetpassword', viewController.getResetForm);
// ===========================

router.get('/me', authController.protect, viewController.getAccount);
router.get(
    '/my-tours',
    // bookingController.createBookingCheckout, 
    authController.protect,
    viewController.getMyTours
);

router.post(
    '/submit-user-data', authController.protect,
    viewController.updateUserData
);

module.exports = router;
