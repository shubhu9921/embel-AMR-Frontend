import { useState, useMemo, useCallback, useEffect } from 'react';

export const useTable = (data, options = {}) => {
    const {
        pageSize = 10,
        initialFilters = {},
        searchFields = [],
        customFilter = null
    } = options;

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFiltersInternal] = useState(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);

    const setFilters = useCallback((key, value) => {
        if (typeof key === 'string') {
            setFiltersInternal(prev => ({ ...prev, [key]: value }));
        } else {
            setFiltersInternal(key);
        }
    }, []);

    // Filtered data calculation
    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Search logic
            const matchesSearch = searchTerm === "" || searchFields.some(field => {
                const value = item[field];
                return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });

            if (!matchesSearch) return false;

            // Filter logic (assumes "All" means no filter)
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (value === "All") return true;
                return item[key] === value;
            });

            if (!matchesFilters) return false;

            // Custom filter logic
            if (customFilter && !customFilter(item)) return false;

            return true;
        });
    }, [data, searchTerm, filters, searchFields, customFilter]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    // Keep currentPage within bounds
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1 && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const handlePrevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    return {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems: filteredData.length,
        filteredData: currentItems,
        allFilteredData: filteredData,
        handlePrevPage,
        handleNextPage
    };
};
