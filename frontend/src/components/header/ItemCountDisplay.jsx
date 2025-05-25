import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function ItemCountDisplay() {
  const invoicesCount = useSelector((state) => state.invoices.invoicesCount) 
  return (
    <div>
      <Link to="/" className='text-4xl font-bold'>Invoices</Link>
      <p className='text-sec-200 text-sm sm:hidden'>{invoicesCount ?? 'loading...'} invoice{invoicesCount > 1 ? 's' : ''}</p>
      <p className='text-sec-200 text-sm hidden sm:block'>There are {invoicesCount ?? 'loading...'} total invoice{invoicesCount > 1 ? 's' : ''}</p>
    </div>
  )
}

export default ItemCountDisplay