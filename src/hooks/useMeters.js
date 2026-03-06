import { useData } from '../context/DataContext';

export const useMeters = () => {
    const {
        meters,
        isLoading,
        addMeter,
        updateMeter,
        deleteMeter,
        refreshData
    } = useData();

    return {
        meters,
        isLoading,
        addMeter,
        updateMeter,
        deleteMeter,
        refreshData
    };
};
