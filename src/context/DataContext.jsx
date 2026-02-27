import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [devices, setDevices] = useState([]);
    const [meters, setMeters] = useState([]);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const safeParseInt = (val, fallback = 0) => {
        const parsed = parseInt(val);
        return isNaN(parsed) ? fallback : parsed;
    };

    const normalizeDevice = useCallback((d) => ({
        ...d,
        recordType: 'device',
        status: d.status || (d.deviceEnable !== false ? 'Active' : 'Inactive'),
        location: d.location || d.city || 'Main Site'
    }), []);

    const normalizeMeter = useCallback((m) => ({
        ...m,
        recordType: 'meter',
        status: (m.meterEnable !== false && m.status !== 'Inactive') ? 'Active' : 'Inactive',
        meterType: (m.sourceType || m.meterType || 'Water').charAt(0).toUpperCase() + (m.sourceType || m.meterType || 'Water').slice(1).toLowerCase(),
        location: m.meterLocation || m.location || m.area || m.zone || m.city || 'Front Gate',
        reading: m.reading || m.startReading || '0 L',
        dailyConsumption: m.dailyConsumption || '0 L'
    }), []);

    const refreshData = useCallback(async () => {
        try {
            setIsLoading(true);
            const role = sessionStorage.getItem('userRole');
            const userId = sessionStorage.getItem('userId');
            const isSystemAdmin = role === 'Super Admin' || role === 'Admin' || role === 'Support Engineer';
            const filterQuery = isSystemAdmin ? '' : `?userId=${userId}`;

            const results = await Promise.allSettled([
                apiService.getDevices(filterQuery),
                apiService.getInitialMeters(filterQuery),
                apiService.getUsers(),
                apiService.getReports(filterQuery),
                apiService.fetchTickets(filterQuery)
            ]);

            const [devicesRes, metersRes, usersRes, reportsRes, ticketsRes] = results.map(r => r.status === 'fulfilled' ? r.value : []);

            setDevices((devicesRes || []).map(normalizeDevice));
            setMeters((metersRes || []).map(normalizeMeter));
            setUsers(usersRes || []);
            setReports(reportsRes || []);
            setTickets(ticketsRes || []);
        } catch (err) {
            console.error("DataContext failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    }, [normalizeDevice, normalizeMeter]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const addDevice = async (deviceData) => {
        let assignedUserId = safeParseInt(sessionStorage.getItem('userId'));
        if (deviceData.user && users.length > 0) {
            const targetUser = users.find(u => `${u.firstName} ${u.lastName}`.trim().toLowerCase() === deviceData.user.toLowerCase());
            if (targetUser && targetUser.id) {
                assignedUserId = safeParseInt(targetUser.id);
            }
        }
        const payload = { ...deviceData, userId: assignedUserId };
        const saved = await apiService.createDevice(payload);
        setDevices(prev => [...prev, normalizeDevice(saved)]);
        return saved;
    };

    const updateDevice = async (id, deviceData) => {
        const updated = await apiService.updateDevice(id, deviceData);
        setDevices(prev => prev.map(d => d.id === id ? normalizeDevice(updated) : d));
        return updated;
    };

    const deleteDevice = async (id) => {
        await apiService.deleteDevice(id);
        setDevices(prev => prev.filter(d => d.id !== id));
    };

    const addMeter = async (meterData) => {
        let assignedUserId = safeParseInt(sessionStorage.getItem('userId'));
        if (meterData.user && users.length > 0) {
            const targetUser = users.find(u => `${u.firstName} ${u.lastName}`.trim().toLowerCase() === meterData.user.toLowerCase());
            if (targetUser && targetUser.id) {
                assignedUserId = safeParseInt(targetUser.id);
            }
        }
        const payload = { ...meterData, userId: assignedUserId };
        const saved = await apiService.createMeter(payload);
        setMeters(prev => [...prev, normalizeMeter(saved)]);
        return saved;
    };

    const updateMeter = async (id, meterData) => {
        const updated = await apiService.updateMeter(id, meterData);
        setMeters(prev => prev.map(m => m.id === id ? normalizeMeter(updated) : m));
        return updated;
    };

    const deleteMeter = async (id) => {
        await apiService.deleteMeter(id);
        setMeters(prev => prev.filter(m => m.id !== id));
    };

    const addReport = async (reportData) => {
        const userId = sessionStorage.getItem('userId');
        const payload = { ...reportData, userId: safeParseInt(userId) };
        const saved = await apiService.createReport(payload);
        setReports(prev => [saved, ...prev]);
        return saved;
    };

    const addUser = async (userData) => {
        const saved = await apiService.createUser(userData);
        setUsers(prev => [...prev, saved]);
        return saved;
    };

    const updateUser = async (id, userData) => {
        const updated = await apiService.updateUser(id, userData);
        setUsers(prev => prev.map(u => u.id === id ? updated : u));
        return updated;
    };

    const deleteUser = async (id) => {
        await apiService.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return (
        <DataContext.Provider value={{
            devices,
            meters,
            users,
            reports,
            tickets,
            isLoading,
            refreshData,
            addDevice,
            updateDevice,
            deleteDevice,
            addMeter,
            updateMeter,
            deleteMeter,
            addReport,
            addUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
