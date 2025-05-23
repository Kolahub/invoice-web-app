import React, { useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import CreateInvoiceForm from './CreateInvoiceForm';
import { toast } from 'react-toastify';
import { createInvoice, fetchInvoiceById, queryClient, updateInvoice } from '../../utils/http';
import { redirect, useNavigation, useParams, useSubmit } from 'react-router-dom';

function InvoiceForm({ isOpen, onClose, editMode = false }) {
  const formRef = useRef(null);
  const submit = useSubmit()
  const params = useParams()
  const { state } = useNavigation()
  const queryClient = useQueryClient();
  const isEditMode = editMode;

  const updateIsPending = state === 'submitting';

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

  const { data: invoice } = useQuery({
    queryKey: ['invoices', params.id],
    queryFn: ({ signal }) => fetchInvoiceById({ signal, id: params.id }),
  })

  // Create/Update invoice mutation
  const {mutate: createMutation, isPending: createIsPending} = useMutation({
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

  // Handle form submission
  const handleSubmit = (formData) => {
    // Create a deep copy of formData to avoid mutating the original
    const processedData = JSON.parse(JSON.stringify(formData));
    
    // Convert string numbers to actual numbers
    const numberFields = ['total', 'paymentTerms'];
    numberFields.forEach(field => {
      if (processedData[field]) {
        processedData[field] = Number(processedData[field]);
      }
    });
    
    // Convert postCode to number in billFrom and billTo
    if (processedData.billFrom?.postCode) {
      processedData.billFrom.postCode = Number(processedData.billFrom.postCode);
    }
    if (processedData.billTo?.postCode) {
      processedData.billTo.postCode = Number(processedData.billTo.postCode);
    }
    
    // Ensure items is an array and process each item
    if (processedData.items && Array.isArray(processedData.items)) {
      processedData.items = processedData.items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        total: Number(item.total) || 0
      }));
    }

    if (isEditMode) {
      submit(processedData, { 
        method: 'PUT',
        encType: 'application/json'
      });
    } else {
      createMutation(processedData);
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
            key="overlay"
            className="fixed inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={onClose}
            role="presentation"
            aria-label="Close form overlay"
          />
          
          {/* Form Container with animation */}
          <Motion.div
            key="form"
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
                isLoading={createIsPending || updateIsPending}
                initialData={invoice}
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

export function Loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ['invoices', params.id],
    queryFn: ({ signal }) => fetchInvoiceById({ signal, id: params.id }),
  });
}

export async function Action({ request, params }) {
  const invoiceId = params.id;
  const formData = await request.json();
  
  // Ensure we have valid data
  if (!formData) {
    throw new Error('No data provided');
  }
  
  console.log('Sending to server:', formData);
  
  try {
    await updateInvoice({ 
      id: invoiceId, 
      updateData: formData 
    });
    await queryClient.invalidateQueries(['invoices']);
  } catch (error) {
    console.error(error);
    throw error;
  }

  return redirect('../');
}