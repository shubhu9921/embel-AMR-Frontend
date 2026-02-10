import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

const mockPayloads = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    tid: 1,
    mac: "EE:8A:C2:A1:F7:CD",
    device: i % 2 === 0 ? "Sopan-HTTPS" : "GM G-03",
    date: "07/12/2025",
    time: "17:36:43",
    meterStart: (46.67 + i).toFixed(2),
    startBalance: (1999.97 + i * 10).toFixed(2),
    readings: Array(24).fill(0).map((_, idx) => idx === 1 ? 6 : 0), // R1 is 6
    endBalance: (23150.99 + i).toFixed(2),
    meterEnd: (64.73 + i).toFixed(2),
    pushButton: 0,
    battery: 100,
    signalPower: 1,
    signalQuality: 27,
    snr: 3
}));

export default function PayloadsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const filteredPayloads = mockPayloads.filter(p =>
        p.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mac.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedPayloads = filteredPayloads.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredPayloads.length / pageSize);

    return (
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 p-4">
            <div className="relative flex flex-col h-[calc(100vh-100px)] overflow-hidden text-[#002D5E] font-sans">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col w-full h-full overflow-hidden p-4">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold text-[#002D5E] uppercase tracking-tight">Payloads</h1>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    placeholder="Search Payload..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-700 bg-white shadow-sm transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <div className="relative group">
                                <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg text-sm font-bold uppercase transition-all shadow-md active:scale-95 flex items-center justify-center">
                                    <Download className="w-5 h-5 stroke-[3]" />
                                </button>
                                <span className="absolute top-full right-0 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                                    Download
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-auto flex-1 custom-scrollbar border rounded-xl border-gray-100">
                        <table className="w-full text-[13px] border-collapse sticky-header whitespace-nowrap">
                            <thead className="bg-[#F8FAFC] text-[#002D5E] font-black uppercase border-b sticky top-0 z-10 text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left border-r min-w-[60px]">Sr. No.</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[60px]">TID</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[140px]">Mac Address</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[150px]">Device Name</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[100px]">Date</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[100px]">Time</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[120px]">Meter Start Reading</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[120px]">Start Balance (Rs)</th>
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <th key={i} className="px-4 py-3 text-center border-r min-w-[50px]">R{i}</th>
                                    ))}
                                    <th className="px-4 py-3 text-left border-r min-w-[120px]">End Balance (Rs)</th>
                                    <th className="px-4 py-3 text-left border-r min-w-[120px]">Meter End Reading</th>
                                    <th className="px-4 py-3 text-center border-r min-w-[100px]">Push Button Count</th>
                                    <th className="px-4 py-3 text-center border-r min-w-[80px]">Battery (%)</th>
                                    <th className="px-4 py-3 text-center border-r min-w-[80px]">Signal Power</th>
                                    <th className="px-4 py-3 text-center border-r min-w-[80px]">Signal Quality</th>
                                    <th className="px-4 py-3 text-center border-r min-w-[100px]">Signal Noise Ratio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayedPayloads.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors text-gray-700">
                                        <td className="px-4 py-2 border-r">{row.id}</td>
                                        <td className="px-4 py-2 border-r">{row.tid}</td>
                                        <td className="px-4 py-2 border-r font-mono text-xs">{row.mac}</td>
                                        <td className="px-4 py-2 border-r font-medium">{row.device}</td>
                                        <td className="px-4 py-2 border-r">{row.date}</td>
                                        <td className="px-4 py-2 border-r">{row.time}</td>
                                        <td className="px-4 py-2 border-r">{row.meterStart}</td>
                                        <td className="px-4 py-2 border-r">{row.startBalance}</td>
                                        {row.readings.map((reading, i) => (
                                            <td key={i} className="px-4 py-2 border-r text-center">{reading}</td>
                                        ))}
                                        <td className="px-4 py-2 border-r">{row.endBalance}</td>
                                        <td className="px-4 py-2 border-r">{row.meterEnd}</td>
                                        <td className="px-4 py-2 border-r text-center">{row.pushButton}</td>
                                        <td className="px-4 py-2 border-r text-center">{row.battery}</td>
                                        <td className="px-4 py-2 border-r text-center">{row.signalPower}</td>
                                        <td className="px-4 py-2 border-r text-center">{row.signalQuality}</td>
                                        <td className="px-4 py-2 border-r text-center">{row.snr}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center gap-4 pt-3 mt-auto border-t border-gray-100 bg-white">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Showing <span className="text-blue-600">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredPayloads.length)}</span> of <span className="text-gray-900">{filteredPayloads.length}</span> payloads
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100 transition-all text-gray-700 font-medium"
                            >
                                Prev
                            </button>
                            <span className="px-3 py-1.5 text-sm font-medium text-gray-700">Page {currentPage} of {totalPages || 1}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100 transition-all text-gray-700 font-medium"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
