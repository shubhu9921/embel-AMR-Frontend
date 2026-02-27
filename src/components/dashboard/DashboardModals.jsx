import React from 'react';
import { X, Cpu, Gauge, MapPin, Eye, AlertTriangle, Users, CheckCircle, Activity, Filter } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LocationDetailsModal } from "../modals/LocationDetailsModal";
import { sites } from "../../data/mockData";
import { getStatusBgColor } from "../../utils/resourceUtils";

export const DashboardModals = ({
    modalState,
    toggleModal,
    selectedLocation,
    setSelectedLocation,
    selectedUserDevice,
    setSelectedUserDevice,
    selectedUserMeter,
    setSelectedUserMeter,
    userFilters,
    setUserFilters,
    inactiveCounts,
    setActivePage,
    userDevicesList = [],
    userMetersList = []
}) => {
    const { map, location, userDevices, userMeters, userLocations, deviceDetails, meterDetails, issues } = modalState;

    // Derive locations from real assigned data
    const derivedLocations = React.useMemo(() => {
        const locMap = new Map();

        userDevicesList.forEach(d => {
            const locName = d.location || 'Unknown';
            if (!locMap.has(locName)) {
                locMap.set(locName, { id: locName, name: locName, devices: [], meters: [] });
            }
            locMap.get(locName).devices.push({
                name: d.deviceName || d.name,
                source: d.meterType || d.source,
                status: d.status
            });
        });

        userMetersList.forEach(m => {
            const locName = m.location || 'Unknown';
            if (!locMap.has(locName)) {
                locMap.set(locName, { id: locName, name: locName, devices: [], meters: [] });
            }
            locMap.get(locName).meters.push({
                name: m.deviceName || m.name,
                reading: m.reading,
                status: m.status
            });
        });

        return Array.from(locMap.values());
    }, [userDevicesList, userMetersList]);

    return (
        <>
            {/* -------------------- ADMIN MAP MODAL -------------------- */}
            {map && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Global Site Locations</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Live operational status map</p>
                            </div>
                            <button onClick={() => toggleModal('map', false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-white relative">
                            <MapContainer center={[21.7679, 78.8718]} zoom={5} style={{ height: "100%", width: "100%" }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                {sites.map(site => (
                                    <Marker key={site.id} position={site.location}>
                                        <Popup>
                                            <div className="p-2 min-w-[150px]">
                                                <h3 className="font-bold text-gray-900 mb-1">{site.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${site.status === 'Active' ? 'bg-green-500' : site.status === 'Inactive' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                    <span className="text-sm text-gray-600 font-medium">{site.status}</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- LOCATION DETAILS MODAL -------------------- */}
            {location && <LocationDetailsModal onClose={() => toggleModal('location', false)} />}

            {/* -------------------- DEVICE DETAILS MODAL -------------------- */}
            {deviceDetails && selectedUserDevice && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUserDevice.name}</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Device Details & Parameters</p>
                            </div>
                            <button onClick={() => { toggleModal('deviceDetails', false); toggleModal('userDevices', true); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getStatusBgColor(selectedUserDevice.status)}`}>
                                        {selectedUserDevice.status}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
                                    <p className="font-semibold text-gray-900">{selectedUserDevice.source}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Location</p>
                                    <p className="font-semibold text-gray-900">{selectedUserDevice.location}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Parameters</p>
                                    <p className="font-semibold text-gray-900">{selectedUserDevice.params}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Activity size={16} className="text-blue-500" />
                                    Simulated Telemetry
                                </h3>
                                <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl font-mono text-sm space-y-3 shadow-inner">
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-gray-400">Current:</span>
                                        <span className="text-emerald-400 font-bold text-lg">4.2A</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-gray-400">Voltage:</span>
                                        <span className="text-amber-400 font-bold text-lg">230.1V</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                        <span className="text-gray-400">Power Factor:</span>
                                        <span className="text-blue-400 font-bold text-lg">0.98</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-700 pt-3 mt-2 text-xs">
                                        <span className="text-slate-500">Last Update:</span>
                                        <span className="text-slate-400 italic">Just now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- METER DETAILS MODAL -------------------- */}
            {meterDetails && selectedUserMeter && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUserMeter.name}</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Meter Readings & Status</p>
                            </div>
                            <button onClick={() => { toggleModal('meterDetails', false); toggleModal('userMeters', true); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getStatusBgColor(selectedUserMeter.status)}`}>
                                        {selectedUserMeter.status}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
                                    <p className="font-semibold text-gray-900">{selectedUserMeter.source}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Location</p>
                                    <p className="font-semibold text-gray-900">{selectedUserMeter.location}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Last Sync</p>
                                    <p className="font-semibold text-gray-900">Just now</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Gauge size={16} className="text-indigo-500" />
                                    Current Reading
                                </h3>
                                <div className="bg-indigo-50 text-indigo-900 p-8 rounded-[32px] flex flex-col items-center justify-center border border-indigo-100 shadow-sm">
                                    <span className="text-5xl font-black font-mono tracking-tighter mb-2">{selectedUserMeter.reading}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Kilowatt Hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- USER DEVICES MODAL -------------------- */}
            {userDevices && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Assigned Devices</h2>
                                <p className="text-sm text-gray-500 font-bold mt-1">Detailed list of hardware assigned to you</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                    <Filter size={16} className="text-gray-400" />
                                    <select
                                        value={userFilters.device}
                                        onChange={(e) => setUserFilters(prev => ({ ...prev, device: e.target.value }))}
                                        className="bg-transparent text-sm font-black text-gray-700 border-none focus:ring-0 cursor-pointer min-w-[120px]"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deactivated">Deactivated</option>
                                    </select>
                                </div>
                                <button onClick={() => toggleModal('userDevices', false)} className="p-2.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all active:scale-90">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-auto p-8 custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                    <tr>
                                        <th className="pb-4 px-4 font-black">Device Name</th>
                                        <th className="pb-4 px-4 font-black">Type/Source</th>
                                        <th className="pb-4 px-4 font-black">Parameters</th>
                                        <th className="pb-4 px-4 font-black">Status</th>
                                        <th className="pb-4 px-4 font-black">Location</th>
                                        <th className="pb-4 px-4 text-center font-black">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold divide-y divide-gray-50">
                                    {userDevicesList
                                        .filter(d => userFilters.device === 'All' || d.status === userFilters.device)
                                        .map((device, i) => (
                                            <tr key={i} className="group transition-all hover:bg-gray-50/80">
                                                <td className="py-5 px-4 font-black text-gray-900">{device.deviceName || device.name}</td>
                                                <td className="py-5 px-4">
                                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{device.meterType || device.source}</span>
                                                </td>
                                                <td className="py-5 px-4 text-gray-500 font-medium">{device.parameters || device.params}</td>
                                                <td className="py-5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBgColor(device.status)}`}>
                                                        {device.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4 font-medium text-gray-500">{device.location}</td>
                                                <td className="py-5 px-4 text-center">
                                                    <button
                                                        onClick={() => { setSelectedUserDevice(device); toggleModal('userDevices', false); toggleModal('deviceDetails', true); }}
                                                        className="p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all active:scale-90"
                                                        title="View Details"
                                                    >
                                                        <Activity size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- USER METERS MODAL -------------------- */}
            {userMeters && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Assigned Meters</h2>
                                <p className="text-sm text-gray-500 font-bold mt-1">Detailed list of meters under your supervision</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                    <Filter size={16} className="text-gray-400" />
                                    <select
                                        value={userFilters.meter}
                                        onChange={(e) => setUserFilters(prev => ({ ...prev, meter: e.target.value }))}
                                        className="bg-transparent text-sm font-black text-gray-700 border-none focus:ring-0 cursor-pointer min-w-[120px]"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deactivated">Deactivated</option>
                                    </select>
                                </div>
                                <button onClick={() => toggleModal('userMeters', false)} className="p-2.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all active:scale-90"><X size={24} /></button>
                            </div>
                        </div>
                        <div className="overflow-auto p-8 custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                                    <tr>
                                        <th className="pb-4 px-4 font-black">Meter Name</th>
                                        <th className="pb-4 px-4 font-black">Type/Source</th>
                                        <th className="pb-4 px-4 font-black">Current Reading</th>
                                        <th className="pb-4 px-4 font-black">Status</th>
                                        <th className="pb-4 px-4 font-black">Location</th>
                                        <th className="pb-4 px-4 text-center font-black">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold divide-y divide-gray-50">
                                    {userMetersList
                                        .filter(m => userFilters.meter === 'All' || m.status === userFilters.meter)
                                        .map((meter, i) => (
                                            <tr key={i} className="group transition-all hover:bg-gray-50/80">
                                                <td className="py-5 px-4 font-black text-gray-900">{meter.deviceName || meter.name}</td>
                                                <td className="py-5 px-4">
                                                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">{meter.meterType || meter.source}</span>
                                                </td>
                                                <td className="py-5 px-4 text-gray-900 font-mono text-base">{meter.reading}</td>
                                                <td className="py-5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBgColor(meter.status)}`}>
                                                        {meter.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4 font-medium text-gray-500">{meter.location}</td>
                                                <td className="py-5 px-4 text-center">
                                                    <button
                                                        onClick={() => { setSelectedUserMeter(meter); toggleModal('userMeters', false); toggleModal('meterDetails', true); }}
                                                        className="p-2 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl transition-all active:scale-90"
                                                        title="View Details"
                                                    >
                                                        <Gauge size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- USER LOCATIONS MODAL -------------------- */}
            {userLocations && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-6xl max-h-[85vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Assigned Locations</h2>
                                <p className="text-sm text-gray-500 font-bold mt-1">Select a location to view assigned equipment</p>
                            </div>
                            <button onClick={() => { toggleModal('userLocations', false); setSelectedLocation(null); }} className="p-2.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all active:scale-90"><X size={24} /></button>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            <div className="w-1/3 border-r border-gray-100 overflow-y-auto bg-gray-50/30">
                                {derivedLocations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setSelectedLocation(loc)}
                                        className={`w-full text-left p-6 border-b border-gray-100 transition-all hover:bg-white flex items-center justify-between group ${selectedLocation?.id === loc.id ? 'bg-white shadow-lg shadow-blue-500/5 z-10 border-l-8 border-l-blue-600' : 'border-l-8 border-l-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <div>
                                            <h3 className={`text-lg font-black ${selectedLocation?.id === loc.id ? 'text-blue-600' : 'text-gray-800'}`}>{loc.name}</h3>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Cpu size={12} /> {loc.devices.length}</span>
                                                <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Gauge size={12} /> {loc.meters.length}</span>
                                            </div>
                                        </div>
                                        <MapPin size={22} className={`${selectedLocation?.id === loc.id ? 'text-blue-500 animate-bounce' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </div>
                            <div className="w-2/3 overflow-y-auto p-8 bg-white custom-scrollbar">
                                {selectedLocation ? (
                                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Cpu size={22} /></div>
                                                Devices at {selectedLocation.name}
                                            </h3>
                                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <tr><th className="py-4 px-6">Name</th><th className="py-4 px-6">Source</th><th className="py-4 px-6">Status</th></tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50 font-bold text-sm">
                                                        {selectedLocation.devices.map((d, i) => (
                                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="py-4 px-6 text-gray-900">{d.name}</td>
                                                                <td className="py-4 px-6 text-gray-600"><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px]">{d.source}</span></td>
                                                                <td className="py-4 px-6">
                                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${d.status === 'Active' ? 'text-emerald-600' : d.status === 'Inactive' ? 'text-amber-600' : 'text-red-600'}`}>
                                                                        {d.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><Gauge size={22} /></div>
                                                Meters at {selectedLocation.name}
                                            </h3>
                                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <tr><th className="py-4 px-6">Name</th><th className="py-4 px-6">Reading</th><th className="py-4 px-6">Status</th></tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50 font-bold text-sm">
                                                        {selectedLocation.meters.map((m, i) => (
                                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                                <td className="py-4 px-6 text-gray-900">{m.name}</td>
                                                                <td className="py-4 px-6 font-mono text-gray-600">{m.reading}</td>
                                                                <td className="py-4 px-6">
                                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${m.status === 'Active' ? 'text-emerald-600' : m.status === 'Inactive' ? 'text-amber-600' : 'text-red-600'}`}>
                                                                        {m.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                            <MapPin size={48} className="opacity-20" />
                                        </div>
                                        <p className="text-xl font-black tracking-tight text-gray-300">Select a location to view details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- SYSTEM ISSUES MODAL -------------------- */}
            {issues && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><AlertTriangle className="text-red-500" /> System Issues & Alerts</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Items requiring attention ({inactiveCounts.devices.length + inactiveCounts.meters.length + inactiveCounts.users.length})</p>
                            </div>
                            <button onClick={() => toggleModal('issues', false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            {inactiveCounts.devices.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Cpu size={18} className="text-gray-400" /> Devices ({inactiveCounts.devices.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inactiveCounts.devices.map(d => (
                                            <div key={d.id} onClick={() => { sessionStorage.setItem('devicesPageTab', 'devices'); setActivePage('Devices'); toggleModal('issues', false); }} className="p-3 border border-red-100 bg-red-50/50 rounded-xl flex justify-between items-center group hover:bg-red-50 transition-colors cursor-pointer text-sm">
                                                <div><p className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">{d.name}</p><p className="text-xs text-gray-500 mt-0.5">{d.deviceId}</p></div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${d.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {inactiveCounts.meters.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Gauge size={18} className="text-gray-400" /> Meters ({inactiveCounts.meters.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inactiveCounts.meters.map(m => (
                                            <div key={m.id} onClick={() => { sessionStorage.setItem('devicesPageTab', 'meters'); setActivePage('Devices'); toggleModal('issues', false); }} className="p-3 border border-orange-100 bg-orange-50/50 rounded-xl flex justify-between items-center group hover:bg-orange-50 transition-colors cursor-pointer text-sm">
                                                <div><p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">{m.name}</p><p className="text-xs text-gray-500 mt-0.5">{m.location}</p></div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${m.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {inactiveCounts.users.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Users size={18} className="text-gray-400" /> Users ({inactiveCounts.users.length})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inactiveCounts.users.map(u => (
                                            <div key={u.id} onClick={() => { setActivePage('Users'); toggleModal('issues', false); }} className="p-3 border border-gray-200 bg-gray-50 rounded-xl flex justify-between items-center group hover:bg-gray-100 transition-colors cursor-pointer text-sm">
                                                <div><p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{u.firstName} {u.lastName}</p><p className="text-xs text-gray-500 mt-0.5">{u.email}</p></div>
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-200 text-gray-600">{u.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
