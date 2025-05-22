import React from 'react';
import IconPlus from '../../assets/icon-plus.svg?react';
import { useNavigate } from 'react-router-dom';

function NewInvoiceBtn() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/invoice/new');
  };

  return (
    <button 
      onClick={handleClick}
      className='cursor-pointer w-40 h-12 group bg-pri-100 hover:bg-pri-200 active:scale-95 flex items-center gap-4 rounded-full transition-colors'
      aria-label="Create new invoice"
    >
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pri-100 group-hover:text-pri-200 transition-colors ml-2">
        <IconPlus />
      </div>
      <span className='font-bold text-white text-sm'>New Invoice</span>
    </button>
  );
}

export default NewInvoiceBtn;