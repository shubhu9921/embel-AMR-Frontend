import { useData } from '../context/DataContext';

export const useDevices = () => {
    const {
        devices,
        isLoading,
        addDevice,
        updateDevice,
        deleteDevice,
        refreshData
    } = useData();

    return {
        devices,
        isLoading,
        addDevice,
        updateDevice,
        deleteDevice,
        refreshData
    };
};
