import React from 'react';
import FormSection from './FormSection';
import ItemRow from './ItemRow';

const ItemListSection = ({ items, updateItem, removeItem, addNewItem, errors = {} }) => {
  return (
    <FormSection title="Item List" className="mb-24">
      <div className="space-y-4">
        {items.map((item, index) => (
          <ItemRow
            key={item.id}
            item={item}
            index={index}
            updateItem={updateItem}
            removeItem={removeItem}
            canRemove={items.length > 1}
            errors={{
              [`items[${index}]Name`]: errors[`items[${index}]Name`],
              [`items[${index}]Quantity`]: errors[`items[${index}]Quantity`],
              [`items[${index}]Price`]: errors[`items[${index}]Price`]
            }}
          />
        ))}
        
        <button
          type="button"
          onClick={addNewItem}
          className="w-full py-3 bg-bg-100 dark:bg-pri-400 text-sec-300 dark:text-sec-200 font-bold rounded-full 
                   hover:bg-sec-100 dark:hover:bg-pri-300 
                   transition-colors duration-200 mt-4"
        >
          + Add New Item
        </button>
      </div>
    </FormSection>
  );
};

export default ItemListSection;