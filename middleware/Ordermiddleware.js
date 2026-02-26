const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    next();
};

const validateOrder = [
    body('customerName')
        .trim()
        .notEmpty().withMessage('Customer name is required')
        .isLength({ max: 100 }).withMessage('Customer name must be ≤ 100 characters'),

    body('items')
        .isArray({ min: 1 }).withMessage('Order must have at least one item'),

    body('items.*.product')
        .notEmpty().withMessage('Each item must reference a product')
        .isMongoId().withMessage('Product must be a valid ID'),

    body('items.*.quantity')
        .notEmpty().withMessage('Quantity is required for each item')
        .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),

    body('amount')
        .notEmpty().withMessage('Order amount is required')
        .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),

    body('method')
        .notEmpty().withMessage('Payment method is required')
        .isIn(['cash', 'card', 'online']).withMessage('Method must be cash | card | online'),

    body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),

    body('couponCode')
        .optional()
        .trim()
        .isAlphanumeric().withMessage('Coupon code must be alphanumeric')
        .toUpperCase(),

    validate,
];

const validateOrderStatus = [
    param('id').isMongoId().withMessage('Invalid order ID'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Status must be pending | confirmed | shipped | delivered | cancelled'),

    validate,
];

const validateOrderId = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validate,
];

module.exports = { validateOrder, validateOrderStatus, validateOrderId };