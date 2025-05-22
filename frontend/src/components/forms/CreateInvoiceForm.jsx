import React, { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import IconDelete from '../../assets/icon-delete.svg?react';

const CreateInvoiceForm = ({ onCancel, onSubmit, isLoading = false, initialData, isEditMode = false }) => {
  const [items, setItems] = useState(
    initialData?.items?.length > 0 
      ? initialData.items.map(item => ({
          ...item,
          id: item._id || Date.now() + Math.random(),
          quantity: parseFloat(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          total: parseFloat((item.quantity * item.price).toFixed(2)) || 0
        }))
      : [{ id: Date.now(), name: '', quantity: 1, price: 0, total: 0 }]
  );
  
  const [paymentTerms, setPaymentTerms] = useState(initialData?.paymentTerms || 30);
  const [invoiceDate, setInvoiceDate] = useState(
    initialData?.invoiceDate 
      ? new Date(initialData.invoiceDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );

  // Update item data and calculate total when quantity or price changes
  const updateItem = (id, field, value) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item };
          
          // Update the field that changed
          if (field === 'name') {
            updatedItem.name = value;
          } else {
            updatedItem[field] = parseFloat(value) || 0;
          }
          
          // Recalculate total when quantity or price changes
          if (field === 'quantity' || field === 'price') {
            const quantity = field === 'quantity' ? parseFloat(value) || 0 : updatedItem.quantity;
            const price = field === 'price' ? parseFloat(value) || 0 : updatedItem.price;
            updatedItem.total = parseFloat((quantity * price).toFixed(2));
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Calculate payment due date based on terms
  const calculatePaymentDue = useCallback((date, terms) => {
    const dueDate = addDays(new Date(date), terms);
    return dueDate.toISOString(); // Return ISO string for backend
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    
    // Process items
    const itemsData = items.map((item, index) => ({
      name: formValues[`itemName${index}`],
      quantity: parseFloat(formValues[`itemQty${index}`]),
      price: parseFloat(formValues[`itemPrice${index}`]),
      total: parseFloat((parseFloat(formValues[`itemQty${index}`]) * parseFloat(formValues[`itemPrice${index}`])).toFixed(2))
    }));

    // Calculate total amount
    const total = parseFloat(itemsData.reduce((sum, item) => sum + item.total, 0).toFixed(2));
    
    // Prepare invoice data according to backend schema
    const invoiceData = {
      billFrom: {
        street: formValues.streetAddress,
        city: formValues.city,
        postCode: formValues.postCode,
        country: formValues.country
      },
      billTo: {
        clientName: formValues.clientName,
        clientEmail: formValues.clientEmail,
        street: formValues.clientStreetAddress,
        city: formValues.clientCity,
        postCode: formValues.clientPostCode,
        country: formValues.clientCountry
      },
      invoiceDate: new Date(invoiceDate).toISOString(),
      paymentTerms: paymentTerms,
      projectDescription: formValues.projectDescription,
      items: itemsData,
      paymentDue: calculatePaymentDue(invoiceDate, paymentTerms),
      total: total
    };

    // In edit mode, we don't include status in updates
    if (!isEditMode) {
      invoiceData.status = e.nativeEvent.submitter?.value || 'pending';
    }

    // Call parent's onSubmit handler
    if (onSubmit) {
      onSubmit(invoiceData);
    }
  };



  const addNewItem = () => {
    setItems(prevItems => [...prevItems, { 
      id: Date.now() + Math.random(), 
      name: '', 
      quantity: 1, 
      price: 0,
      total: 0 
    }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <form id="invoice-form" onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-r-2xl p-6 md:p-8">
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                <p className="text-gray-800 dark:text-white">Saving invoice...</p>
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isEditMode ? (
              <>
                Edit <span className="text-sec-300">{initialData.invoiceId[0]}</span>
                {initialData.invoiceId.slice(1)}
              </>
            ) : 'New Invoice'}
          </h2>
      
      {/* Bill From */}
      <section className="mb-10">
        <p className="text-pri-100 font-semibold  mb-4">Bill From</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="19 Union Terrace"
              defaultValue={initialData?.billFrom?.street || ''}
              
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="London"
                defaultValue={initialData?.billFrom?.city || ''}
                
              />
            </div>
            <div>
              <label htmlFor="postCode" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Post Code</label>
              <input
                type="text"
                id="postCode"
                name="postCode"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="E1 3EZ"
                defaultValue={initialData?.billFrom?.postCode || ''}
                
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="country" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="United Kingdom"
                defaultValue={initialData?.billFrom?.country || ''}
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bill To */}
      <section className="mb-10">
        <p className="text-pri-100 font-semibold  mb-4">Bill To</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
              Client's Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Alex Grim"
              defaultValue={initialData?.billTo?.clientName || ''}
              
            />
          </div>
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
              Client's Email
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="alexgrim@mail.com"
              defaultValue={initialData?.billTo?.clientEmail || ''}
              
            />
          </div>
          <div>
            <label htmlFor="clientStreetAddress" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="clientStreetAddress"
              name="clientStreetAddress"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="84 Church Way"
              defaultValue={initialData?.billTo?.street || ''}
              
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="clientCity" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">City</label>
              <input
                type="text"
                id="clientCity"
                name="clientCity"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Bradford"
                defaultValue={initialData?.billTo?.city || ''}
                
              />
            </div>
            <div>
              <label htmlFor="clientPostCode" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Post Code</label>
              <input
                type="text"
                id="clientPostCode"
                name="clientPostCode"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="BD1 9PB"
                defaultValue={initialData?.billTo?.postCode || ''}
                
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="clientCountry" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Country</label>
              <input
                type="text"
                id="clientCountry"
                name="clientCountry"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="United Kingdom"
                defaultValue={initialData?.billTo?.country || ''}
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Details */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="invoiceDate" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              id="invoiceDate"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded  font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              
            />
          </div>
          <div>
            <label htmlFor="paymentTerms" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
              Payment Terms
            </label>
            <div className="relative">
              <select
                id="paymentTerms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(parseInt(e.target.value, 10))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded  font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 appearance-none pr-10"
                
              >
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pri-100">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="projectDescription" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
            Project Description
          </label>
          <input
            type="text"
            id="projectDescription"
            name="projectDescription"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Graphic Design"
            defaultValue={initialData?.projectDescription || ''}
            
          />
        </div>
      </section>

      {/* Item List */}
      <section className="mb-24">
        <h3 className="text-lg font-bold text-gray-500 mb-4">Item List</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-12 md:col-span-5">
                <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Item Name</label>
                <input
                  type="text"
                  name={`itemName${index}`}
                  defaultValue={item.name}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  
                />
              </div>
              <div className="col-span-3 md:col-span-2">
                <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Qty.</label>
                <input
                  type="number"
                  name={`itemQty${index}`}
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Price</label>
                <input
                  type="number"
                  name={`itemPrice${index}`}
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  
                />
              </div>
              <div className="col-span-3 md:col-span-2 flex flex-col">
                <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">Total</label>
                <div className="flex items-center h-12">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {item.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="col-span-1 flex items-end h-12">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="cursor-pointer text-sec-200 hover:text-err-100 p-2 -ml-2"
                  aria-label="Remove item"
                >
                  <IconDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addNewItem}
            className="cursor-pointer w-full py-3 bg-bg-100 dark:bg-gray-800 text-sec-300 dark:text-sec-200 font-bold  rounded-full hover:bg-sec-100 dark:hover:bg-gray-700 transition-colors mt-6"
          >
            + Add New Item
          </button>
        </div>
          </section>
        </form>
      </div>
      
      {/* Form Actions - Fixed to bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-between items-center max-w-full">
          {!isEditMode && (
            <button 
              type="button"
              onClick={onCancel}
              className="cursor-pointer px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Discard
            </button>
          )}
          <div className="flex items-center space-x-2 ml-auto">
            {isEditMode ? (
              <>
                <button 
                  type="button"
                  onClick={onCancel}
                  className="cursor-pointer px-6 py-3 bg-bg-100 dark:bg-gray-700 text-sec-300 dark:text-gray-300 font-bold rounded-full hover:bg-sec-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="invoice-form"
                  name="status"
                  value="update"
                  className="cursor-pointer px-6 py-3 bg-pri-100 text-white font-bold rounded-full hover:bg-pri-200 transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  form="invoice-form"
                  name="status"
                  value="draft"
                  className="cursor-pointer px-4 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  form="invoice-form"
                  name="status"
                  value="pending"
                  className="cursor-pointer px-4 py-3 bg-pri-100 text-white font-bold rounded-full hover:bg-purple-500 transition-colors"
                >
                  Save & Send
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
