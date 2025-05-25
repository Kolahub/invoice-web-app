import React from 'react';
import IconDelete from '../../assets/icon-delete.svg?react';

const ItemRow = ({ item, index, updateItem, removeItem, canRemove, errors = {} }) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      {/* Item Name - Full width on mobile, 5 columns on desktop */}
      <div className="col-span-12 md:col-span-5">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Item Name
        </label>
        <div className="relative">
          <input
            type="text"
            name={`itemName${index}`}
            defaultValue={item.name}
            className={`w-full p-3 border rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-pri-100 focus:border-pri-100 focus:outline-none ${
              errors[`items[${index}]Name`] 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            aria-invalid={!!errors[`items[${index}]Name`]}
            aria-describedby={errors[`items[${index}]Name`] ? `itemName${index}-error` : undefined}
          />
          {errors[`items[${index}]Name`] && (
            <p 
              id={`itemName${index}-error`}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors[`items[${index}]Name`]}
            </p>
          )}
        </div>
      </div>
      
      {/* Qty - Full width on mobile, 2 columns on desktop */}
      <div className="col-span-4 md:col-span-2">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Qty.
        </label>
        <div className="relative">
          <input
            type="number"
            name={`itemQty${index}`}
            value={item.quantity}
            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
            className={`w-full p-3 border rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-pri-100 focus:border-pri-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              errors[`items[${index}]Quantity`] 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            aria-invalid={!!errors[`items[${index}]Quantity`]}
            aria-describedby={errors[`items[${index}]Quantity`] ? `itemQty${index}-error` : undefined}
          />
          {errors[`items[${index}]Quantity`] && (
            <p 
              id={`itemQty${index}-error`}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors[`items[${index}]Quantity`]}
            </p>
          )}
        </div>
      </div>
      
      {/* Price - Full width on mobile, 2 columns on desktop */}
      <div className="col-span-5 md:col-span-2">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Price
        </label>
        <div className="relative">
          <input
            type="number"
            name={`itemPrice${index}`}
            min="0"
            step="0.01"
            value={item.price}
            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
            className={`w-full p-3 border rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-pri-100 focus:border-pri-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              errors[`items[${index}]Price`] 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            aria-invalid={!!errors[`items[${index}]Price`]}
            aria-describedby={errors[`items[${index}]Price`] ? `itemPrice${index}-error` : undefined}
          />
          {errors[`items[${index}]Price`] && (
            <p 
              id={`itemPrice${index}-error`}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors[`items[${index}]Price`]}
            </p>
          )}
        </div>
      </div>
      
      {/* Total - Full width on mobile, 2 columns on desktop */}
      <div className="col-span-2 md:col-span-2 flex flex-col">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Total
        </label>
        <div className="flex items-center h-12">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            £{parseFloat(item.total).toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Delete button - Full width on mobile, 1 column on desktop */}
      <div className="col-span-1 flex items-start justify-end pt-8">
        {canRemove && (
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="cursor-pointer text-sec-200 hover:text-err-100 p-2 -mr-2"
            aria-label="Remove item"
          >
            <IconDelete />
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemRow;