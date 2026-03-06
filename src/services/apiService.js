/**
 * apiService.js
 * 
 * Centralized Service Layer for all mock API operations and fetch wrappers.
 * In a real application, Axios or standard Fetch instances would live here.
 */
import { TICKET_STATUS, TICKET_PRIORITY, initialTickets } from '../data/supportData';
import { multiResourceDataDay, multiResourceDataWeek, multiResourceDataMonth, multiResourceDataYear, industrialIssues, domesticIssues } from '../data/mockData';

// Simulate network delay for realistic debugging
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const _request = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}/${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };

    try {
        const response = await fetch(url, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers }
        });

        if (response.status === 404 && options.method === 'DELETE') return true;
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
        }

        if (response.status === 204 || options.method === 'DELETE') return true;
        return await response.json();
    } catch (error) {
        console.error(`API Request Failed [${options.method || 'GET'}] ${url}:`, error);
        throw error;
    }
};

export const apiService = {
    // ---- Generic Methods ----
    get: (endpoint) => _request(endpoint, { method: 'GET' }),
    post: (endpoint, data) => _request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => _request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (endpoint, data) => _request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint) => _request(endpoint, { method: 'DELETE' }),

    // ---- Specialized Methods (Maintaining compatibility) ----
    fetchDashboardKPIs: async () => {
        await delay();
        return [];
    },

    fetchChartData: async (type = 'bar', timeRange = 'week') => {
        await delay(300);
        switch (timeRange) {
            case 'day': return multiResourceDataDay;
            case 'month': return multiResourceDataMonth;
            case 'year': return multiResourceDataYear;
            case 'week':
            default: return multiResourceDataWeek;
        }
    },

    fetchTickets: (queryStr = '') => apiService.get(`tickets${queryStr}`),
    createTicket: (ticketPayload) => apiService.post('tickets', ticketPayload),
    updateTicket: (ticketId, updatedData) => apiService.patch(`tickets/${ticketId}`, updatedData),
    deleteTicket: (ticketId) => apiService.delete(`tickets/${ticketId}`),
    updateTicketStatus: (ticketId, newStatus) => apiService.updateTicket(ticketId, { status: newStatus }),

    getDevices: (queryStr = '') => apiService.get(`devices${queryStr}`),
    getDeviceById: (id) => apiService.get(`devices/${id}`),
    createDevice: (deviceData) => apiService.post('devices', deviceData),
    updateDevice: (id, deviceData) => apiService.put(`devices/${id}`, deviceData),
    deleteDevice: (id) => apiService.delete(`devices/${id}`),

    getInitialMeters: (queryStr = '') => apiService.get(`meters${queryStr}`),
    createMeter: (meterData) => apiService.post('meters', meterData),
    updateMeter: (id, meterData) => apiService.put(`meters/${id}`, meterData),
    deleteMeter: (id) => apiService.delete(`meters/${id}`),

    getInvoices: (queryStr = '') => apiService.get(`invoices${queryStr}`),
    createInvoice: (invoiceData) => apiService.post('invoices', invoiceData),

    getReports: (queryStr = '') => apiService.get(`reports${queryStr}`),
    createReport: (reportData) => apiService.post('reports', reportData),

    getUsers: () => apiService.get('users'),
    getUserById: (id) => apiService.get(`users/${id}`),
    createUser: (userData) => apiService.post('users', userData),
    updateUser: (id, userData) => apiService.put(`users/${id}`, userData),
    deleteUser: (id) => apiService.delete(`users/${id}`),
};

