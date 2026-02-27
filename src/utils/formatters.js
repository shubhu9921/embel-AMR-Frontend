/**
 * formatters.js
 * 
 * Centralized Utility Layer for data presentation and formatting.
 * Consolidates repeated inline logic found across Dashboard, Billing, and Report views.
 */

/**
 * Format string or number to Indian Rupee (₹) currency format.
 * Defaults to 0 decimal places for large numbers, configurable.
 * 
 * @example formatCurrency(10502) => "₹10,502"
 */
export const formatCurrency = (amount, decimals = 0) => {
    if (amount === null || amount === undefined) return "₹0";

    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
    if (isNaN(num)) return "₹0";

    const isNegative = num < 0;
    const absNum = Math.abs(num);

    const formattedString = absNum.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    return (isNegative ? "-" : "") + "₹" + formattedString;
};

/**
 * Format growth/decline percentages. Ensures no NaN rendering.
 * 
 * @example formatPercentage(12.5) => "+12.5%"
 * @example formatPercentage(-4) => "-4.0%"
 */
export const formatPercentage = (value, decimals = 1, includeSign = true) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0%";

    const formatted = Math.abs(num).toFixed(decimals) + "%";
    if (!includeSign) return formatted;
    return num > 0 ? "+" + formatted : (num < 0 ? "-" + formatted : formatted);
};

/**
 * Parses and formats abbreviated numbers (K, M, etc.)
 * 
 * @example formatCompactNumber(12500) => "12.5k"
 */
export const formatCompactNumber = (num, decimals = 1) => {
    if (isNaN(num)) return "0";

    const formatter = Intl.NumberFormat('en', { notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: decimals });
    return formatter.format(num).toLowerCase();
};

/**
 * Standardize Status badge colors. 
 * Allows for central UI theme changes without scouring components.
 */
export const getStatusColorConfig = (status) => {
    const normalizedStatus = (status || '').toLowerCase();
    switch (normalizedStatus) {
        case 'paid':
        case 'active':
        case 'resolved':
        case 'closed':
            return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
        case 'pending':
        case 'warning':
        case 'assigned':
            return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
        case 'overdue':
        case 'offline':
        case 'error':
            return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
        default:
            return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
    }
};

/**
 * Standardize Resource Type badge colors.
 */
export const getResourceTypeColorConfig = (type) => {
    const normalizedType = (type || '').toUpperCase();
    switch (normalizedType) {
        case 'SOLAR': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
        case 'WATER': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
        case 'ELECTRIC':
        case 'ENERGY': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
        case 'GAS': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
};
