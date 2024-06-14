const { body } = require('express-validator');

const registerAlumniValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('studentNumber')
    .notEmpty().withMessage('Student number is required'),
  body('name')
    .notEmpty().withMessage('Name is required'),
];

const loginAlumniValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

module.exports = {
  registerAlumniValidator,
  loginAlumniValidator,
};
