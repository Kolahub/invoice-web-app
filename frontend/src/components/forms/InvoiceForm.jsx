import React, { useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createInvoice, queryClient } from '../../utils/http';
import { processInvoiceFormData } from '../../utils/formUtils';
import CreateInvoiceForm from './CreateInvoiceForm';

function InvoiceForm({ isOpen, onClose }) {
  const formRef = useRef(null);
  const navigate = useNavigate();
  
  // Mutation for creating a new invoice
  const { mutate: createMutation, isPending: isCreating, error: submitError, reset } = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      // Invalidate the invoices query to refetch the list
      queryClient.invalidateQueries(['invoices']);
      toast.success('Invoice created successfully!');
      onClose();
      // Redirect to the new invoice detail page
      navigate('/');
    },
    onError: (error) => {
      console.log('Error creating invoice:😭😭', error.message);
      toast.error(error.message || 'Failed to create invoice');
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      
      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  });

  console.log('submitError', submitError);
  
  // Handle form submission
  const handleSubmit = (formData) => {
    console.log('Raw form data:', formData);
    
    // Get the status from formData or default to 'draft' for safety
    const status = formData.status || 'draft';
    
    // Process the form data using the shared utility with the correct status
    const processedData = processInvoiceFormData(formData, status);
    console.log('Processed data:', processedData);
    
    // Call the mutation with the processed data
    createMutation(processedData);
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
            className="fixed inset-0 bg-black/30 z-40"
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
            <CreateInvoiceForm 
              onCancel={onClose} 
              onSubmit={handleSubmit} 
              isLoading={isCreating}
              submitError={submitError}
            />
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default InvoiceForm;