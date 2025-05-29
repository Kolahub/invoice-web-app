import { configureStore, createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  invoicesCount: 0,
  invoices: [],
};

// Create invoice slice
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
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