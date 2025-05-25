import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchInvoiceById, deleteInvoice, updateInvoiceStatus } from '../utils/http';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal';
import { format } from 'date-fns';
import IconArrowLeft from '../assets/icon-arrow-left.svg?react';


function InvoiceDetail() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteInvoiceMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      navigate('/');
    },
  });
  
  const handleDelete = () => {
    deleteInvoiceMutation({ id });
  };

  // Mutation for updating invoice status
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      queryClient.invalidateQueries(['invoice', { id }]);
      toast.success(`Invoice marked as ${invoice.status === 'paid' ? 'unpaid' : 'paid'} successfully!`);
    },
    onError: (error) => {
      console.error('Error updating invoice status:', error);
      toast.error(error.message || 'Failed to update invoice status');
    },
  });

  // Toggle between paid and pending status
  const handleStatusToggle = () => {
    const newStatus = invoice.status === 'paid' ? 'pending' : 'paid';
    updateStatus({ id, status: newStatus });
  };
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: invoice, isPending, error } = useQuery({
    queryKey: ['invoice', { id }],
    queryFn: ({ queryKey, signal }) => fetchInvoiceById({...queryKey[1], signal}),
    // Don't retry on 404 errors
    retry: (failureCount, error) => {
      if (error.message.includes('404')) return false;
      return failureCount < 3; // Retry other errors up to 3 times
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pri-100"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">
          {error.message.includes('404') 
            ? 'Invoice not found' 
            : 'Failed to load invoice. Please try again.'}
        </p>
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-8 text-center">No invoice data available</div>;
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  const calculateDueDate = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return format(date, 'dd MMM yyyy');
  };

  return (
    <>
    <div className="pb-32 sm:pb-12 pt-[105px] md:pt-[129px] lg:pt-[65px]">
      <button 
        onClick={() => navigate('/')}
        className="cursor-pointer group flex items-center gap-6 font-bold mb-8"
      >
        <div className="text-pri-100 group-hover:text-pri-200">
          <IconArrowLeft />
        </div>
        <p className='group-hover:text-sec-300'>Go back</p>
      </button>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 sm:flex sm:items-center sm:justify-between">
        <div className="flex justify-between items-center sm:gap-5">
          <span className="text-sec-300 dark:text-gray-400 text-sm md:text-base">Status</span>
          <div className={`px-4 py-2.5 rounded-md flex items-center font-bold ${
            invoice.status === 'draft' 
              ? 'bg-gray-100 text-gray-950 dark:bg-gray-900/30 dark:text-gray-400'
              : invoice.status === 'pending' ? 'bg-orange-100 text-orange-400 dark:bg-orange-900/30 dark:text-orange-400'
              : 'bg-green-100 text-green-400 dark:bg-green-900/30 dark:text-green-400' 
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              invoice.status === 'draft' ? 'bg-gray-950' : invoice.status ==='pending' ? 'bg-orange-400' : 'bg-green-400'
            }`}></span>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </div>
        </div>
        
        {/* Mobile Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-6 flex justify-between sm:hidden">
          <button 
            onClick={() => navigate('edit')}
            className="cursor-pointer flex-1 max-w-[73px] h-12 bg-bg-100 hover:bg-sec-100 text-sec-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full font-bold"
          >
            Edit
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="cursor-pointer flex-1 max-w-[89px] h-12 bg-err-100 hover:bg-err-200 text-white dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400 rounded-full font-bold ml-2"
            disabled={isDeleting}
          >
            Delete
          </button>
          <button 
            onClick={handleStatusToggle}
            disabled={isUpdatingStatus}
            className="cursor-pointer flex-1 max-w-[149px] h-12 bg-pri-100 hover:bg-pri-200 text-white rounded-full font-bold ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingStatus 
              ? 'Updating...' 
              : `Mark as ${invoice.status === 'paid' ? 'Unpaid' : 'Paid'}`}
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={() => navigate('edit')}
            className="cursor-pointer px-4 py-2 bg-bg-100 hover:bg-sec-100 text-sec-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full font-bold"
          >
            Edit
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="cursor-pointer px-4 py-2 bg-err-100 hover:bg-err-200 text-white dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400 rounded-full font-bold text-sm"
            disabled={isDeleting}
          >
            Delete
          </button>
          <button 
            onClick={handleStatusToggle}
            disabled={isUpdatingStatus}
            className="cursor-pointer px-4 py-2 bg-pri-100 hover:bg-pri-200 text-white rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingStatus 
              ? 'Updating...' 
              : `Mark as ${invoice.status === 'paid' ? 'Unpaid' : 'Paid'}`}
          </button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              <span className="text-sec-300">{invoice.invoiceId[0]}</span>
              {invoice.invoiceId.slice(1)}
            </h1>
            <p className="text-sec-300 font-medium dark:text-gray-400 text-sm md:text-base">{invoice.projectDescription}</p>
          </div>
          <div className="text-left md:text-right text-sec-300 font-medium dark:text-gray-400 text-lg">
            <p>{invoice.billFrom.street}</p>
            <p>{invoice.billFrom.city}</p>
            <p>{invoice.billFrom.postCode}</p>
            <p>{invoice.billFrom.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 md:mb-12">
          <div className="col-span-1">
            <h3 className="text-sec-300 font-medium dark:text-gray-400 text-sm md:text-sm mb-2 md:mb-4">Invoice Date</h3>
            <p className="font-bold">{formatDate(invoice.invoiceDate)}</p>
            
            <h3 className="text-sec-300 font-medium dark:text-gray-400 text-sm mt-6 md:mt-8 mb-2 md:mb-4">Payment Due</h3>
            <p className="font-bold">{calculateDueDate(invoice.invoiceDate, invoice.paymentTerms)}</p>
          </div>
          <div className="col-span-1">
            <h3 className="text-sec-300 font-medium dark:text-gray-400 text-sm mb-2 md:mb-4">Bill To</h3>
            <p className="font-bold mb-2">{invoice.billTo.clientName}</p>
            <p className="text-sec-300 font-medium dark:text-gray-400 text-lg">
              {invoice.billTo.street}<br />
              {invoice.billTo.city}<br />
              {invoice.billTo.postCode}<br />
              {invoice.billTo.country}
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 mt-6 md:mt-0">
            <h3 className="text-sec-300 font-medium dark:text-gray-400 text-sm md:text-sm mb-2 md:mb-4">Sent to</h3>
            <p className="font-bold text-base">{invoice.billTo.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-bg-100 dark:bg-gray-700 rounded-t-lg p-6 mt-8 md:mt-12">
          {/* Desktop Table Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-5 text-sec-300 dark:text-gray-400 text-sm md:text-sm font-medium">Item Name</div>
            <div className="col-span-2 text-sec-300 dark:text-gray-400 text-sm md:text-sm font-medium text-center">QTY.</div>
            <div className="col-span-2 text-sec-300 dark:text-gray-400 text-sm md:text-sm font-medium text-right">Price</div>
            <div className="col-span-3 text-sec-300 dark:text-gray-400 text-sm md:text-sm font-medium text-right">Total</div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            {invoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                {/* Item Name and Total - Mobile first */}
                <div className="col-span-8 md:col-span-5 flex flex-col justify-center">
                  <p className="font-bold capitalize">{item.name}</p>
                  <p className="text-sm text-sec-300 font-bold dark:text-gray-400 mt-1 md:hidden">
                    {item.quantity} x £ {new Intl.NumberFormat('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(item.price)}
                  </p>
                </div>
                
                {/* Total - Mobile */}
                <div className="col-span-4 text-right md:hidden flex items-center justify-end">
                  <p className="font-bold">
                    £ {new Intl.NumberFormat('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(item.quantity * item.price)}
                  </p>
                </div>
                
                {/* Desktop Views - Hidden on mobile */}
                <div className="hidden md:block md:col-span-2">
                  <p className="text-sec-300 dark:text-gray-400 text-sm font-medium text-center">
                    {item.quantity}
                  </p>
                </div>
                
                <div className="hidden md:block md:col-span-2">
                  <p className="text-sec-300 dark:text-gray-400 text-sm font-bold text-right">
                    £ {new Intl.NumberFormat('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(item.price)}
                  </p>
                </div>
                
                <div className="hidden md:block md:col-span-3">
                  <p className="font-bold text-right">
                    £ {new Intl.NumberFormat('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(item.quantity * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
                {/* Total */}
                <div className="bg-[#373B53] text-white p-6 rounded-b-lg flex justify-between items-center">
          <span className="text-sm">Amount Due</span>
          <span className="text-2xl font-bold">
          £ {new Intl.NumberFormat('en-GB', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
          }).format(invoice.totalAmount)}
          </span>
        </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        invoiceId={invoice?.invoiceId || ''}
        isDeleting={isDeleting}
      />
    </div>
    </>
  );
}

export default InvoiceDetail;