import React from 'react';

const FormInput = ({ 
  id, 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  defaultValue, 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        {...props}
      />
    </div>
  );
};

export default FormInput;