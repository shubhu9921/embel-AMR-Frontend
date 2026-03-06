import { useData } from '../context/DataContext';

export const useUsers = () => {
    const {
        users,
        isLoading,
        addUser,
        updateUser,
        deleteUser,
        refreshData
    } = useData();

    return {
        users,
        isLoading,
        addUser,
        updateUser,
        deleteUser,
        refreshData
    };
};
