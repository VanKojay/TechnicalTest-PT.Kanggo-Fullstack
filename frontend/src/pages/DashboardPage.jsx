import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import TaskFilter from '../components/TaskFilter';
import Pagination from '../components/Pagination';
import { HiOutlinePlus, HiOutlineClipboardList } from 'react-icons/hi';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 9,
      });
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Handlers
  const handleCreateTask = async (data) => {
    await taskService.createTask(data);
    toast.success('Task created! 🎉');
    fetchTasks();
  };

  const handleUpdateTask = async (data) => {
    await taskService.updateTask(editingTask.id, data);
    toast.success('Task updated! ✅');
    fetchTasks();
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    try {
      await taskService.deleteTask(deletingTask.id);
      toast.success('Task deleted');
      setIsDeleteModalOpen(false);
      setDeletingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openDeleteModal = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  // Stats
  const taskStats = {
    total: pagination.totalItems,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">My Tasks</h2>
            <p className="text-sm text-slate-400 mt-1">
              {taskStats.total} task{taskStats.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={openCreateModal}
            id="add-task-button"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilter
            status={statusFilter}
            search={searchQuery}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-slate-800/60 rounded-2xl flex items-center justify-center mb-4">
              <HiOutlineClipboardList className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">No tasks found</h3>
            <p className="text-sm text-slate-500 mb-6">
              {searchQuery || statusFilter
                ? 'Try adjusting your filters or search query'
                : 'Get started by creating your first task'}
            </p>
            {!searchQuery && !statusFilter && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-violet-500 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all"
              >
                <HiOutlinePlus className="w-5 h-5" />
                Create First Task
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingTask(null); }}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title}
        loading={deleteLoading}
      />
    </div>
  );
};

export default DashboardPage;
