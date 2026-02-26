const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
    next();
};

const validateCoupon = [
    body('campaignName')
        .trim()
        .notEmpty().withMessage('Campaign name is required')
        .isLength({ max: 100 }).withMessage('Campaign name must be ≤ 100 characters'),

    body('code')
        .trim()
        .notEmpty().withMessage('Coupon code is required')
        .isAlphanumeric().withMessage('Code must be alphanumeric (no spaces/symbols)')
        .isLength({ min: 4, max: 20 }).withMessage('Code must be 4–20 characters')
        .toUpperCase(),

    body('discount')
        .notEmpty().withMessage('Discount is required')
        .isFloat({ gt: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),

    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid date (ISO 8601)')
        .toDate(),

    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid date (ISO 8601)')
        .toDate()
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.startDate))
                throw new Error('End date must be after start date');
            return true;
        }),

    body('status')
        .optional()
        .isIn(['active', 'inactive', 'expired'])
        .withMessage('Status must be active | inactive | expired'),

    validate,
];

const validateCouponId = [
    param('id').isMongoId().withMessage('Invalid coupon ID'),
    validate,
];

module.exports = { validateCoupon, validateCouponId };