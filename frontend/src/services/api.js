import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export const fetchTasks = (params = {}) => api.get('/api/tasks', { params })
export const createTask = (data) => api.post('/api/tasks', data)
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`)
export const fetchTask = (id) => api.get(`/api/tasks/${id}`)
export const fetchTaskProgress = (id) => api.get(`/api/tasks/${id}/progress`)
export const addTaskProgress = (id, data) => api.post(`/api/tasks/${id}/progress`, data)
export const fetchAnalyticsSummary = (params = {}) => api.get('/api/analytics/summary', { params })
export const fetchTaskAnalytics = (id) => api.get(`/api/analytics/task/${id}`)

export default api
