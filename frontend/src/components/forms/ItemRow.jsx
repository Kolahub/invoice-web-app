import React from 'react';
import IconDelete from '../../assets/icon-delete.svg?react';

const ItemRow = ({ item, index, updateItem, removeItem, canRemove }) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <div className="col-span-12 md:col-span-5">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Item Name
        </label>
        <input
          type="text"
          name={`itemName${index}`}
          defaultValue={item.name}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div className="col-span-3 md:col-span-2">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Qty.
        </label>
        <input
          type="number"
          name={`itemQty${index}`}
          min="1"
          value={item.quantity}
          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      
      <div className="col-span-6 md:col-span-2">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Price
        </label>
        <input
          type="number"
          name={`itemPrice${index}`}
          min="0"
          step="0.01"
          value={item.price}
          onChange={(e) => updateItem(item.id, 'price', e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded font-medium dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      
      <div className="col-span-3 md:col-span-2 flex flex-col">
        <label className="block text-sm font-medium text-sec-300 dark:text-sec-200 mb-2">
          Total
        </label>
        <div className="flex items-center h-12">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {item.total.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="col-span-1 flex items-end h-12">
        {canRemove && (
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="cursor-pointer text-sec-200 hover:text-err-100 p-2 -ml-2"
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