import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function ItemCountDisplay() {
  const invoicesCount = useSelector((state) => state.invoices.invoicesCount) 
  return (
    <div>
      <Link to="/" className='text-4xl font-bold dark:text-white'>Invoices</Link>
      <p className='text-sec-200 text-sm sm:hidden dark:text-sec-100'>{invoicesCount ?? 'loading...'} invoice{invoicesCount > 1 ? 's' : ''}</p>
      <p className='text-sec-200 text-sm hidden sm:block dark:text-sec-100'>There are {invoicesCount ?? 'loading...'} total invoice{invoicesCount > 1 ? 's' : ''}</p>
    </div>
  )
}

export default ItemCountDisplay