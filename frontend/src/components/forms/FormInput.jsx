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
      <label htmlFor={id} className="block text-sm font-medium text-sec-300 dark:text-sec-100 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full p-3 border rounded font-bold 
            bg-white dark:bg-pri-300 
            text-sec-400 dark:text-white 
            ${error 
              ? 'border-[var(--color-err-100)] focus:ring-[var(--color-err-100)] focus:border-[var(--color-err-100)]' 
              : 'border-sec-100 dark:border-pri-400 hover:border-pri-100 dark:hover:border-pri-200'
            }
            focus:ring-1 focus:ring-pri-100 focus:border-pri-100 
            focus:outline-none 
            caret-pri-200 
            placeholder-sec-300/60 dark:placeholder-sec-200/60
            transition-colors duration-200`}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          {...props}
        />
        {error && (
          <p 
            id={`${id}-error`} 
            className="mt-1 text-sm text-err-100 dark:text-err-200"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormInput;