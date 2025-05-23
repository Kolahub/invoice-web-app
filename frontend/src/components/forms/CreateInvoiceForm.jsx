import React, { useState, useCallback } from 'react';
import { addDays } from 'date-fns';
import BillFromSection from './BillFromSection';
import BillToSection from './BillToSection';
import InvoiceDetailsSection from './InvoiceDetailsSection';
import ItemListSection from './ItemListSection';
import FormActions from './FormActions';

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
      ? new Date(initialData.invoiceDate)
      : new Date()
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
      invoiceDate: invoiceDate.toISOString(),
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isEditMode ? (
              <>
                Edit <span className="text-sec-300">{initialData.invoiceId[0]}</span>
                {initialData.invoiceId.slice(1)}
              </>
            ) : 'New Invoice'}
          </h2>
      
          <BillFromSection initialData={initialData} />
          
          <BillToSection initialData={initialData} />
          
          <InvoiceDetailsSection 
            initialData={initialData}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            paymentTerms={paymentTerms}
            setPaymentTerms={setPaymentTerms}
          />
          
          <ItemListSection 
            items={items}
            updateItem={updateItem}
            removeItem={removeItem}
            addNewItem={addNewItem}
          />
        </form>
      </div>
      
      <FormActions 
        isEditMode={isEditMode}
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CreateInvoiceForm;