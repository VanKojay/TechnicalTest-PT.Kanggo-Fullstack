import api from './api';

export const taskService = {
  getTasks: async ({ status, search, page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/api/tasks?${params.toString()}`);
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post('/api/tasks', data);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },
};
