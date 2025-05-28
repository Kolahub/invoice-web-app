import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { fetchInvoices } from '../utils/http'
import { useDispatch, useSelector } from 'react-redux'
import { addDays, format } from 'date-fns';
import IconArrowRight from '../assets/icon-arrow-right.svg?react'
import ImageIllustrationEmpty from '../assets/illustration-empty.svg?react'
import { setInvoiceCount } from '../store';
import { Link } from 'react-router-dom';

function InvoicesDisplay() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.invoices.statusFilter);
  const { data: invoices = [], isPending } = useQuery({
    queryKey: ['invoices', { status }],
    queryFn: ({ queryKey, signal }) => fetchInvoices({ signal, ...queryKey[1] }),
  });

  useEffect(() => {
    if (!isPending) {
      dispatch(setInvoiceCount(invoices?.length || 0));
    }
  }, [invoices, isPending, dispatch]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pri-100"></div>
      </div>
    );
  }

  if (!invoices?.length) {
    return (
      <div className="h-[342px] w-[250px] mx-auto">
        <div className="">
          <ImageIllustrationEmpty />
        </div>
        <div className="text-center mt-16">
          <p className="text-2xl font-bold mb-6 dark:text-white">There is nothing here</p>
          <p className="text-sec-200 font-medium">
            Create an invoice by clicking the
            <span className="font-bold"> New Invoice</span> button and get started
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className='flex flex-col gap-4 w-full'>
      {invoices.map((invoice, index) => {
        const dueDate = addDays(new Date(invoice.invoiceDate), invoice.paymentTerms);
        const formattedDueDate = `Due ${format(dueDate, 'dd MMM yyyy')}`;
        const summationItemTotal = invoice.items.reduce((total, item) => total + item.total, 0);
        const status = invoice.status;

        return (
          <Link 
            to={`/invoice-detail/${invoice.id}`} 
            key={`${index}${invoice.id}`} 
            className="bg-white dark:bg-pri-300 p-6 shadow rounded-lg block hover:border-pri-100 border border-transparent transition-colors"
          >
            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <p className="font-bold text-sec-400 dark:text-white">
                  <span className="text-sec-300 dark:text-sec-300">{invoice.invoiceId[0]}</span>
                  {invoice.invoiceId.slice(1)}
                </p>
                <p className="text-sm font-medium text-sec-300 dark:text-white">{invoice.billTo.clientName}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-sec-200 dark:text-sec-100">
                    Due {formattedDueDate.split(' ')[1]} {formattedDueDate.split(' ')[2]} {formattedDueDate.split(' ')[3]}
                  </p>
                  <p className="font-bold text-lg text-sec-400 dark:text-white">
                    £ {new Intl.NumberFormat('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(summationItemTotal)}
                  </p>
                </div>
                <div className={`flex items-center justify-center gap-2 h-10 w-[104px] rounded-lg ${status === 'draft' ? 'bg-gray-400/20 dark:bg-sec-950/20' : status === 'pending' ? 'bg-orange-400/20' : 'bg-green-400/20'}`}>
                  <div className={`flex items-center justify-center gap-2 h-10 w-[104px] rounded-lg ${status === 'draft' ? 'text-gray-950 dark:text-sec-100' : status === 'pending' ? 'text-orange-400' : 'text-green-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${status === 'draft' ? 'bg-gray-950 dark:bg-sec-100' : status === 'pending' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                  <p className={`capitalize font-bold ${status === 'draft' ? 'text-gray-950 dark:text-sec-100' : status === 'pending' ? 'text-orange-400' : 'text-green-400'}`}>
                    {status}
                  </p>
                </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center w-full md:gap-2">
              <div className="w-1/5">
                <p className="font-bold text-sec-400 dark:text-white">
                  <span className="text-sec-300 dark:text-sec-300">{invoice.invoiceId[0]}</span>
                  {invoice.invoiceId.slice(1)}
                </p>
              </div>
              <div className="w-1/5">
                <p className="text-sm font-medium text-sec-200 dark:text-sec-100">{formattedDueDate}</p>
              </div>
              <div className="w-1/5">
                <p className="text-sm font-medium text-sec-300 dark:text-white">{invoice.billTo.clientName}</p>
              </div>
              <div className="w-1/5 text-right">
                <p className="font-bold text-sec-400 text-base dark:text-white">
                  £ {new Intl.NumberFormat('en-GB', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(summationItemTotal)}
                </p>
              </div>
              <div className="w-1/5 flex justify-end items-center gap-4">
                <div className={`flex items-center justify-center gap-2 h-10 w-[104px] rounded-lg ${status === 'draft' ? 'bg-gray-400/20 dark:bg-sec-950/20' : status === 'pending' ? 'bg-orange-400/20' : 'bg-green-400/20'}`}>
                  <div className={`w-2 h-2 rounded-full ${status === 'draft' ? 'bg-gray-950 dark:bg-sec-100' : status === 'pending' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                  <p className={`capitalize font-bold ${status === 'draft' ? 'text-gray-950 dark:text-sec-100' : status === 'pending' ? 'text-orange-400' : 'text-green-400'}`}>
                    {status}
                  </p>
                </div>
                <IconArrowRight className="text-pri-100" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}

export default InvoicesDisplay