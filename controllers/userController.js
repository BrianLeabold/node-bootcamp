const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.checkID = (req, res, next, val) => {
  console.log(`User id = ${val}`);
  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

// Get all Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
// Get a specific User
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet refined.'
  });
};
// Create a new User
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet refined.'
  });
};
// Update a specific User
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet refined.'
  });
};
// Delete a specific service
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet refined.'
  });
};
