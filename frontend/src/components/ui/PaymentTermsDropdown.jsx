import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import IconArrowDown from '../../assets/icon-arrow-down.svg?react'

const PaymentTermsDropdown = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const paymentTerms = [
    { value: 1, label: 'Net 1 Day' },
    { value: 7, label: 'Net 7 Days' },
    { value: 14, label: 'Net 14 Days' },
    { value: 30, label: 'Net 30 Days' },
  ];

  const selectedTerm = paymentTerms.find(term => term.value === value) || paymentTerms[3];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (term) => {
    onChange(term.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Motion.div 
        className="group w-full p-3 border border-sec-100 dark:border-pri-400 rounded font-bold dark:bg-pri-300 text-sec-400 dark:text-white cursor-pointer flex justify-between items-center hover:border-pri-100 dark:hover:border-pri-200 transition-colors duration-200"
        onClick={toggleDropdown}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-extrabold">{selectedTerm.label}</span>
        <Motion.span 
          className="text-pri-100 flex items-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconArrowDown className="fill-current" />
        </Motion.span>
      </Motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <Motion.div 
            className="absolute z-10 mt-1 w-full bg-white dark:bg-pri-300 rounded-lg shadow-lg py-4 border border-sec-100 dark:border-pri-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
          {paymentTerms.map((term, index) => (
            <Motion.div
              key={term.value}
              className={`px-6 py-2 cursor-pointer font-bold transition-colors duration-200 ${
                value === term.value 
                  ? 'text-pri-100' 
                  : 'text-sec-400 dark:text-white hover:bg-sec-100 dark:hover:bg-pri-400'
              }`}
              onClick={() => handleSelect(term)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.2 
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {term.label}
            </Motion.div>
          ))}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentTermsDropdown;
