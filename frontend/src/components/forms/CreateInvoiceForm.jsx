import React, { useState, useCallback, useEffect } from 'react';
import { addDays } from 'date-fns';
import BillFromSection from './BillFromSection';
import BillToSection from './BillToSection';
import InvoiceDetailsSection from './InvoiceDetailsSection';
import ItemListSection from './ItemListSection';
import FormActions from './FormActions';
import { Form, useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../assets/icon-arrow-left.svg?react';

const CreateInvoiceForm = ({ onCancel, onSubmit, initialData, isEditMode = false, submitError, isLoading }) => {
  const [isSaving, setIsSaving] = useState({ draft: false, pending: false, neutral: isLoading });
  const navigate = useNavigate()
  console.log(isSaving, isLoading);

  useEffect(() => {
    setIsSaving(prev => ({ ...prev, neutral: isLoading }));
  }, [isLoading]);
  
  // Convert array of errors to an object for easier access
  const errors = React.useMemo(() => {
    if (!submitError || !Array.isArray(submitError)) return {};
    return submitError.reduce((acc, error) => {
      const fieldName = Object.keys(error).find(key => key !== 'field');
      if (fieldName) {
        acc[fieldName] = error[fieldName];
      }
      return acc;
    }, {});
  }, [submitError]);
  console.log(errors);
  
  const [items, setItems] = useState(
    initialData?.items?.length > 0 
      ? initialData.items.map(item => ({
          ...item,
          id: item._id || Date.now() + Math.random(),
          quantity: parseFloat(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          total: parseFloat((item.quantity * item.price).toFixed(2)) || 0
        }))
      : [{ id: Date.now(), name: '', quantity: 0, price: 0, total: 0 }]
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
    
    // Get the clicked button's value (status) from the submit event
    const clickedButton = e.nativeEvent.submitter;
    const status = clickedButton?.value || 'draft';
    
    // Update the form data with the correct status
    formData.set('status', status);
    
    // Set loading state for the clicked button
    setIsSaving(prev => ({ ...prev, [status]: true }));
    
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

    // Call the onSubmit handler with the form data and reset loading state when done
    onSubmit(invoiceData, () => {
      setIsSaving(prev => ({ ...prev, [status]: false }));
    });
  };

  const addNewItem = () => {
    setItems(prevItems => [...prevItems, { 
      id: Date.now() + Math.random(), 
      name: '', 
      quantity: 0, 
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
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-6 md:px-8 pt-6 md:pt-8 flex-shrink-0">
        <button 
          type="button"
          onClick={() => navigate('..')}
          className="cursor-pointer group flex items-center gap-6 font-bold mb-6 md:hidden text-sec-400 dark:text-sec-200"
        >
          <div className="text-pri-100 group-hover:text-pri-200 transition-colors">
            <IconArrowLeft />
          </div>
          <span className="group-hover:text-sec-300 transition-colors">Go back</span>
        </button>
        <h2 className="text-2xl font-bold text-sec-400 dark:text-white mb-6">
          {isEditMode ? (
            <>
              Edit <span className="text-sec-300 dark:text-sec-200">{initialData.invoiceId[0]}</span>
              {initialData.invoiceId.slice(1)}
            </>
          ) : 'New Invoice'}
        </h2>
        </div>
        <Form 
          id="invoice-form" 
          onSubmit={handleSubmit} 
          className="bg-white dark:bg-bg-200 p-6 md:p-8 shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)] dark:shadow-[0px_10px_10px_-10px_rgba(0,0,0,0.25)] flex-1 overflow-y-auto custom-scrollbar"
        >
      
          <BillFromSection 
            initialData={initialData}
            errors={{
              streetAddress: errors.billFromStreet,
              city: errors.billFromCity,
              postCode: errors.billFromPostCode,
              country: errors.billFromCountry
            }}
          />
          
          <BillToSection 
            initialData={initialData}
            errors={{
              clientName: errors.billToClientName,
              clientEmail: errors.billToClientEmail,
              clientStreetAddress: errors.billToStreet,
              clientCity: errors.billToCity,
              clientPostCode: errors.billToPostCode,
              clientCountry: errors.billToCountry,
              projectDescription: errors.projectDescription
            }}
          />
          
          <InvoiceDetailsSection 
            initialData={initialData}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            paymentTerms={paymentTerms}
            setPaymentTerms={setPaymentTerms}
            errors={errors}
          />
          
          <ItemListSection 
            items={items}
            updateItem={updateItem}
            removeItem={removeItem}
            addNewItem={addNewItem}
            errors={errors}
          />
        </Form>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 md:right-auto md:left-0 md:bottom-0 md:w-[38rem] bg-white dark:bg-bg-200 border-t border-gray-100 dark:border-gray-700 z-10">
        <div className="px-6 py-4">
          <FormActions 
            isEditMode={isEditMode}
            isLoading={isSaving}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;