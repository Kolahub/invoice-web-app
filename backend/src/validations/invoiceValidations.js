import { body, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// Helper function to convert field path to camelCase
const formatFieldName = (fieldPath) => {
  // Handle undefined, null, or non-string values
  if (!fieldPath || typeof fieldPath !== 'string') {
    return 'unknown';
  }
  
  return fieldPath
    .split('.')
    .map((part, index) => {
      if (index === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
};

// Validation middleware for creating/updating an invoice
export const validateInvoice = [
  // Bill From validation
  body('billFrom.street').notEmpty().withMessage('Street is required'),
  body('billFrom.city').notEmpty().withMessage('City is required'),
  body('billFrom.postCode').notEmpty().withMessage('Post code is required'),
  body('billFrom.country').notEmpty().withMessage('Country is required'),
  
  // Bill To validation
  body('billTo.clientName').notEmpty().withMessage('Client name is required'),
  body('billTo.clientEmail')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('billTo.street').notEmpty().withMessage('Street is required'),
  body('billTo.city').notEmpty().withMessage('City is required'),
  body('billTo.postCode').notEmpty().withMessage('Post code is required'),
  body('billTo.country').notEmpty().withMessage('Country is required'),
  
  // Invoice details validation
  body('invoiceDate').isISO8601().withMessage('Please provide a valid date'),
  body('paymentTerms')
    .isIn([1, 7, 14, 30])
    .withMessage('Payment terms must be 1, 7, 14, or 30 days'),
  body('projectDescription')
    .notEmpty()
    .withMessage('Project description is required'),
  
  // Items validation
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.quantity')
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be greater than 0'),
  body('items.*.price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
  
  // Status validation
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'draft'])
    .withMessage('Status must be pending, paid, or draft'),

  // Custom validation to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => {
        // Safely get the field name, fallback to 'unknown' if param is missing
        const fieldParam = error.param || error.path || 'unknown';
        const formattedFieldName = formatFieldName(fieldParam);
        
        return {
          field: formattedFieldName,
          [formattedFieldName]: error.msg || 'Validation error',
        };
      });
      
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    next();
  },
];

// Validation for ID parameter
export const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid invoice ID format'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.param,
          [err.param]: err.msg
        })),
      });
    }
    next();
  },
];