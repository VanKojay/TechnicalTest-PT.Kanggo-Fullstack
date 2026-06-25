import { HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  done: {
    label: 'Done',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const status = statusConfig[task.status] || statusConfig.pending;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.deadline || task.status === 'done') return false;
    return new Date(task.deadline) < new Date();
  };

  return (
    <div className="group bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-brand-500/30 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-white">
          {task.title}
        </h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border shrink-0 ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
          {status.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/40">
        <div className="flex items-center gap-3">
          {task.deadline && (
            <span className={`inline-flex items-center gap-1.5 text-xs ${isOverdue() ? 'text-red-400' : 'text-slate-500'}`}>
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              {formatDate(task.deadline)}
              {isOverdue() && <span className="text-red-400 font-medium">(Overdue)</span>}
            </span>
          )}
          {!task.deadline && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
              <HiOutlineClock className="w-3.5 h-3.5" />
              No deadline
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            id={`edit-task-${task.id}`}
            className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all"
            title="Edit task"
          >
            <HiOutlinePencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            id={`delete-task-${task.id}`}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete task"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
