import React, { useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createInvoice, queryClient } from '../../utils/http';
import { processInvoiceFormData } from '../../utils/formUtils';
import { disableBodyScroll, enableBodyScroll } from '../../utils/scrollLock';
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
      console.log('Invoice created successfully!');
      onClose();
      // Redirect to the new invoice detail page
      navigate('/');
    },
    onError: (error) => {
      console.log('Error creating invoice:😭😭', error.message);
      console.error('Failed to create invoice:', error);
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      
      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  });

  // console.log('submitError', submitError);
  
  // Handle form submission
  const handleSubmit = (formData, onComplete) => {
    console.log('Raw form data:', formData);
    
    // Get the status from formData or default to 'draft' for safety
    const status = formData.status || 'draft';
    
    // Process the form data using the shared utility with the correct status
    const processedData = processInvoiceFormData(formData, status);
    console.log('Processed data:', processedData);
    
    // Call the mutation with the processed data
    createMutation(processedData, {
      onSettled: () => {
        if (onComplete) onComplete();
      }
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

  // Handle background scroll locking and escape key
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose();

    if (isOpen) {
      disableBodyScroll();
      document.addEventListener('keydown', handleKeyDown);
    } else {
      enableBodyScroll();
    }

    return () => {
      enableBodyScroll();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Overlay */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
          />
          
          {/* Form */}
          <Motion.div
            ref={formRef}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 top-20 lg:top-0 w-full md:w-[38rem] bg-white dark:bg-bg-200 sm:rounded-r-2xl shadow-2xl z-50 pr-2 sm:pr-8 lg:pl-[120px] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateInvoiceForm 
              onCancel={onClose} 
              onSubmit={handleSubmit} 
              isLoading={isCreating}
              submitError={submitError}
            />
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default InvoiceForm;