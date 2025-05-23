import { motion as Motion, AnimatePresence } from 'framer-motion';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, invoiceId }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Motion.div 
            className="bg-white dark:bg-gray-700 rounded-lg p-8 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Confirm Deletion
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-6 font-medium">
              Are you sure you want to delete invoice <span className="font-semibold">{invoiceId}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-600 text-sec-300 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="cursor-pointer px-4 py-2 rounded-full bg-err-100 text-white font-bold hover:bg-err-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
