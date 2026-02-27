import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/dashboard/StatCard';
import {
    MapPin, Search, ChevronDown, Cpu, Gauge, Filter, X,
    Eye, Edit, Trash2, Plus, AlertCircle
} from 'lucide-react';
import CreateDeviceModal from "../components/modals/CreateDeviceModal";
import CreateMeterModal from "../components/modals/CreateMeterModal";
import DeviceDetailsModal from "../components/modals/DeviceDetailsModal";

export default function LocationsPage() {
    const {
        devices: fetchedDevices,
        meters: fetchedMeters,
        isLoading,
        addDevice,
        updateDevice,
        deleteDevice,
        addMeter,
        updateMeter,
        deleteMeter,
        refreshData
    } = useData();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [selectedSource, setSelectedSource] = useState("All Sources");
    const [isLocationFilterOpen, setIsLocationFilterOpen] = useState(false);
    const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const locationFilterRef = useRef(null);
    const sourceFilterRef = useRef(null);

    // Modal states
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedDetailItem, setSelectedDetailItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingDevice, setEditingDevice] = useState(null);

    const userRole = sessionStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Support Engineer';

    const devices = React.useMemo(() => {
        const devs = (fetchedDevices || []).map(d => ({ ...d, _itemType: 'device' }));
        const mtrs = (fetchedMeters || []).map(m => ({ ...m, _itemType: 'meter' }));
        return [...devs, ...mtrs];
    }, [fetchedDevices, fetchedMeters]);

    const counts = React.useMemo(() => ({
        devices: (fetchedDevices || []).length,
        meters: (fetchedMeters || []).length
    }), [fetchedDevices, fetchedMeters]);

    // Handle Clicks Outside Drops
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationFilterRef.current && !locationFilterRef.current.contains(event.target)) {
                setIsLocationFilterOpen(false);
            }
            if (sourceFilterRef.current && !sourceFilterRef.current.contains(event.target)) {
                setIsSourceFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Distinct Filters derived from data
    const locationOptions = ["All Locations", ...new Set(devices.map(d => d.location || d.meterLocation || d.city).filter(Boolean))];
    const sourceOptions = ["All Sources", "Water", "Solar", "Gas", "Energy"]; // Hardcoded sources request

    // Filter Logic
    const filteredDevices = devices.filter(device => {
        const matchesSearch =
            (device.name || device.deviceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (device.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (device.deviceId || '').toLowerCase().includes(searchTerm.toLowerCase());

        const deviceLoc = device.location || device.meterLocation || device.city;
        const matchesLocation = selectedLocation === "All Locations" || deviceLoc === selectedLocation;

        const deviceSource = (device.meterType || device.type || '').toLowerCase();
        const matchesSource = selectedSource === "All Sources" || deviceSource === selectedSource.toLowerCase();

        return matchesSearch && matchesLocation && matchesSource;
    });

    // Handlers
    const openDetailsModal = (item) => {
        setSelectedDetailItem(item);
        setDetailsModalOpen(true);
    };

    const handleCreateDevice = () => {
        setModalMode('create');
        setEditingDevice({ recordType: 'device' });
        setIsModalOpen(true);
    };

    const handleEditItem = (item) => {
        setModalMode('edit');
        const isMeter = item._itemType === 'meter';
        setEditingDevice({
            ...item,
            recordType: isMeter ? 'meter' : 'device',
            techType: item.type || item.meterType,
            macId: item.mac || item.macId,
            deviceName: item.name || item.deviceName || item.meterName,
            deviceId: item.deviceId || item.meterId,
            deviceEnable: item.status === 'Active'
        });
        setIsModalOpen(true);
    };

    const handleDeleteItem = async (item) => {
        const isMeter = item._itemType === 'meter';
        if (window.confirm(`Are you sure you want to delete ${item.name || item.deviceId || item.deviceName}?`)) {
            try {
                if (isMeter) {
                    await deleteMeter(item.id);
                } else {
                    await deleteDevice(item.id);
                }
                setDetailsModalOpen(false);
                setSelectedDetailItem(null);
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete.");
            }
        }
    };

    const handleSaveItem = async (formData) => {
        try {
            const isMeter = formData.recordType === 'meter';
            const devicePayload = {
                admin: formData.admin,
                user: formData.user,
                type: formData.techType,
                meterType: formData.meterType,
                deviceId: isMeter ? undefined : formData.deviceId,
                meterId: isMeter ? formData.deviceId : undefined,
                mac: formData.macId,
                macId: formData.macId,
                name: formData.deviceName,
                deviceName: isMeter ? undefined : formData.deviceName,
                meterName: isMeter ? formData.deviceName : undefined,
                serialNumber: formData.serialNumber,
                billType: formData.billType,
                status: formData.deviceEnable ? "Active" : "Inactive",
                amrEnable: formData.amrEnable,
                wakeupTime: formData.wakeupTime,
                sampleCount: formData.sampleCount,
                timezone: formData.timezone || "Asia/Kolkata",
                literPerPulse: formData.literPerPulse,
                application: formData.application,
                typeInfo: formData.type,
                diameter: formData.diameter,
                customerName: formData.customerName,
                customerAddress: formData.customerAddress,
                meterLocation: formData.meterLocation,
                building: formData.building,
                area: formData.area,
                zone: formData.zone,
                city: formData.city,
                state: formData.state,
                startReading: formData.startReading,
                reading: formData.startReading,
                location: formData.city || formData.meterLocation || formData.location || 'N/A'
            };

            Object.keys(devicePayload).forEach(key => devicePayload[key] === undefined && delete devicePayload[key]);

            if (modalMode === 'create') {
                if (isMeter) {
                    await addMeter(devicePayload);
                } else {
                    await addDevice(devicePayload);
                }
                alert(`${isMeter ? 'Meter' : 'Device'} Saved Successfully`);
            } else {
                const baseItem = { ...editingDevice };
                delete baseItem._itemType;
                delete baseItem.recordType;

                if (isMeter) {
                    await updateMeter(editingDevice.id, { ...baseItem, ...devicePayload });
                } else {
                    await updateDevice(editingDevice.id, { ...baseItem, ...devicePayload });
                }
                alert(`${isMeter ? 'Meter' : 'Device'} Updated Successfully`);
            }
            setIsModalOpen(false);
            setDetailsModalOpen(false);
            setSelectedDetailItem(null);
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to Save: Refreshing data...");
            await refreshData();
        }
    };

    // KPI Calc
    const totalLocationsCount = locationOptions.length > 1 ? locationOptions.length - 1 : 0; // excluding "All"
    const activeSitesCount = new Set(
        devices.filter(d => d.status?.toLowerCase() === 'active' || d.status === 'Active')
            .map(d => d.location || d.meterLocation || d.city)
            .filter(Boolean)
    ).size;

    const activeTotal = devices.filter(d => d.status?.toLowerCase() === 'active' || d.status === 'Active').length;
    const inactiveTotal = devices.length - activeTotal;

    const metersOnly = devices.filter(d => d._itemType === 'meter');
    const activeMeters = metersOnly.filter(m => m.status?.toLowerCase() === 'active' || m.status === 'Active').length;
    const inactiveMeters = metersOnly.length - activeMeters;

    const siteBreakdown = [
        { label: 'Active Sites', value: activeSitesCount, color: 'text-emerald-500' },
        { label: 'Inactive Sites', value: totalLocationsCount - activeSitesCount, color: 'text-slate-400' }
    ];

    const totalAssetBreakdown = [
        { label: 'Active', value: activeTotal, color: 'text-blue-500' },
        { label: 'Inactive', value: inactiveTotal, color: 'text-slate-400' }
    ];

    const meterBreakdown = [
        { label: 'Active', value: activeMeters, color: 'text-green-500' },
        { label: 'Inactive', value: inactiveMeters, color: 'text-slate-400' }
    ];

    return (
        <div className="flex flex-col flex-1">
            <main className="w-full min-h-screen p-4 md:p-6 font-sans lg:overflow-visible pt-6 md:pt-8">
                {/* Top Header */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transition-transform duration-300 hover:scale-105">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Devices Location</h1>
                                <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={handleCreateDevice}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
                            >
                                <Plus size={20} /> Add Asset
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-6 w-full mt-4">
                    {/* Responsive KPI Grid: 2 cards per row (small/medium), 4 cards per row (large) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard
                            title="Distinct Locations"
                            value={totalLocationsCount}
                            icon={<MapPin className="w-4 h-4" />}
                            color="purple"
                            compact
                            description="Unique Map Areas"
                        />
                        <StatCard
                            title="Active Sites"
                            value={activeSitesCount}
                            icon={<MapPin className="w-4 h-4" />}
                            color="emerald"
                            compact
                            description="Locations with Active Assets"
                            statusBreakdown={siteBreakdown}
                        />
                        <StatCard
                            title="Mapped Devices & Meters"
                            value={devices.length}
                            icon={<Cpu className="w-4 h-4" />}
                            color="blue"
                            compact
                            description={`${counts.devices} Devices + ${counts.meters} Meters`}
                            statusBreakdown={totalAssetBreakdown}
                        />
                        <StatCard
                            title="Total Meters"
                            value={counts.meters}
                            icon={<Gauge className="w-4 h-4" />}
                            color="green"
                            compact
                            description="Standalone initial meter data"
                            statusBreakdown={meterBreakdown}
                        />
                    </div>

                    {/* Content Table Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                        <div className="p-5 w-full bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl shadow-md border-b space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-lg font-bold text-gray-800">Filter devices by location and source</h2>
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 w-full">
                                {/* Desktop Search & Filters - Hidden on small screens */}
                                <div className="hidden md:flex flex-col md:flex-row items-stretch md:items-end gap-4 w-full">
                                    {/* Search */}
                                    <div className="relative flex-1 group">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Search device or user...</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search device name, ID or user..."
                                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none h-10"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Location Filter */}
                                    <div className="relative w-full md:w-64" ref={locationFilterRef}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsLocationFilterOpen(!isLocationFilterOpen)}
                                                className="w-full flex items-center justify-between px-3 h-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors"
                                            >
                                                <span className="truncate">{selectedLocation}</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isLocationFilterOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isLocationFilterOpen && (
                                                <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                                    {locationOptions.map(loc => (
                                                        <button
                                                            key={loc}
                                                            onClick={() => { setSelectedLocation(loc); setIsLocationFilterOpen(false); }}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                                        >
                                                            {loc}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Source Filter */}
                                    <div className="relative w-full md:w-64" ref={sourceFilterRef}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Source</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsSourceFilterOpen(!isSourceFilterOpen)}
                                                className="w-full flex items-center justify-between px-3 h-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors"
                                            >
                                                <span className="truncate">{selectedSource}</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isSourceFilterOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isSourceFilterOpen && (
                                                <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                                    {sourceOptions.map(src => (
                                                        <button
                                                            key={src}
                                                            onClick={() => { setSelectedSource(src); setIsSourceFilterOpen(false); }}
                                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                                        >
                                                            {src}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Search & Filter Button - Visible only on small screens */}
                                <div className="md:hidden flex items-center gap-3 w-full">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm h-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsFilterPanelOpen(true)}
                                        className="flex items-center gap-2 px-4 h-10 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-lg"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filter
                                    </button>
                                </div>

                                {/* Mobile Filter Panel Overlay */}
                                {isFilterPanelOpen && (
                                    <div className="fixed inset-0 z-[100] md:hidden">
                                        <div
                                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                            onClick={() => setIsFilterPanelOpen(false)}
                                        />
                                        <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col p-6">
                                            <div className="flex items-center justify-between mb-8">
                                                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                                                <button
                                                    onClick={() => setIsFilterPanelOpen(false)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <X className="w-6 h-6 text-gray-500" />
                                                </button>
                                            </div>

                                            <div className="space-y-6 flex-1">
                                                {/* Mobile Search input */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Search</label>
                                                    <div className="relative">
                                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search device, ID or user..."
                                                            className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Mobile Location Select */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Location</label>
                                                    <select
                                                        className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
                                                        value={selectedLocation}
                                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                                    >
                                                        {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                                    </select>
                                                </div>

                                                {/* Mobile Source Select */}
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Source</label>
                                                    <select
                                                        className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
                                                        value={selectedSource}
                                                        onChange={(e) => setSelectedSource(e.target.value)}
                                                    >
                                                        {sourceOptions.map(src => <option key={src} value={src}>{src}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLocation("All Locations");
                                                        setSelectedSource("All Sources");
                                                    }}
                                                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={() => setIsFilterPanelOpen(false)}
                                                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                                                >
                                                    Apply Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 border-b">Device Info</th>
                                        <th className="px-6 py-4 border-b">Location</th>
                                        <th className="px-6 py-4 border-b">Source</th>
                                        <th className="px-6 py-4 border-b">Status</th>
                                        <th className="px-6 py-4 border-b">Managed By</th>
                                        {isAdmin && <th className="px-6 py-4 border-b text-center">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDevices.length > 0 ? (
                                        filteredDevices.map(device => {
                                            // Derive the assigned user initial letter mapped color box
                                            const initial = device.user ? device.user.charAt(0).toUpperCase() : '?';
                                            return (
                                                <tr key={`${device._itemType}-${device.id}`} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-800 text-sm">{device.name || device.deviceName || 'Unnamed Asset'}</span>
                                                            <span className="text-xs text-gray-500 font-mono mt-0.5">{device.deviceId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                        {device.location || device.meterLocation || device.city || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                                                        {device.meterType || device.type || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${device.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                            }`}>
                                                            {device.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                                {initial}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-800">{device.user}</span>
                                                        </div>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => openDetailsModal(device)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditItem(device)}
                                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteItem(device)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                No devices match the applied filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Modals */}
                {detailsModalOpen && selectedDetailItem && (
                    <DeviceDetailsModal
                        isOpen={detailsModalOpen}
                        onClose={() => {
                            setDetailsModalOpen(false);
                            setSelectedDetailItem(null);
                        }}
                        item={selectedDetailItem}
                        type={selectedDetailItem._itemType}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                    />
                )}

                {isModalOpen && (
                    editingDevice?.recordType === 'meter' ? (
                        <CreateMeterModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleSaveItem}
                            mode={modalMode}
                            initialData={editingDevice || {}}
                        />
                    ) : (
                        <CreateDeviceModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={handleSaveItem}
                            mode={modalMode}
                            initialData={editingDevice || {}}
                        />
                    )
                )}
            </main>
        </div>
    );
}
