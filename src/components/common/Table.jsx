import React from 'react';

const Table = ({
    headers = [],
    data = [],
    renderRow,
    keyField = 'id',
    isLoading = false,
    emptyMessage = "No data available",
    className = ""
}) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                    <tr>
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-10 text-center">
                                <div className="flex justify-center space-x-2 animate-pulse">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-10 text-center text-gray-500 italic">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => renderRow ? renderRow(item, index) : (
                            <tr key={item[keyField] || index} className="hover:bg-gray-50 transition-colors">
                                {Object.values(item).map((val, i) => (
                                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {val}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
