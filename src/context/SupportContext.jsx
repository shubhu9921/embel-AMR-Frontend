import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { TICKET_STATUS, TICKET_PRIORITY } from '../data/supportData';
import { useFetchData } from '../hooks/useFetchData';
import { apiService } from '../services/apiService';

const SupportContext = createContext();

export function SupportProvider({ children }) {
    const [tickets, setTickets] = useState([]);

    const { data: fetchedTickets, isLoading } = useFetchData(apiService.fetchTickets, []);

    // Effect to process and set tickets initially when fetch completes
    useEffect(() => {
        if (fetchedTickets) {
            const processedTickets = fetchedTickets.map((t, index) => {
                // Ensure ID and basic structure
                const uniqueKey = t.id || t.ticketId || `${t.name}-${t.date}-${index}`;
                const id = t.id || t.ticketId || `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                const type = (t.type || t.category || 'issue').toLowerCase();
                let username = t.username || t.userName;
                let role = t.role || 'Industrial';

                // Fallback username logic matching old context
                if (!username) {
                    if (t.location && t.location.includes('Wing A')) username = 'industrial1';
                    else if (t.location && t.location.includes('Building')) username = 'domestic1';
                    else username = 'admin1';
                }

                return { ...t, id, type, username, role, _dedupKey: uniqueKey };
            });

            // Deduplicate based on uniqueKey
            const uniqueTickets = Array.from(new Map(processedTickets.map(item => [item._dedupKey, item])).values());
            uniqueTickets.forEach(t => delete t._dedupKey);
            setTickets(uniqueTickets);
        }
    }, [fetchedTickets]);

    // Mirror tickets in a ref for the debug bridge. Updated synchronously for correct useEffect timing.
    const ticketsRef = useRef(tickets);
    ticketsRef.current = tickets;

    // KPI Calculation Logic (Strict User2 Requirements)
    const calculateKPIs = useCallback((roleOrUsername) => {
        const currentUser = roleOrUsername;

        // Strict Role Filtering
        const userTickets = (currentUser === 'Admin' || currentUser === 'Super Admin')
            ? tickets
            : tickets.filter(t => t.username === currentUser || t.userName === currentUser);

        const issues = userTickets.filter(t => t.type === 'issue');
        const alerts = userTickets.filter(t => t.type === 'alert');

        const getSourceBreakdown = (list) => {
            const sources = ['Water', 'Energy', 'Gas', 'Solar'];
            return sources.reduce((acc, source) => {
                acc[source.toLowerCase()] = list.filter(t => (t.source || t.issueType || '').toLowerCase() === source.toLowerCase()).length;
                return acc;
            }, {});
        };

        const getStatusBreakdown = (list) => {
            const sources = ['Water', 'Energy', 'Gas', 'Solar'];
            return sources.map(source => ({
                label: source,
                value: list.filter(t => (t.source || t.issueType || '').toLowerCase() === source.toLowerCase()).length,
                color: source === 'Water' ? 'text-blue-600' : source === 'Energy' ? 'text-amber-600' : source === 'Gas' ? 'text-purple-600' : 'text-orange-600'
            }));
        };

        return {
            overall: {
                total: userTickets.length,
                pending: userTickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
                assigned: userTickets.filter(t => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS).length,
                resolved: userTickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
                sourceCounts: getSourceBreakdown(userTickets),
                statusBreakdown: getStatusBreakdown(userTickets)
            },
            issues: {
                total: issues.length,
                open: issues.filter(t => t.status === TICKET_STATUS.PENDING).length,
                assigned: issues.filter(t => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS).length,
                closed: issues.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
                sourceCounts: getSourceBreakdown(issues),
                statusBreakdown: getStatusBreakdown(issues)
            },
            alerts: {
                total: alerts.length,
                open: alerts.filter(t => t.status === TICKET_STATUS.PENDING).length,
                assigned: alerts.filter(t => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS).length,
                closed: alerts.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
                sourceCounts: getSourceBreakdown(alerts),
                statusBreakdown: getStatusBreakdown(alerts)
            },
            // Legacy/Compatibility
            totalAlerts: alerts.length,
            totalIssues: issues.length,
            tickets: userTickets
        };
    }, [tickets]);

    // Form Validation Helper
    const validateTicket = (data) => {
        if (!data.name || data.name.trim() === '') return { valid: false, error: 'Ticket/Issue name is required' };
        if (!data.description || data.description.trim() === '') return { valid: false, error: 'Description is required' };
        return { valid: true };
    };

    // Robust Ticket Operations
    const assignEngineer = async (ticketId, engineerName) => {
        try {
            const updated = await apiService.updateTicket(ticketId, {
                engineer: engineerName,
                assignedEngineer: engineerName,
                status: TICKET_STATUS.ASSIGNED, // Always set to assigned when choosing engineer
                assignedDate: new Date().toISOString().split('T')[0]
            });
            setTickets(prev => prev.map(t => (t.id === ticketId || t.ticketId === ticketId) ? { ...t, ...updated } : t));
        } catch (err) {
            console.error("Failed to assign engineer persistence:", err);
        }
    };

    const updateTicket = async (ticketId, updatedData) => {
        try {
            const updated = await apiService.updateTicket(ticketId, {
                ...updatedData,
                type: (updatedData.type || 'issue').toLowerCase(),
                updatedAt: new Date().toISOString()
            });
            setTickets(prev => prev.map(t => (t.id === ticketId || t.ticketId === ticketId) ? { ...t, ...updated } : t));
        } catch (err) {
            console.error("Failed to update ticket persistence:", err);
        }
    };

    const addTicket = async (newTicket) => {
        const validation = validateTicket(newTicket);
        if (!validation.valid) {
            console.error('Ticket Validation Failed:', validation.error);
            return null;
        }

        const payload = {
            ...newTicket,
            id: newTicket.id || `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            username: newTicket.username || sessionStorage.getItem('userName') || 'domestic1',
            type: (newTicket.type || 'issue').toLowerCase(),
            createdAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            status: TICKET_STATUS.PENDING,
            priority: newTicket.priority || TICKET_PRIORITY.MEDIUM,
            engineer: null
        };

        try {
            const savedTicket = await apiService.createTicket(payload);
            setTickets(prev => [savedTicket, ...prev]);
            return savedTicket;
        } catch (err) {
            console.error("Failed to persist new ticket:", err);
            return null;
        }
    };

    const deleteTicket = async (ticketId) => {
        try {
            await apiService.deleteTicket(ticketId);
            setTickets(prev => prev.filter(t => t.id !== ticketId && t.ticketId !== ticketId));
        } catch (err) {
            console.error("Failed to delete ticket persistence:", err);
        }
    };

    const resolveTicket = async (ticketId) => {
        try {
            const updated = await apiService.updateTicket(ticketId, {
                status: TICKET_STATUS.RESOLVED,
                resolvedAt: new Date().toISOString()
            });
            setTickets(prev => prev.map(t => (t.id === ticketId || t.ticketId === ticketId) ? { ...t, ...updated } : t));
        } catch (err) {
            console.error("Failed to resolve ticket persistence:", err);
        }
    };

    // Debug Bridge & Mock Fetch (QA Enhancement)
    useEffect(() => {
        let originalFetch;

        if (import.meta.env.DEV) {
            window.__SUPPORT_SYSTEM__ = {
                getTickets: () => JSON.parse(JSON.stringify(ticketsRef.current)), // deep clone
                getKPIs: (roleOrUsername) => calculateKPIs(roleOrUsername),
                addTicket: (t) => addTicket(t),
                updateTicket: (id, d) => updateTicket(id, d),
                deleteTicket: (id) => deleteTicket(id),
                assignEngineer: (id, e) => assignEngineer(id, e),
                resolveTicket: (id) => resolveTicket(id),
                TICKET_STATUS,
                TICKET_PRIORITY,

                // Specific QA Commands
                createTicket: (username, type, title, description = 'QA Test Ticket') => {
                    return addTicket({
                        name: title,
                        username: username,
                        type: type.toLowerCase(),
                        description: description
                    });
                },
                getUserKPI: (username) => {
                    const kpis = calculateKPIs(username);
                    return {
                        issuesCount: kpis.issues.total,
                        alertsCount: kpis.alerts.total,
                        assignedCount: kpis.overall.assigned,
                        solvedCount: kpis.overall.resolved
                    };
                }
            };

            originalFetch = window.fetch;
            window.fetch = async (url, options) => {
                if (url === '/api/tickets') {
                    return new Response(JSON.stringify(ticketsRef.current), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                if (url.includes('/api/kpi/')) {
                    const parts = url.split('/');
                    const id = parts[parts.length - 1];
                    return new Response(JSON.stringify(calculateKPIs(id)), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                return originalFetch(url, options);
            };
        }

        return () => {
            if (import.meta.env.DEV) {
                if (originalFetch) window.fetch = originalFetch;
                delete window.__SUPPORT_SYSTEM__;
            }
        };
    }, [calculateKPIs]);

    return (
        <SupportContext.Provider value={{
            tickets,
            isLoading,
            addTicket,
            updateTicket,
            deleteTicket,
            assignEngineer,
            resolveTicket,
            TICKET_STATUS,
            TICKET_PRIORITY,
            getKPIs: calculateKPIs
        }}>
            {children}
        </SupportContext.Provider>
    );
}

export const useSupport = () => {
    const context = useContext(SupportContext);
    if (!context) {
        throw new Error('useSupport must be used within a SupportProvider');
    }
    return context;
};
