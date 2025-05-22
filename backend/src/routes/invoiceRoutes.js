import express from 'express';
import {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
} from '../controllers/invoiceController.js';
import { validateInvoice, validateId } from '../validations/invoiceValidations.js';
import { checkObjectId } from '../config/db.js';

const router = express.Router();

// Get all invoices with optional query parameters
router.get('/', getAllInvoices);

// Get single invoice by ID
router.get('/:id', validateId, checkObjectId, getInvoice);

// Create a new invoice
router.post('/', validateInvoice, createInvoice);

// Update an existing invoice
router.put('/:id', validateId, checkObjectId, validateInvoice, updateInvoice);

// Delete an invoice
router.delete('/:id', validateId, checkObjectId, deleteInvoice);

// Update invoice status
router.patch(
  '/:id/status',
  validateId,
  checkObjectId,
  (req, res, next) => {
    // Validate status in the request body
    if (!req.body.status || !['pending', 'paid', 'draft'].includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be one of: pending, paid, draft',
      });
    }
    next();
  },
  updateInvoiceStatus
);

export default router;
