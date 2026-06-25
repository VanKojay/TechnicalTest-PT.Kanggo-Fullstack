import { HiOutlineExclamation } from 'react-icons/hi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl animate-scale-in p-6">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-500/15 rounded-full flex items-center justify-center">
            <HiOutlineExclamation className="w-7 h-7 text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Delete Task</h3>
          <p className="text-sm text-slate-400">
            Are you sure you want to delete{' '}
            <span className="text-slate-200 font-medium">"{taskTitle}"</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            id="confirm-delete-button"
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/25 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Deleting...
              </span>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
