import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0'],
  },
  total: {
    type: Number,
    default: 0,
  },
});

// Calculate total for each item
itemSchema.pre('save', function (next) {
  this.total = parseFloat((this.quantity * this.price).toFixed(2));
  next();
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: [true, 'Invoice ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^#[A-Z]{2}\d{4}$/, 'Invoice ID must be in the format #AA1234']
    },
    billFrom: {
      street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      postCode: {
        type: String,
        required: [true, 'Post code is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
    },
    billTo: {
      clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
      },
      clientEmail: {
        type: String,
        required: [true, 'Client email is required'],
        trim: true,
        lowercase: true,
      },
      street: {
        type: String,
        required: [true, 'Street is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      postCode: {
        type: String,
        required: [true, 'Post code is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
    },
    invoiceDate: {
      type: Date,
      required: [true, 'Invoice date is required'],
    },
    paymentTerms: {
      type: Number,
      required: [true, 'Payment terms are required'],
      enum: {
        values: [1, 7, 14, 30],
        message: 'Payment terms must be 1, 7, 14, or 30 days',
      },
    },
    paymentDue: {
      type: Date,
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    items: [itemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'draft'],
        message: 'Status must be pending, paid, or draft',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate payment due date and total amount before saving
invoiceSchema.pre('save', function (next) {
  if (this.isModified('invoiceDate') || this.isModified('paymentTerms')) {
    const dueDate = new Date(this.invoiceDate);
    dueDate.setDate(dueDate.getDate() + this.paymentTerms);
    this.paymentDue = dueDate;
  }
  
  // Calculate total amount
  if (this.items && this.items.length > 0) {
    this.totalAmount = parseFloat(
      this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)
    );
  }
  
  next();
});

// Add text index for search functionality
invoiceSchema.index(
  { 
    'billTo.clientName': 'text',
    'billTo.clientEmail': 'text',
    'projectDescription': 'text',
    'status': 'text'
  },
  { 
    weights: { 
      'billTo.clientName': 3,
      'billTo.clientEmail': 2,
      'projectDescription': 2,
      'status': 1
    },
    name: 'text_search_index'
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
