/**
 * Generates a unique invoice ID in the format #AA1234
 * @returns {string} Generated invoice ID
 */
const generateInvoiceId = () => {
  // Generate 2 random uppercase letters (A-Z)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = 
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length));
  
  // Generate 4 random digits (0-9)
  const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
  
  return `#${randomLetters}${randomNumbers}`;
};

/**
 * Generates a unique invoice ID and checks for uniqueness in the database
 * @param {Object} Invoice - Mongoose Invoice model
 * @returns {Promise<string>} Unique invoice ID
 */
const getUniqueInvoiceId = async (Invoice) => {
  let isUnique = false;
  let invoiceId;
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loops
  
  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    invoiceId = generateInvoiceId();
    
    // Check if the ID already exists in the database
    const existingInvoice = await Invoice.findOne({ invoiceId });
    
    if (!existingInvoice) {
      isUnique = true;
    }
  }
  
  if (!isUnique) {
    throw new Error('Could not generate a unique invoice ID after multiple attempts');
  }
  
  return invoiceId;
};

export { generateInvoiceId, getUniqueInvoiceId };
