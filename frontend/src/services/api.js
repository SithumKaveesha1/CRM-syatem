import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000' })

// Customers
export const getCustomers = (params) => api.get('/api/customers', { params })
export const getCustomer = (id) => api.get(`/api/customers/${id}`)
export const createCustomer = (data) => api.post('/api/customers', data)
export const updateCustomer = (id, data) => api.put(`/api/customers/${id}`, data)
export const deleteCustomer = (id) => api.delete(`/api/customers/${id}`)

// Invoices
export const getInvoices = (params) => api.get('/api/invoices', { params })
export const getInvoice = (id) => api.get(`/api/invoices/${id}`)
export const createInvoice = (data) => api.post('/api/invoices', data)
export const updateInvoice = (id, data) => api.put(`/api/invoices/${id}`, data)
export const deleteInvoice = (id) => api.delete(`/api/invoices/${id}`)

// Payments
export const getPayments = (params) => api.get('/api/payments', { params })
export const createPayment = (data) => api.post('/api/payments', data)

// Dashboard
export const getTotals = () => api.get('/api/dashboard/totals')
export const getMonthlyRevenue = () => api.get('/api/dashboard/monthly-revenue')

export default api
