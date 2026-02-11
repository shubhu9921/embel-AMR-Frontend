import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Download,
    Filter,
    Wifi,
    Zap,
    Battery,
    Signal,
    Activity,
    Server,
    Database,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Calendar
} from 'lucide-react';

const mockPayloads = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    tid: 100 + i,
    mac: "EE:8A:C2:A1:F7:CD",
    device: i % 2 === 0 ? "Sopan-HTTPS" : "GM G-03",
    date: "07/12/2025",
    time: "17:36:43",
    meterStart: (46.67 + i).toFixed(2),
    startBalance: (1999.97 + i * 10).toFixed(2),
    readings: Array(24).fill(0).map((_, idx) => idx === 1 ? 6 : 0), // R1 is 6
    endBalance: (23150.99 + i).toFixed(2),
    meterEnd: (64.73 + i).toFixed(2),
    pushButton: Math.floor(Math.random() * 5),
    battery: Math.floor(Math.random() * 20) + 80,
    signalPower: Math.floor(Math.random() * 5),
    signalQuality: Math.floor(Math.random() * 30),
    snr: Math.floor(Math.random() * 10)
}));

export default function PayloadsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterDeviceType, setFilterDeviceType] = useState("All");
    const filterRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredPayloads = mockPayloads.filter(p =>
        (p.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.mac.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterDeviceType === "All" || p.device.includes(filterDeviceType))
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterDeviceType]);

    const displayedPayloads = filteredPayloads.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredPayloads.length / pageSize);

    // KPI Calculations
    const totalPayloads = mockPayloads.length;
    const avgSignalQuality = Math.round(mockPayloads.reduce((acc, curr) => acc + curr.signalQuality, 0) / totalPayloads);
    const lowBatteryCount = mockPayloads.filter(p => p.battery < 20).length;
    const activeDevices = new Set(mockPayloads.map(p => p.device)).size;

    return (
        <main className="flex-1 overflow-y-auto bg-[#F3F4F6] p-4 md:p-6 scroll-smooth font-sans">

            {/* Top Header */}
            {/* Top Header */}
            <div className="sticky top-0 z-30 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-orange-50/90 mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <Database size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Payloads Data
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                Raw device logs & telemetry
                            </p>
                        </div>
                    </div>
                    <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20" />
                </div>
            </div>


            <div className="max-w-[1920px] mx-auto space-y-6">

                {/* KPI Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(255,110,0,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Payloads</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1 group-hover:text-[#ff6e00] transition-colors">{totalPayloads}</h3>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-[#ff6e00] group-hover:text-white transition-all duration-300">
                            <Database className="w-8 h-8 text-[#ff6e00] group-hover:text-white" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(255,110,0,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Avg Signal Quality</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1 group-hover:text-blue-600 transition-colors">{avgSignalQuality}%</h3>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Signal className="w-8 h-8 text-blue-600 group-hover:text-white" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(255,110,0,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Devices</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1 group-hover:text-green-500 transition-colors">{activeDevices}</h3>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                            <Zap className="w-8 h-8 text-green-500 group-hover:text-white" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(255,110,0,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Low Battery</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1 group-hover:text-red-500 transition-colors">{lowBatteryCount}</h3>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                            <Battery className="w-8 h-8 text-red-500 group-hover:text-white" />
                        </div>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-280px)]">

                    {/* Header Controls */}
                    <div className="p-4 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm z-20 rounded-t-2xl">
                        {/* Left: Title & Search */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search MAC, Device..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-sm group-hover:bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Actions & Filter */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Device Filter Dropdown */}
                            <div className="relative min-w-[150px]" ref={filterRef}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none ${isFilterOpen
                                        ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="truncate">
                                        {filterDeviceType === 'All' ? 'All Devices' : filterDeviceType}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    {['All', 'Sopan', 'GM'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterDeviceType(option);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${filterDeviceType === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                                                }`}
                                        >
                                            {option === 'All' ? 'All Devices' : option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

                            {/* Action Buttons */}
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95">
                                <Download className="w-5 h-5 stroke-[2.5]" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/90 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 bg-gray-50/90 sticky left-0 z-20 w-[60px]">Sr.</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 min-w-[80px]">TID</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 min-w-[160px]">Mac Address</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 min-w-[140px]">Device</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 min-w-[120px]">Timestamp</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-right min-w-[120px]">Meter Start</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-right min-w-[120px]">Start Bal</th>

                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <th key={i} className="px-2 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-center w-[50px]">R{i + 1}</th>
                                    ))}

                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-right min-w-[120px]">End Bal</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-right min-w-[120px]">Meter End</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-center min-w-[80px]">Buttons</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-center min-w-[80px]">Battery</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-center min-w-[80px]">Signal</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r border-r-gray-100 last:border-r-0 text-center min-w-[80px]">Quality</th>
                                    <th className="px-4 py-3 border-b border-gray-100 border-r text-center min-w-[80px]">SNR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayedPayloads.length > 0 ? (
                                    displayedPayloads.map((row) => (
                                        <tr key={row.id} className="hover:bg-orange-50/30 transition-colors duration-150">
                                            <td className="px-4 py-2 border-r border-gray-100 font-medium text-gray-600 bg-white sticky left-0 z-10 group-hover:bg-orange-50/30">{row.id}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-gray-600">{row.tid}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-gray-800 font-mono text-xs font-medium">{row.mac}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-[#ff6e00] font-bold">{row.device}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-gray-500 text-xs">
                                                <div className="flex flex-col">
                                                    <span>{row.date}</span>
                                                    <span className="text-[10px] opacity-75">{row.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-right font-medium text-gray-700">{row.meterStart}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-right font-medium text-gray-700">{row.startBalance}</td>

                                            {row.readings.map((reading, i) => (
                                                <td key={i} className={`px-2 py-2 border-r border-gray-100 text-center text-xs ${reading > 0 ? 'font-bold text-[#ff6e00] bg-orange-50/50' : 'text-gray-300'}`}>
                                                    {reading}
                                                </td>
                                            ))}

                                            <td className="px-4 py-2 border-r border-gray-100 text-right font-medium text-gray-700">{row.endBalance}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-right font-medium text-gray-700">{row.meterEnd}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-600">{row.pushButton}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-center">
                                                <div className={`inline-flex items-center gap-1 font-bold ${row.battery < 20 ? 'text-red-500' : 'text-green-600'}`}>
                                                    {row.battery}%
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-600">{row.signalPower}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-600">{row.signalQuality}</td>
                                            <td className="px-4 py-2 border-r border-gray-100 text-center text-gray-600">{row.snr}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={40} className="px-6 py-12 text-center text-gray-500">
                                            No payloads found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-3 bg-white flex items-center justify-between z-20 rounded-b-2xl">
                        <span className="text-xs text-gray-500 font-medium">
                            Showing <span className="font-bold text-gray-900">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredPayloads.length)}</span> of <span className="font-bold text-gray-900">{filteredPayloads.length}</span>
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-xs font-bold text-gray-700 px-2">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </main >
    );
}
