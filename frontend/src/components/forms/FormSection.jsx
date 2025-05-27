import React from 'react';

const FormSection = ({ title, children, className = '' }) => {
  return (
    <section className={className}>
      {title && (
        <p className={`${title === 'Item List' ? 'text-lg text-sec-200 dark:text-[#777F98]' : 'text-pri-100'} font-bold mb-4`}>
          {title}
        </p>
      )}
      {children}
    </section>
  );
};

export default FormSection;