import React from 'react';
import FormInput from './FormInput';
import FormSection from './FormSection';
import DatePicker from '../ui/DatePicker';
import PaymentTermsDropdown from '../ui/PaymentTermsDropdown';

const InvoiceDetailsSection = ({ 
  initialData, 
  invoiceDate, 
  setInvoiceDate, 
  paymentTerms, 
  setPaymentTerms,
  errors = {}
}) => {
  return (
    <FormSection className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceDate" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
            Invoice Date
          </label>
          <DatePicker
            value={invoiceDate}
            onChange={(date) => setInvoiceDate(date)}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
            Payment Terms
          </label>
          <PaymentTermsDropdown
            value={paymentTerms}
            onChange={(value) => setPaymentTerms(value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <FormInput
          id="projectDescription"
          name="projectDescription"
          label="Project Description"
          placeholder="Graphic Design"
          defaultValue={initialData?.projectDescription || ''}
          error={errors.projectDescription}
        />
      </div>
    </FormSection>
  );
};

export default InvoiceDetailsSection;