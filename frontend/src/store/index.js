import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  statusFilter: null, // 'null', 'draft', 'pending', 'paid'
  invoicesCount: 0,
};

// Create invoice slice
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    // Set status filter
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },

    setInvoiceCount(state, action) {
      state.invoicesCount = action.payload;
    },
    
    // Mark as paid
    markAsPaid(state, action) {
      const invoice = state.invoices.find(inv => inv.id === action.payload);
      if (invoice) {
        invoice.status = 'paid';
      }
    },
  },
});

// Export actions
export const {
  setStatusFilter,
  setInvoiceCount,
  markAsPaid,
} = invoiceSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    invoices: invoiceSlice.reducer,
  },
});

export default store;