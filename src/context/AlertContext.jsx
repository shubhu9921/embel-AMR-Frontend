import React, { createContext, useContext, useState } from "react";

// Create context
const AlertContext = createContext();

// Provider component
export function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: "warning",
            title: "Peak Hour Usage Alert",
            message:
                "High energy consumption detected during peak hours (6-8 PM). Consider shifting load to off-peak hours.",
            timestamp: "3 hours ago",
            read: false,
            page: "Energy",
        },
        {
            id: 2,
            type: "success",
            title: "Energy Savings Achieved",
            message: "You saved 12.5% energy this week compared to last week. Great job!",
            timestamp: "5 hours ago",
            read: false,
            page: "Gas",
        },
        {
            id: 3,
            type: "info",
            title: "Smart Meter Update",
            message: "Firmware update completed successfully for all energy meters.",
            timestamp: "1 day ago",
            read: false,
            page: "Water",
        },
    ]);

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
