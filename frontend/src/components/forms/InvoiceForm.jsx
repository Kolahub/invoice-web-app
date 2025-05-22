import React, { useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import CreateInvoiceForm from './CreateInvoiceForm';
import { toast } from 'react-toastify';
import { createInvoice, updateInvoice } from '../../utils/http';

function InvoiceForm({ isOpen, onClose, invoiceToEdit, onUpdate }) {
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const isEditMode = !!invoiceToEdit;

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const formVariants = {
    hidden: { x: '-100%' },
    visible: { 
      x: 0,
      transition: { 
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    },
    exit: { 
      x: '-100%',
      transition: { 
        type: 'spring',
        damping: 30,
        stiffness: 300
      }
    }
  };

  // Create/Update invoice mutation
  const createMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      onClose();
      toast.success('Invoice created successfully!');
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      onClose();
      toast.success('Invoice updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice. Please try again.');
    }
  });

  // Handle form submission
  const handleSubmit = (formData) => {
    if (isEditMode) {
      onUpdate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay with animation */}
          <Motion.div
            className="fixed inset-0 bg-black/20"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
            role="presentation"
            aria-label="Close form overlay"
          />
          
          {/* Form Container with animation */}
          <Motion.div
            ref={formRef}
            className="fixed inset-y-0 left-0 w-full md:max-w-2xl bg-white dark:bg-gray-800 shadow-xl overflow-y-auto pl-[120px]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            aria-modal="true"
            role="dialog"
          >
            <div className="h-full flex flex-col">
              <CreateInvoiceForm 
                onCancel={onClose} 
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                initialData={invoiceToEdit}
                isEditMode={isEditMode}
              />
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default InvoiceForm;