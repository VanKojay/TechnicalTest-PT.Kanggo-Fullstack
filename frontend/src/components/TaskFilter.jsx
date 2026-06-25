import { useState, useEffect, useCallback } from 'react';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

const statusOptions = [
  { value: '', label: 'All Tasks', icon: '📋' },
  { value: 'pending', label: 'Pending', icon: '🟡' },
  { value: 'in-progress', label: 'In Progress', icon: '🔵' },
  { value: 'done', label: 'Done', icon: '🟢' },
];

const TaskFilter = ({ status, search, onStatusChange, onSearchChange }) => {
  const [searchInput, setSearchInput] = useState(search || '');

  // Debounced search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync external search prop
  useEffect(() => {
    setSearchInput(search || '');
  }, [search]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-x-auto">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            id={`filter-${opt.value || 'all'}`}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
              status === opt.value
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative flex-1 min-w-0 sm:max-w-xs">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          id="search-tasks-input"
          className="w-full pl-9 pr-9 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
        />
        {searchInput && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
