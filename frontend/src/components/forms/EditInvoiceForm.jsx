import React, { useRef, useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSubmit, useNavigation, redirect, useActionData } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateInvoiceForm from './CreateInvoiceForm';
import { fetchInvoiceById, updateInvoice, queryClient } from '../../utils/http';
import { processInvoiceFormData } from '../../utils/formUtils';

function EditInvoiceForm({ isOpen, onClose }) {
  const formRef = useRef(null);
  const submit = useSubmit();
  const { id } = useParams();
  const { state } = useNavigation();
  const actionData = useActionData();
  const isUpdating = state === 'submitting';

  // Local state to manage error display
  const [displayError, setDisplayError] = useState(null);

  // Fetch invoice data
  const { data: invoiceData, isLoading, error } = useQuery({
    queryKey: ['invoices', id],
    queryFn: ({ queryKey, signal }) => fetchInvoiceById({ id: queryKey[1], signal }),
    enabled: isOpen && !!id,
  });

  // Handle actionData error with auto-clear after 5 seconds
  useEffect(() => {
    if (actionData?.error) {
      setDisplayError(actionData.error);
      
      const timer = setTimeout(() => {
        setDisplayError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [actionData?.error]);

  // Handle form submission
  const handleSubmit = (formData) => {
    // Clear any existing error when submitting
    setDisplayError(null);
    
    // Preserve the existing status if not provided in formData
    const status = formData.status || (invoiceData ? invoiceData.status : 'pending');
    const processedData = processInvoiceFormData(formData, status);
    
    // Submit as JSON to preserve nested objects
    submit(JSON.stringify(processedData), { 
      method: 'PUT',
      encType: 'application/json'
    });
  };

  // Animation variants
  const formVariants = {
    hidden: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.5,
        duration: 0.2
      }
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.5,
        duration: 0.2
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.5,
        duration: 0.2
      }
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <p>Loading invoice data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-red-500">Error loading invoice: {error.message}</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-40 "
            onClick={onClose}
          />
          
          {/* Form */}
          <Motion.div
            ref={formRef}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 top-20 lg:top-0 w-full md:w-[38rem] bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto lg:pl-[120px]"
            onClick={(e) => e.stopPropagation()}
          >
            {invoiceData && (
              <CreateInvoiceForm
                initialData={invoiceData}
                isEditMode={true}
                onCancel={onClose}
                onSubmit={handleSubmit}
                isLoading={isUpdating}
                submitError={displayError} // Use displayError instead of actionData?.error
              />
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Loader function for React Router
async function Loader({ params }) {
  if (!params.id) return null;
  
  const invoice = await queryClient.fetchQuery({
    queryKey: ['invoices', params.id],
    queryFn: ({signal}) => fetchInvoiceById({id: params.id, signal}),
  });
  
  return { invoice };
}

// Action function for handling form submission
async function Action({ request, params }) {
  const invoiceId = params.id;
  let updatedData;
  
  try {
    // Parse the JSON data from the request
    const requestData = await request.text();
    updatedData = JSON.parse(requestData);
    
    if (!updatedData) {
      throw new Error('No data provided');
    }
    
    console.log('Sending to server:', updatedData);
    
    await updateInvoice({ 
      id: invoiceId, 
      updateData: updatedData 
    });
    
    // Invalidate queries to refetch the updated data
    await queryClient.invalidateQueries(['invoices']);
    
    toast.success('Invoice updated successfully!');
    return redirect('..');
  } catch (error) {
    console.error('Update invoice error:', error);
    return {
      error
    };
  }
}

export default EditInvoiceForm;
export { Loader, Action };