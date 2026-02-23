import { useState, useRef, useEffect } from 'react';
import { AlertCircle, Search, ChevronLeft, ChevronRight, Filter, Eye, MessageSquare, ChevronDown, CheckCircle, Info, AlertTriangle, Edit } from 'lucide-react';
import { domesticIssues, industrialIssues } from '../data/mockData';
import AlertIssueDetailsModal from '../components/modals/AlertIssueDetailsModal';
import SupportModal from '../components/modals/SupportModal';

export default function IssuesPage({ setActivePage = () => { } }) {
    const userRole = sessionStorage.getItem('userRole') || 'Admin';
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportItem, setSupportItem] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null); // 'status', 'source'
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const pageSize = 8;

    const allIssues = userRole === 'Domestic' ? domesticIssues : userRole === 'Industrial' ? industrialIssues : [...domesticIssues, ...industrialIssues];

    const filteredIssues = allIssues.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.deviceName.toLowerCase().includes(search.toLowerCase()) ||
            item.location.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSource = sourceFilter === 'all' || item.source.toLowerCase() === sourceFilter.toLowerCase();
        return matchesSearch && matchesStatus && matchesSource;
    });

    const totalPages = Math.ceil(filteredIssues.length / pageSize);
    const paginatedIssues = filteredIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleView = (item) => {
        setSelectedItem(item);
        setShowDetailsModal(true);
    };

    const handleRaiseSupport = (item) => {
        setSupportItem(item);
        setShowSupportModal(true);
    };

    const statusStyles = {
        Pending: 'bg-amber-100 text-amber-700 border-amber-200',
        Processing: 'bg-blue-100 text-blue-700 border-blue-200',
        Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden relative p-4 md:p-6 font-sans">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transition-transform duration-300 hover:scale-105">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Issues</h1>
                        <p className="text-sm font-medium text-gray-500">Track and manage system-wide reported issues</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-2xl shadow-md shadow-orange-100/50 p-5 border border-gray-100">
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search issues, devices, locations..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-md shadow-orange-100"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3" ref={dropdownRef}>
                    {/* Status Filter */}
                    <div className="relative min-w-[160px]">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                            className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'status' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}
                        >
                            <span className="truncate">{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === 'status' && (
                            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in zoom-in duration-200">
                                {['all', 'Pending', 'Processing', 'Resolved'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => { setStatusFilter(opt); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${statusFilter === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}
                                    >
                                        {opt === 'all' ? 'All Status' : opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Source Filter */}
                    <div className="relative min-w-[160px]">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'source' ? null : 'source')}
                            className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'source' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}
                        >
                            <span className="truncate">{sourceFilter === 'all' ? 'All Sources' : sourceFilter}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'source' ? 'rotate-180' : ''}`} />
                        </button>
                        {openDropdown === 'source' && (
                            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in zoom-in duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                                {['all', 'Water', 'Energy', 'Gas', 'Solar', 'System', 'Billing'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSourceFilter(opt); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${sourceFilter === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}
                                    >
                                        {opt === 'all' ? 'All Sources' : opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Device</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Engineer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedIssues.map((item) => (
                                <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{item.source}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.deviceName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.location}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${statusStyles[item.status] || 'bg-gray-100'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.assignedEngineer ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                    {item.assignedEngineer.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{item.assignedEngineer}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRaiseSupport(item)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                                title="Edit Ticket"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {
                    filteredIssues.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-400">
                            <AlertCircle size={48} className="mb-4 opacity-20" />
                            <p className="font-medium text-lg text-gray-500">No issues found</p>
                            <p className="text-sm">Try adjusting your filters or search terms</p>
                        </div>
                    )
                }
            </div >

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            aria-label="Next Page"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )
            }

            {
                showDetailsModal && selectedItem && (
                    <AlertIssueDetailsModal
                        item={selectedItem}
                        onClose={() => setShowDetailsModal(false)}
                    />
                )
            }

            {
                showSupportModal && supportItem && (
                    <SupportModal
                        editItem={{ ...supportItem, status: 'Active' }}
                        onClose={() => setShowSupportModal(false)}
                        setActivePage={setActivePage}
                    />
                )
            }
        </div >
    );
}
