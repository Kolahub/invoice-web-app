import React, { useState } from 'react';
import IconPlus from '../../assets/icon-plus.svg?react';
import InvoiceForm from '../forms/InvoiceForm';

function NewInvoiceBtn() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleClose = () => {
    setIsFormOpen(false);
  };

  return (
    <div>
      <button 
        onClick={() => setIsFormOpen(true)}
        className='cursor-pointer w-40 h-12 group bg-pri-100 hover:bg-pri-200 active:scale-95 flex items-center gap-4 rounded-full transition-colors'
        aria-label="Create new invoice"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pri-100 group-hover:text-pri-200 transition-colors ml-2">
          <IconPlus />
        </div> 
        <p className='font-bold capitalize text-white'>New Invoice</p>
      </button>

      <InvoiceForm 
        isOpen={isFormOpen} 
        onClose={handleClose}
      />
    </div>
  );
}

export default NewInvoiceBtn;