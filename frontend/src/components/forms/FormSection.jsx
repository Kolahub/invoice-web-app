import React from 'react';

const FormSection = ({ title, children, className = '' }) => {
  return (
    <section className={className}>
      {title && (
        <p className="text-pri-100 font-semibold mb-4">{title}</p>
      )}
      {children}
    </section>
  );
};

export default FormSection;