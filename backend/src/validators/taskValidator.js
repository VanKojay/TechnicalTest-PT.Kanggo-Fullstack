const { body } = require('express-validator');

const taskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done']).withMessage('Status must be one of: pending, in-progress, done'),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601().withMessage('Deadline must be a valid date (YYYY-MM-DD format)')
    .toDate(),
];

const taskUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done']).withMessage('Status must be one of: pending, in-progress, done'),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601().withMessage('Deadline must be a valid date (YYYY-MM-DD format)')
    .toDate(),
];

module.exports = {
  taskValidation,
  taskUpdateValidation,
};
