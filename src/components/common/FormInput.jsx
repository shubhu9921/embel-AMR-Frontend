import React from 'react';

const FormInput = ({
    label,
    id,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    className = "",
    required = false,
    disabled = false,
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id || name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                id={id || name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`
                    w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2
                    ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'
                    }
                    ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-75' : 'bg-white'}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
