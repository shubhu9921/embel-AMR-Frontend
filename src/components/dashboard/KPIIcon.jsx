import React from 'react';

/**
 * Reusable KPI Icon component for consistent styling across all KPI cards.
 * 
 * Features:
 * - Fixed orange color theme (text-orange-600, bg-orange-50)
 * - Absolute positioning on the right of the parent card
 * - Hover effect: Opacity shifts from 0.2 to 1.0 (requires 'group' on parent)
 * - Standardized sizing and alignment
 */
const KPIIcon = React.memo(({ icon, className = "" }) => {
    if (!icon) return null;

    return (
        <div className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300 opacity-20 group-hover:opacity-100 ${className}`}>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shadow-sm flex items-center justify-center">
                {React.cloneElement(icon, {
                    size: 16,
                    strokeWidth: 2,
                    className: "w-4 h-4"
                })}
            </div>
        </div>
    );
});

export default KPIIcon;


