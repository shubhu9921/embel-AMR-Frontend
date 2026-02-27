import { useState, useCallback } from 'react';

/**
 * A reusable hook for managing form state, validation, and submission status.
 *
 * @param {Object} initialState - The initial values for the form fields.
 * @param {Function} validateFn - A function that takes the current values and returns an errors object (can be async).
 * @returns {Object} Tools and state to manage the form. handleSubmit returns a Promise<boolean>.
 */
export const useFormValidation = (initialState, validateFn = () => ({})) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Standard change handler for typical inputs
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setValues(prev => ({ ...prev, [name]: finalValue }));

        // Clear specific error when user edits
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear global form error when user edits
        if (errors.form) {
            setErrors(prev => ({ ...prev, form: '' }));
        }
    }, [errors]);

    // Manual setter for custom inputs (e.g., Selects, complex components)
    const setFieldValue = useCallback((name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (errors.form) {
            setErrors(prev => ({ ...prev, form: '' }));
        }
    }, [errors]);

    // Submission orchestration
    const handleSubmit = useCallback(async (e, submitFn) => {
        if (e && e.preventDefault) e.preventDefault();

        // Support both sync and async validation
        const validationErrors = await Promise.resolve(validateFn(values));

        if (Object.keys(validationErrors || {}).length > 0) {
            setErrors(validationErrors);
            return false;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            await submitFn(values);
            return true;
        } catch (err) {
            setErrors({ form: err.message || 'An error occurred during submission' });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validateFn]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        setFieldValue,
        handleSubmit,
        setValues,
        setErrors,
        setIsSubmitting
    };
};
