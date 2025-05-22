import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchInvoices({status, signal}) {
    try {
      const params = new URLSearchParams();
      console.log(status, '😊😊😊');
      
      if (status) params.append('status', status);
  
      const response = await fetch(`${API_BASE_URL}/invoices?${params.toString()}`, {
        signal,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch invoices');
      }
  
       const { data } = await response.json();
       return data
      // return []
    } catch (error) {
      // Ignore AbortError
      if (error.name === 'AbortError') return;
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
  

export async function fetchInvoiceById({id, signal}) {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      signal,
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch invoice');
    }

    const { data } = await response.json();
    return data
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
}

export async function createInvoice(invoiceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create invoice');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export async function updateInvoice({id, updates, signal}) {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update invoice');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
}

export async function deleteInvoice({id, signal}) {
  try {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete invoice');
    }

    return true;
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    throw error;
  }
}