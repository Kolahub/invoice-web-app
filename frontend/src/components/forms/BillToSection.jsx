import React from 'react';
import FormInput from './FormInput';
import FormSection from './FormSection';

const BillToSection = ({ initialData, errors = {} }) => {
  return (
    <FormSection title="Bill To" className="mb-10">
      <div className="space-y-4">
        <FormInput
          id="clientName"
          name="clientName"
          label="Client's Name"
          placeholder="Alex Grim"
          defaultValue={initialData?.billTo?.clientName || ''}
          error={errors.clientName}
        />
        
        <FormInput
          id="clientEmail"
          name="clientEmail"
          label="Client's Email"
          type="email"
          placeholder="alexgrim@mail.com"
          defaultValue={initialData?.billTo?.clientEmail || ''}
          error={errors.clientEmail}
        />
        
        <FormInput
          id="clientStreetAddress"
          name="clientStreetAddress"
          label="Street Address"
          placeholder="84 Church Way"
          defaultValue={initialData?.billTo?.street || ''}
          error={errors.clientStreetAddress}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            id="clientCity"
            name="clientCity"
            label="City"
            placeholder="Bradford"
            defaultValue={initialData?.billTo?.city || ''}
            error={errors.clientCity}
          />
          
          <FormInput
            id="clientPostCode"
            name="clientPostCode"
            label="Post Code"
            placeholder="BD1 9PB"
            defaultValue={initialData?.billTo?.postCode || ''}
            error={errors.clientPostCode}
          />
          
          <div className="md:col-span-1">
            <FormInput
              id="clientCountry"
              name="clientCountry"
              label="Country"
              placeholder="United Kingdom"
              defaultValue={initialData?.billTo?.country || ''}
              error={errors.clientCountry}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default BillToSection;