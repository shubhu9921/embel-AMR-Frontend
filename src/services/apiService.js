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

const BASE_URL = 'http://localhost:3001';

export const apiService = {
    // ---- KPIs & Charts ----
    fetchDashboardKPIs: async () => {
        await delay();
        return []; // Unused currently in the app
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

    // ---- Support Tickets Expansion Strategy ----
    fetchTickets: async (queryStr = '') => {
        try {
            const response = await fetch(`${BASE_URL}/tickets${queryStr}`);
            if (!response.ok) throw new Error('Failed to fetch tickets');
            return await response.json();
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    },

    createTicket: async (ticketPayload) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketPayload)
            });
            if (!response.ok) throw new Error('Failed to create ticket');
            return await response.json();
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    },

    updateTicket: async (ticketId, updatedData) => {
        try {
            // PATCH is safer as it only updates provided fields
            const response = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Failed to update ticket');
            return await response.json();
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    },

    deleteTicket: async (ticketId) => {
        try {
            const response = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
                method: 'DELETE'
            });
            if (response.status === 404) return true; // Already deleted
            if (!response.ok) throw new Error('Failed to delete ticket');
            return true;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    },

    updateTicketStatus: async (ticketId, newStatus) => {
        return apiService.updateTicket(ticketId, { status: newStatus });
    },

    // ---- Device Management APIs using json-server ----
    getDevices: async (queryStr = '') => {
        try {
            const response = await fetch(`${BASE_URL}/devices${queryStr}`);
            if (!response.ok) throw new Error('Failed to fetch devices');
            return await response.json();
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    },

    getInitialMeters: async (queryStr = '') => {
        try {
            const response = await fetch(`${BASE_URL}/meters${queryStr}`);
            if (!response.ok) throw new Error('Failed to fetch initialMetersData');
            return await response.json();
        } catch (error) {
            console.error('Error fetching initialMetersData:', error);
            throw error;
        }
    },

    getInvoices: async (queryStr = '') => {
        try {
            const response = await fetch(`${BASE_URL}/invoices${queryStr}`);
            if (!response.ok) throw new Error('Failed to fetch invoices');
            return await response.json();
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw error;
        }
    },

    createInvoice: async (invoiceData) => {
        try {
            const response = await fetch(`${BASE_URL}/invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData)
            });
            if (!response.ok) throw new Error('Failed to create invoice');
            return await response.json();
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    },

    getReports: async (queryStr = '') => {
        try {
            const response = await fetch(`${BASE_URL}/reports${queryStr}`);
            if (!response.ok) throw new Error('Failed to fetch reports');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reports:', error);
            throw error;
        }
    },

    createReport: async (reportData) => {
        try {
            const response = await fetch(`${BASE_URL}/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData)
            });
            if (!response.ok) throw new Error('Failed to create report');
            return await response.json();
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    },

    getDeviceById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/devices/${id}`);
            if (!response.ok) throw new Error('Failed to fetch device');
            return await response.json();
        } catch (error) {
            console.error('Error fetching device:', error);
            throw error;
        }
    },

    createDevice: async (deviceData) => {
        try {
            const response = await fetch(`${BASE_URL}/devices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deviceData)
            });
            if (!response.ok) throw new Error('Failed to create device');
            return await response.json();
        } catch (error) {
            console.error('Error creating device:', error);
            throw error;
        }
    },

    updateDevice: async (id, deviceData) => {
        try {
            const response = await fetch(`${BASE_URL}/devices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deviceData)
            });
            if (!response.ok) throw new Error('Failed to update device');
            return await response.json();
        } catch (error) {
            console.error('Error updating device:', error);
            throw error;
        }
    },

    deleteDevice: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/devices/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 404) return { success: true }; // Already deleted
            if (!response.ok) throw new Error('Failed to delete device');
            return await response.json();
        } catch (error) {
            console.error('Error deleting device:', error);
            throw error;
        }
    },

    createMeter: async (meterData) => {
        try {
            const response = await fetch(`${BASE_URL}/meters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meterData)
            });
            if (!response.ok) throw new Error('Failed to create meter');
            return await response.json();
        } catch (error) {
            console.error('Error creating meter:', error);
            throw error;
        }
    },

    updateMeter: async (id, meterData) => {
        try {
            const response = await fetch(`${BASE_URL}/meters/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meterData)
            });
            if (!response.ok) throw new Error('Failed to update meter');
            return await response.json();
        } catch (error) {
            console.error('Error updating meter:', error);
            throw error;
        }
    },

    deleteMeter: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/meters/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 404) return { success: true }; // Already deleted
            if (!response.ok) throw new Error('Failed to delete meter');
            return await response.json();
        } catch (error) {
            console.error('Error deleting meter:', error);
            throw error;
        }
    },

    // ---- User Management APIs using json-server ----
    getUsers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/users/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Failed to create user');
            return await response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Failed to update user');
            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 404) return { success: true }; // Already deleted
            if (!response.ok) throw new Error('Failed to delete user');
            return await response.json();
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
};
