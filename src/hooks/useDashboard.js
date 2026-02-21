import { useState, useMemo, useCallback } from 'react';
import {
    initialDevicesData,
    initialMetersData,
    initialUsers,
    multiResourceDataDay,
    multiResourceDataWeek,
    multiResourceDataMonth,
    multiResourceDataYear
} from "../data/mockData";

export const useDashboard = () => {
    /* -------------------- STATE -------------------- */
    const [consumptionTimeRange, setConsumptionTimeRange] = useState('month');
    const [activeResource, setActiveResource] = useState('All');

    // Modal States
    const [modalState, setModalState] = useState({
        map: false,
        location: false,
        userDevices: false,
        userMeters: false,
        userLocations: false,
        deviceDetails: false,
        meterDetails: false,
        issues: false
    });

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedUserDevice, setSelectedUserDevice] = useState(null);
    const [selectedUserMeter, setSelectedUserMeter] = useState(null);

    // User Dashboard Enhancements State
    const [userFilters, setUserFilters] = useState({
        device: 'All',
        meter: 'All'
    });

    const toggleModal = useCallback((modalName, value) => {
        setModalState(prev => ({ ...prev, [modalName]: value }));
    }, []);

    /* -------------------- CALCULATIONS -------------------- */
    const inactiveCounts = useMemo(() => ({
        devices: initialDevicesData.filter(d => d.status !== 'Active'),
        meters: initialMetersData.filter(m => m.status !== 'Active'),
        users: initialUsers.filter(u => u.status !== 'Active')
    }), []);

    const multiResourceData = useMemo(() => {
        switch (consumptionTimeRange) {
            case 'day': return multiResourceDataDay;
            case 'week': return multiResourceDataWeek;
            case 'month': return multiResourceDataMonth;
            case 'year':
            case 'all': return multiResourceDataYear;
            default: return multiResourceDataWeek;
        }
    }, [consumptionTimeRange]);

    const calculateBillingPercentage = useCallback((billingStats) => {
        try {
            const total = parseInt(billingStats.total.replace(/[^0-9]/g, '')) || 0;
            const pending = parseInt(billingStats.pending.replace(/[^0-9]/g, '')) || 0;
            const separator = total + pending;
            return separator === 0 ? 0 : (total / separator) * 100;
        } catch {
            return 0;
        }
    }, []);

    return {
        // State
        consumptionTimeRange,
        setConsumptionTimeRange,
        activeResource,
        setActiveResource,
        modalState,
        toggleModal,
        selectedLocation,
        setSelectedLocation,
        selectedUserDevice,
        setSelectedUserDevice,
        selectedUserMeter,
        setSelectedUserMeter,
        userFilters,
        setUserFilters,

        // Computed
        inactiveCounts,
        multiResourceData,
        calculateBillingPercentage
    };
};
