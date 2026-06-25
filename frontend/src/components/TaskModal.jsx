import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        deadline: task.deadline || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        deadline: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = {
        ...formData,
        deadline: formData.deadline || null,
        description: formData.description || null,
      };
      await onSubmit(data);
      onClose();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach((e) => { mapped[e.field] = e.message; });
        setErrors(mapped);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="task-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className={`w-full px-4 py-2.5 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all ${errors.title ? 'border-red-500' : 'border-slate-600/50'}`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description (optional)..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* Status & Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-100 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              >
                <option value="pending">🟡 Pending</option>
                <option value="in-progress">🔵 In Progress</option>
                <option value="done">🟢 Done</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="task-deadline" className="block text-sm font-medium text-slate-300 mb-1.5">
                Deadline
              </label>
              <input
                type="date"
                id="task-deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-xl text-slate-100 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              id="submit-task-button"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
