import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-sm text-slate-600">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${
              currentPage === page
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <span className="hidden sm:inline">Next</span>
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
