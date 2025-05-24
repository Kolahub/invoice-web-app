import { StatusCodes } from 'http-status-codes';
import Invoice from '../models/Invoice.js';
import { getUniqueInvoiceId } from '../utils/generateInvoiceId.js';

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
export const getAllInvoices = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build query object
    const queryObj = {};
    
    // Filter by status if provided
    if (status && ['pending', 'paid', 'draft'].includes(status)) {
      queryObj.status = status;
    }
    
    // Add search functionality if search query is provided
    if (req.query.search) {
      queryObj.$text = { $search: req.query.search };
    }
    
    // Execute query
    const invoices = await Invoice.find(queryObj)
      .sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    d(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
export const getInvoice = async (req, res, d) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No invoice found with id: ${req.params.id}`,
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    d(error);
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Public
export const createInvoice = async (req, res, d) => {
  try {
    // If status is not provided, default to 'pending'
    if (!req.body.status) {
      req.body.status = 'pending';
    }
    
    // Generate a unique invoice ID
    const invoiceId = await getUniqueInvoiceId(Invoice);
    
    // Create the invoice with the generated ID
    const invoice = await Invoice.create({
      ...req.body,
      invoiceId
    });
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    d(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Public
export const updateInvoice = async (req, res, d) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No invoice found with id: ${req.params.id}`,
      });
    }
    
    // Update the invoice with the new data
    invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    d(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Public
export const deleteInvoice = async (req, res, d) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No invoice found with id: ${req.params.id}`,
      });
    }
    
    // Using deleteOne instead of remove
    await Invoice.deleteOne({ _id: req.params.id });
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    d(error);
  }
};

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id/status
// @access  Public
export const updateInvoiceStatus = async (req, res, d) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'paid', 'draft'].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Status must be one of: pending, paid, draft',
      });
    }
    
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `No invoice found with id: ${req.params.id}`,
      });
    }
    
    // Update the status
    invoice.status = status;
    await invoice.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    d(error);
  }
};
