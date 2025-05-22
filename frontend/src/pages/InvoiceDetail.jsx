import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchInvoiceById } from '../utils/http';
import { format } from 'date-fns';
import IconArrowLeft from '../assets/icon-arrow-left.svg?react';


function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: invoice, isPending } = useQuery({
    queryKey: ['invoice', { id }],
    queryFn: ({ queryKey, signal }) => fetchInvoiceById({...queryKey[1], signal}),
  });


  if (isPending) {
    return <div className="p-8">Loading...</div>;
  }

  if (!invoice) {
    return <div className="p-8">Invoice not found</div>;
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
    <div className="pb-10 pt-[65px]">
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-4 text-gray-500 dark:text-gray-400">Status</span>
          <div className={`px-4 py-2 rounded-md flex items-center font-bold ${
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
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              // setIsEditing(true)
              navigate('edit')
            }}
            className="cursor-pointer px-4 py-2 bg-bg-100 hover:bg-sec-100 text-sec-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full font-bold"
          >
            Edit
          </button>
          <button className="cursor-pointer px-4 py-2 bg-err-100 hover:bg-err-200 text-white dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400 rounded-full font-bold">
            Delete
          </button>
          <button className="cursor-pointer px-4 py-2 bg-pri-100 hover:bg-pri-200 text-white rounded-full font-bold">
            Mark as {invoice.status === 'paid' ? 'Unpaid' : 'Paid'}
          </button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
            <span className="text-sec-300">{invoice.invoiceId[0]}</span>
            {invoice.invoiceId.slice(1)}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{invoice.projectDescription}</p>
          </div>
          <div className="text-right text-gray-500 dark:text-gray-400">
            <p>{invoice.billFrom.street}</p>
            <p>{invoice.billFrom.city}</p>
            <p>{invoice.billFrom.postCode}</p>
            <p>{invoice.billFrom.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">Invoice Date</h3>
            <p className="font-bold">{formatDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">Bill To</h3>
            <p className="font-bold mb-2">{invoice.billTo.clientName}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {invoice.billTo.street}<br />
              {invoice.billTo.city}<br />
              {invoice.billTo.postCode}<br />
              {invoice.billTo.country}
            </p>
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sent to</h3>
            <p className="font-bold">{invoice.billTo.clientEmail}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">Payment Due</h3>
          <p className="font-bold">{calculateDueDate(invoice.invoiceDate, invoice.paymentTerms)}</p>
        </div>

        {/* Items Table */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-normal">Item Name</th>
                <th className="p-4 font-normal text-center">QTY.</th>
                <th className="p-4 font-normal text-right">Price</th>
                <th className="p-4 font-normal text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item._id} className="border-b border-gray-100 dark:border-gray-600">
                  <td className="p-4 font-bold">{item.name}</td>
                  <td className="p-4 text-center text-gray-500 dark:text-gray-400">{item.quantity}</td>
                  <td className="p-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="bg-gray-800 text-white p-6 rounded-b-lg flex justify-between items-center">
          <span className="text-sm">Amount Due</span>
          <span className="text-2xl font-bold">${invoice.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </>
  );
}

export default InvoiceDetail;