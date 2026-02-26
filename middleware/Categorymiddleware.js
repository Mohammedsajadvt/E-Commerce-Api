const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    next();
};

const validateCategory = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 80 }).withMessage('Name must be ≤ 80 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('Description must be ≤ 300 characters'),

    body('status')
        .optional()
        .isIn(['available', 'unavailable'])
        .withMessage('Status must be available | unavailable'),

    validate,
];

const validateCategoryId = [
    param('id').isMongoId().withMessage('Invalid category ID'),
    validate,
];

module.exports = { validateCategory, validateCategoryId };