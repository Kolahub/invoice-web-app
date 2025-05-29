import React from 'react';

const FormActions = ({ isEditMode, isLoading = { draft: false, pending: false }, onCancel }) => {
  return (
<div className="absolute bottom-0 left-0 right-0 lg:left-[103px] bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-[0_-8px_18px_rgba(0,0,0,0.15)]">
      <div className="flex justify-between items-center w-full">
        {!isEditMode && (
          <button 
            type="button"
            onClick={onCancel}
            className="cursor-pointer disabled:cursor-not-allowed px-4 sm:px-6 py-3 bg-gray-100 text-gray-500 font-bold rounded-full hover:bg-gray-200 transition-colors text-sm sm:text-base"
            disabled={isLoading.draft || isLoading.pending}
          >
            Discard
          </button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {isEditMode ? (
            <>
              <button 
                type="button"
                onClick={onCancel}
                className="cursor-pointer disabled:cursor-not-allowed px-4 sm:px-6 py-3 bg-bg-100 dark:bg-pri-400 text-sec-300 dark:hover:text-sec-100 font-bold rounded-full hover:bg-sec-100 dark:hover:bg-pri-400 transition-colors text-sm sm:text-base"
                disabled={isLoading.pending || isLoading.neutral}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="invoice-form"
                name="status"
                value="update"
                className="cursor-pointer disabled:cursor-not-allowed px-4 sm:px-6 py-3 bg-pri-100 text-white font-bold rounded-full hover:bg-pri-200 transition-colors text-sm sm:text-base "
                disabled={isLoading.pending || isLoading.neutral}
              >
                {isLoading.pending || isLoading.neutral ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                form="invoice-form"
                name="status"
                value="draft"
                className="cursor-pointer disabled:cursor-not-allowed px-4 py-3 bg-gray-800 dark:bg-[#373B53] dark:hover:bg-pri-300 text-white font-bold rounded-full hover:bg-gray-700 transition-colors text-sm sm:text-base"
                disabled={isLoading.draft || isLoading.pending}
              >
                {isLoading.draft ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                form="invoice-form"
                name="status"
                value="pending"
                className="cursor-pointer disabled:cursor-not-allowed px-4 py-3 bg-pri-100 text-white font-bold rounded-full hover:bg-pri-200 transition-colors text-sm sm:text-base"
                disabled={isLoading.pending || isLoading.draft}
              >
                {isLoading.pending ? 'Saving...' : 'Save & Send'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormActions;