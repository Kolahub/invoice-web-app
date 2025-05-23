import React from 'react';
import FormInput from './FormInput';
import FormSection from './FormSection';

const BillFromSection = ({ initialData }) => {
  return (
    <FormSection title="Bill From" className="mb-10">
      <div className="space-y-4">
        <FormInput
          id="streetAddress"
          name="streetAddress"
          label="Street Address"
          placeholder="19 Union Terrace"
          defaultValue={initialData?.billFrom?.street || ''}
          required
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormInput
            id="city"
            name="city"
            label="City"
            placeholder="London"
            defaultValue={initialData?.billFrom?.city || ''}
            required
          />
          
          <FormInput
            id="postCode"
            name="postCode"
            label="Post Code"
            placeholder="E1 3EZ"
            defaultValue={initialData?.billFrom?.postCode || ''}
            required
          />
          
          <div className="md:col-span-1">
            <FormInput
              id="country"
              name="country"
              label="Country"
              placeholder="United Kingdom"
              defaultValue={initialData?.billFrom?.country || ''}
              required
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default BillFromSection;