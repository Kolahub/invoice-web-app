import React from 'react';

const FormActions = ({ isEditMode, isLoading, onCancel }) => {
  return (
    <div className="absolute bottom-0 left-[103px] right-0 bg-white dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-between items-center max-w-full">
        {!isEditMode && (
          <button 
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Discard
          </button>
        )}
        
        <div className="flex items-center space-x-2 ml-auto">
          {isEditMode ? (
            <>
              <button 
                type="button"
                onClick={onCancel}
                className="cursor-pointer px-6 py-3 bg-bg-100 dark:bg-gray-700 text-sec-300 dark:text-gray-300 font-bold rounded-full hover:bg-sec-100 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="invoice-form"
                name="status"
                value="update"
                className="cursor-pointer px-6 py-3 bg-pri-100 text-white font-bold rounded-full hover:bg-pri-200 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                form="invoice-form"
                name="status"
                value="draft"
                className="cursor-pointer px-4 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                form="invoice-form"
                name="status"
                value="pending"
                className="cursor-pointer px-4 py-3 bg-pri-100 text-white font-bold rounded-full hover:bg-purple-500 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save & Send'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormActions;