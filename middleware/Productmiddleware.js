const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    next();
};

const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 120 }).withMessage('Name must be ≤ 120 characters'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Category must be a valid ID'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

    body('salePrice')
        .optional()
        .isFloat({ gt: 0 }).withMessage('Sale price must be a positive number')
        .custom((salePrice, { req }) => {
            if (parseFloat(salePrice) >= parseFloat(req.body.price))
                throw new Error('Sale price must be less than the regular price');
            return true;
        }),

    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('status')
        .optional()
        .isIn(['selling', 'out_of_stock', 'hidden'])
        .withMessage('Status must be selling | out_of_stock | hidden'),

    validate,
];

const validateProductId = [
    param('id').isMongoId().withMessage('Invalid product ID'),
    validate,
];

module.exports = { validateProduct, validateProductId };