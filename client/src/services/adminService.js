import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAllJobs = async () => {
  const response = await api.get('/admin/jobs');
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/admin/jobs/${id}`);
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get('/admin/activity');
  return response.data;
};

export const updateUserStatus = async (id, data) => {
  const response = await api.put(`/admin/users/${id}/status`, data);
  return response.data;
};

export const getAllCompanies = async () => {
  const response = await api.get('/admin/companies');
  return response.data;
};

export const createCompany = async (data) => {
  const response = await api.post('/admin/companies', data);
  return response.data;
};

export const updateCompanyStatus = async (id, data) => {
  const response = await api.put(`/admin/companies/${id}/status`, data);
  return response.data;
};

export const updateCompany = async (id, data) => {
  const response = await api.put(`/admin/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await api.delete(`/admin/companies/${id}`);
  return response.data;
};

export const addCompanyHR = async (id, data) => {
  const response = await api.post(`/admin/companies/${id}/hr`, data);
  return response.data;
};

export const updateJobModeration = async (id, data) => {
  const response = await api.put(`/admin/jobs/${id}/moderate`, data);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post('/admin/categories', data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

export const broadcastNotification = async (data) => {
  const response = await api.post('/admin/notifications/broadcast', data);
  return response.data;
};
