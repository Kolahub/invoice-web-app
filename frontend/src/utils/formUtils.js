/**
 * Processes form data for invoice submission
 * @param {Object} formData - The raw form data
 * @param {string} [status='pending'] - The status to set for the invoice
 * @returns {Object} Processed form data with proper types and structure
 */
export function processInvoiceFormData(formData, status = 'pending') {
  try {
    // Create a deep copy of formData to avoid mutating the original
    const processedData = JSON.parse(JSON.stringify(formData));
    
    // Set the status
    processedData.status = status;
    
    // Ensure required fields exist
    if (!processedData.billFrom) throw new Error('Bill From information is required');
    if (!processedData.billTo) throw new Error('Bill To information is required');
    if (!processedData.items?.length) throw new Error('At least one item is required');
    
    // Process billFrom - ensure required fields exist and are strings
    if (processedData.billFrom) {
      processedData.billFrom = {
        ...processedData.billFrom, // Preserve all existing fields
        street: String(processedData.billFrom.street || ''),
        city: String(processedData.billFrom.city || ''),
        postCode: String(processedData.billFrom.postCode || ''),
        country: String(processedData.billFrom.country || '')
      };
    }
    
    // Process billTo - ensure required fields exist and are strings
    if (processedData.billTo) {
      processedData.billTo = {
        ...processedData.billTo, // Preserve all existing fields
        clientName: String(processedData.billTo.clientName || processedData.billTo.name || ''),
        clientEmail: String(processedData.billTo.clientEmail || processedData.billTo.email || ''),
        street: String(processedData.billTo.street || ''),
        city: String(processedData.billTo.city || ''),
        postCode: String(processedData.billTo.postCode || ''),
        country: String(processedData.billTo.country || '')
      };
      
      // Remove the old name/email fields if they exist
      if (processedData.billTo.name) delete processedData.billTo.name;
      if (processedData.billTo.email) delete processedData.billTo.email;
    }
    
    // Process invoice date and payment terms
    processedData.invoiceDate = processedData.invoiceDate || new Date().toISOString().split('T')[0];
    processedData.paymentTerms = Number(processedData.paymentTerms) || 30;
    processedData.paymentDue = processedData.paymentDue || 
      new Date(new Date(processedData.invoiceDate).getTime() + (processedData.paymentTerms * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    // Process items
    if (processedData.items && Array.isArray(processedData.items)) {
      processedData.items = processedData.items.map(item => ({
        name: String(item.name || ''),
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        total: Number((Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2))
      }));
      
      // Calculate total
      processedData.total = processedData.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    }
    
    return processedData;
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error(`Failed to process form data: ${error.message}`);
  }
}
