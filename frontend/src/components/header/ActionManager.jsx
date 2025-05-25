import React from 'react'
import ItemCountDisplay from './ItemCountDisplay'
import FilterItem from './FilterItem'
import NewInvoiceBtn from './NewInvoiceBtn'

function ActionManager() {
  return (
    <div className='flex items-center gap-5 sm:gap-12'>
      <div className="flex-1">
      <ItemCountDisplay />
      </div>
      <FilterItem />
      <NewInvoiceBtn />
    </div>
  )
}

export default ActionManager