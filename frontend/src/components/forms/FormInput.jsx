import React from 'react';

const FormInput = ({ 
  id, 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  defaultValue, 
  className = '',
  error,
  ...props 
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full p-3 border rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-pri-100 focus:border-pri-100 focus:outline-none caret-pri-200 placeholder:text-sec-300/60 ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          {...props}
        />
        {error && (
          <p 
            id={`${id}-error`} 
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormInput;