import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for standardizing data fetching logic across the application.
 * Manages loading states, error handling, and dependency-based re-fetching.
 * 
 * @param {Function} fetchFunction - The API service function to call (must return a promise)
 * @param {Array} dependencies - Array of dependencies that will trigger a re-fetch when changed
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to run the fetch immediately on mount (default: true)
 * @param {any} options.initialData - Initial data state before fetch completes
 * @param {Function} options.onSuccess - Callback fired on successful fetch
 * @param {Function} options.onError - Callback fired on fetch error
 */
export const useFetchData = (fetchFunction, dependencies = [], options = {}) => {
    const {
        immediate = true,
        initialData = null,
        onSuccess,
        onError
    } = options;

    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchIdRef = useRef(0);

    // Store latest callbacks and fetchFunction to avoid dependency cycles
    const callbacksRef = useRef({ onSuccess, onError });
    const fetchFnRef = useRef(fetchFunction);

    useEffect(() => {
        callbacksRef.current = { onSuccess, onError };
        fetchFnRef.current = fetchFunction;
    });

    const execute = useCallback(async (...args) => {
        const currentFetchId = ++fetchIdRef.current;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchFnRef.current(...args);
            if (currentFetchId !== fetchIdRef.current) return undefined; // Ignore stale fetches

            setData(response);
            if (callbacksRef.current.onSuccess) callbacksRef.current.onSuccess(response);
            return response;
        } catch (err) {
            if (currentFetchId !== fetchIdRef.current) return undefined; // Ignore stale errors

            const errorMsg = err.message || 'An unexpected error occurred while fetching data.';
            setError(errorMsg);

            if (callbacksRef.current.onError) {
                callbacksRef.current.onError(err);
            } else {
                // Only throw if there's no custom error handler to avoid double-reporting/unhandled rejections
                throw err;
            }
        } finally {
            if (currentFetchId === fetchIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [fetchFunction]); // Removed JSON stringify and callback deps

    // Use a ref to deeply compare dependencies and trigger effect, or just let React handle the array if primitives
    // Since we don't know the stability of dependencies, we use a custom deep compare effect using a ref
    const depsRef = useRef(dependencies);
    const depsChanged = dependencies.length !== depsRef.current.length || dependencies.some((dep, i) => dep !== depsRef.current[i]);
    if (depsChanged) {
        depsRef.current = dependencies;
    }

    useEffect(() => {
        if (immediate) {
            execute().catch(err => {
                // If it wasn't handled by custom onError, we log it so it doesn't fail silently
                if (!callbacksRef.current.onError) {
                    console.error("useFetchData background fetch failed:", err);
                }
            });
        }

        return () => {
            // Cleanup: invalidate current fetch on unmount to prevent setting state on unmounted component
            fetchIdRef.current++;
        };
    }, [depsRef.current, immediate, execute]); // React to actual dependency changes via depsRef.current

    return {
        data,
        isLoading,
        error,
        execute,
        setData // Exposing setData for optimistic UI updates if needed
    };
};
