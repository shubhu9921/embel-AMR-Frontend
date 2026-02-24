import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { initialTickets, TICKET_STATUS, TICKET_PRIORITY } from '../data/supportData';
import { industrialIssues, domesticIssues, industrialAlerts, domesticAlerts } from '../data/mockData';

const SupportContext = createContext();

export function SupportProvider({ children }) {
    // Initialize state combining all sources
    const [tickets, setTickets] = useState(() => {
        const combinedInitial = (initialTickets || []).map(t => ({
            ...t,
            id: t.id || t.ticketId || `TKT-${Math.random().toString(36).substring(7)}`,
            username: t.username || t.userName || 'admin1',
            type: (t.type || t.category || 'issue').toLowerCase()
        }));

        const indIssues = (industrialIssues || []).map(t => ({
            ...t,
            id: t.id || t.ticketId || `TKT-${Math.random().toString(36).substring(7)}`,
            username: t.username || 'industrial1',
            type: 'issue',
            role: 'Industrial'
        }));

        const domIssues = (domesticIssues || []).map(t => ({
            ...t,
            id: t.id || t.ticketId || `TKT-${Math.random().toString(36).substring(7)}`,
            username: t.username || 'domestic1',
            type: 'issue',
            role: 'Domestic'
        }));

        const all = [...combinedInitial, ...indIssues, ...domIssues];
        return Array.from(new Map(all.map(item => [item.id || item.ticketId, item])).values());
    });

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

        return {
            overall: {
                total: userTickets.length,
                pending: userTickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
                assigned: userTickets.filter(t => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS).length,
                resolved: userTickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
            },
            issues: {
                total: issues.length,
                open: issues.filter(t => t.status === TICKET_STATUS.PENDING).length,
                assigned: issues.filter(t => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS).length,
                closed: issues.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
            },
            alerts: {
                total: alerts.length,
                open: alerts.filter(t => t.status === TICKET_STATUS.PENDING).length,
                assigned: alerts.filter(t => t.status === TICKET_STATUS.ASSIGNED || t.status === TICKET_STATUS.IN_PROGRESS).length,
                closed: alerts.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
            },
            // Legacy/Compatibility
            totalAlerts: alerts.length,
            totalIssues: issues.length
        };
    }, [tickets]);

    // Form Validation Helper
    const validateTicket = (data) => {
        if (!data.name || data.name.trim() === '') return { valid: false, error: 'Ticket/Issue name is required' };
        if (!data.description || data.description.trim() === '') return { valid: false, error: 'Description is required' };
        return { valid: true };
    };

    // Robust Ticket Operations
    const assignEngineer = (ticketId, engineerName) => {
        setTickets(prev => prev.map(t =>
            (t.id === ticketId || t.ticketId === ticketId)
                ? {
                    ...t,
                    engineer: engineerName,
                    assignedEngineer: engineerName,
                    status: (t.status === TICKET_STATUS.RESOLVED ? t.status : TICKET_STATUS.ASSIGNED),
                    assignedDate: new Date().toISOString().split('T')[0]
                }
                : t
        ));
    };

    const updateTicket = (ticketId, updatedData) => {
        setTickets(prev => prev.map(t =>
            (t.id === ticketId || t.ticketId === ticketId)
                ? { ...t, ...updatedData, type: (updatedData.type || t.type).toLowerCase(), updatedAt: new Date().toISOString() }
                : t
        ));
    };

    const addTicket = (newTicket) => {
        const validation = validateTicket(newTicket);
        if (!validation.valid) {
            console.error('Ticket Validation Failed:', validation.error);
            return null; // Reject invalid tickets gracefully
        }

        const ticket = {
            ...newTicket,
            id: newTicket.id || `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            username: newTicket.username || 'domestic1',
            type: (newTicket.type || 'issue').toLowerCase(),
            createdAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            status: TICKET_STATUS.PENDING,
            priority: newTicket.priority || TICKET_PRIORITY.MEDIUM,
            engineer: null
        };
        setTickets(prev => [ticket, ...prev]);
        return ticket;
    };

    const deleteTicket = (ticketId) => {
        setTickets(prev => prev.filter(t => t.id !== ticketId && t.ticketId !== ticketId));
    };

    const resolveTicket = (ticketId) => {
        setTickets(prev => prev.map(t =>
            (t.id === ticketId || t.ticketId === ticketId)
                ? { ...t, status: TICKET_STATUS.RESOLVED, resolvedAt: new Date().toISOString() }
                : t
        ));
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
