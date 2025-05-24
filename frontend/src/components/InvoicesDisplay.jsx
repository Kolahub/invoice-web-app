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
  const dispatch = useDispatch()
    const status = useSelector((state) => state.invoices.statusFilter)
    const {data: invoices, isPending} = useQuery({
        queryKey: ['invoices', {status}],
        queryFn: ({queryKey, signal}) => fetchInvoices({signal, ...queryKey[1]}),
    })

    console.log(invoices);
    

    useEffect(() => {
      if(!isPending) {
      dispatch(setInvoiceCount(invoices.length))

      }
    }, [invoices, isPending, dispatch])

    if(isPending) {
        return <p>Loading...</p>
    }

    if(!invoices.length) {
        return <div className="h-[342px] w-[250px] mx-auto">
          <div className="">
            <ImageIllustrationEmpty />
          </div>
          <div className="text-center mt-16">
            <p className="text-2xl font-bold mb-6">There is nothing here</p>
            <p className="text-sec-200 font-medium">  Create an invoice by clicking the 
            <span className="font-bold"> New Invoice</span> button and get started</p>
          </div>
        </div>
    }
    
  return (
    <div className='flex flex-col gap-4 w-full'>
{
  invoices.map((invoice, index) => {
    const dueDate = addDays(new Date(invoice.invoiceDate), invoice.paymentTerms);
    const formattedDueDate = `Due ${format(dueDate, 'dd MMM yyyy')}`;

    const summationItemTotal = invoice.items.reduce((total, item) => total + item.total, 0);

    const status = invoice.status

    return (
      <div key={`${index}${invoice.id}`} className="bg-white flex justify-between items-center py-4 pl-8 pr-6 shadow rounded-lg">
        <p className="font-bold">
          <span className="text-sec-300">{invoice.invoiceId[0]}</span>
          {invoice.invoiceId.slice(1)}
        </p>
        <p className="text-sm font-medium text-sec-300">{formattedDueDate}</p>
        <p className='text-sm font-medium text-sec-300'>{invoice.billTo.clientName}</p>
        <p className='font-bold text-sec-400'>
        £ {new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(summationItemTotal)}
        </p>

        <div className="flex items-center gap-5 ">
            <div className={`flex items-center justify-center gap-2 h-10 w-[104px] rounded-lg ${status === 'draft' ? 'bg-gray-100' : status === 'pending' ? 'bg-orange-100' : 'bg-green-100'}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'draft' ? 'bg-gray-950' : status === 'pending' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
              <p className={`capitalize font-bold ${status === 'draft' ? 'text-gray-950' : status === 'pending' ? 'text-orange-400' : 'text-green-400'}`}>{status}</p>
            </div>

            <Link to={`/invoice-detail/${invoice.id}`}>
            <IconArrowRight />
            </Link>
        </div>
      </div>
    );
  })
}
    </div>
  )
}

export default InvoicesDisplay