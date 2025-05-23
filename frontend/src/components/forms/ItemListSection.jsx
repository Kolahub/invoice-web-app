import React from 'react';
import FormSection from './FormSection';
import ItemRow from './ItemRow';

const ItemListSection = ({ items, updateItem, removeItem, addNewItem }) => {
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
          />
        ))}
        
        <button
          type="button"
          onClick={addNewItem}
          className="cursor-pointer w-full py-3 bg-bg-100 dark:bg-gray-800 text-sec-300 dark:text-sec-200 font-bold rounded-full hover:bg-sec-100 dark:hover:bg-gray-700 transition-colors mt-6"
        >
          + Add New Item
        </button>
      </div>
    </FormSection>
  );
};

export default ItemListSection;