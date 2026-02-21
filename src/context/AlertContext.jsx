import React, { createContext, useContext, useState } from "react";
import { dashboardAlerts } from "../data/mockData";

// Create context
const AlertContext = createContext();

// Provider component
export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState(dashboardAlerts.map(a => ({ ...a, read: false })));

    // Mark a single alert as read
    const markAsRead = (id) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, read: true } : a))
        );
    };

    // Mark all alerts as read
    const markAllAsRead = () => {
        setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    };

    // Dismiss an alert
    const dismissAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <AlertContext.Provider
            value={{ alerts, markAsRead, markAllAsRead, dismissAlert }}
        >
            {children}
        </AlertContext.Provider>
    );
}

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlerts must be used within AlertProvider");
    }
    return context;
};
