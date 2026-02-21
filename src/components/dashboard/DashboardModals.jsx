import React from 'react';
import { X, Cpu, Gauge, MapPin, Eye, AlertTriangle, Users, CheckCircle, Activity, Filter } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LocationDetailsModal } from "../modals/LocationDetailsModal";
import { sites, userDataDetailed } from "../../data/mockData";
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
    setActivePage
}) => {
    const { map, location, userDevices, userMeters, userLocations, deviceDetails, meterDetails, issues } = modalState;

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
                                    Live Telemetry
                                </h3>
                                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm space-y-2">
                                    <div className="flex justify-between"><span>Current:</span><span className="text-emerald-400">4.2A</span></div>
                                    <div className="flex justify-between"><span>Voltage:</span><span className="text-amber-400">230.1V</span></div>
                                    <div className="flex justify-between"><span>Power Factor:</span><span className="text-blue-400">0.98</span></div>
                                    <div className="flex justify-between border-t border-slate-700 pt-2 mt-2"><span>Last Update:</span><span className="text-slate-500">Just now</span></div>
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
                                <div className="bg-indigo-50 text-indigo-900 p-6 rounded-2xl flex flex-col items-center justify-center border border-indigo-100">
                                    <span className="text-4xl font-bold font-mono tracking-tighter">{selectedUserMeter.reading}</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-1">Kilowatt Hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- USER DEVICES MODAL -------------------- */}
            {userDevices && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Devices</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Detailed list of hardware assigned to you</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <Filter size={16} className="text-gray-400 ml-2" />
                                    <select
                                        value={userFilters.device}
                                        onChange={(e) => setUserFilters(prev => ({ ...prev, device: e.target.value }))}
                                        className="bg-transparent text-sm font-medium text-gray-700 border-none focus:ring-0 cursor-pointer py-1 pr-8 pl-1"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deactive">Deactive</option>
                                    </select>
                                </div>
                                <button onClick={() => toggleModal('userDevices', false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                            </div>
                        </div>
                        <div className="overflow-auto p-6">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 px-4">Device Name</th>
                                        <th className="py-3 px-4">Type/Source</th>
                                        <th className="py-3 px-4">Parameters</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Location</th>
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {userDataDetailed.devices
                                        .filter(d => userFilters.device === 'All' || d.status === userFilters.device)
                                        .map((device, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-gray-900">{device.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{device.source}</td>
                                                <td className="py-3 px-4 text-gray-600">{device.params}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getStatusBgColor(device.status)}`}>
                                                        {device.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-500">{device.location}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button onClick={() => { setSelectedUserDevice(device); toggleModal('userDevices', false); toggleModal('deviceDetails', true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye size={18} />
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
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Meters</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Detailed list of meters under your supervision</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <Filter size={16} className="text-gray-400 ml-2" />
                                    <select
                                        value={userFilters.meter}
                                        onChange={(e) => setUserFilters(prev => ({ ...prev, meter: e.target.value }))}
                                        className="bg-transparent text-sm font-medium text-gray-700 border-none focus:ring-0 cursor-pointer py-1 pr-8 pl-1"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deactive">Deactive</option>
                                    </select>
                                </div>
                                <button onClick={() => toggleModal('userMeters', false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                            </div>
                        </div>
                        <div className="overflow-auto p-6">
                            <table className="w-full text-left border-collapse">
                                <thead className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 px-4">Meter Name</th>
                                        <th className="py-3 px-4">Type/Source</th>
                                        <th className="py-3 px-4">Current Reading</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Location</th>
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {userDataDetailed.meters
                                        .filter(m => userFilters.meter === 'All' || m.status === userFilters.meter)
                                        .map((meter, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-gray-900">{meter.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{meter.source}</td>
                                                <td className="py-3 px-4 text-gray-600 font-mono">{meter.reading}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getStatusBgColor(meter.status)}`}>
                                                        {meter.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-500">{meter.location}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button onClick={() => { setSelectedUserMeter(meter); toggleModal('userMeters', false); toggleModal('meterDetails', true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye size={18} />
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
                    <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Locations</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Select a location to view assigned equipment</p>
                            </div>
                            <button onClick={() => { toggleModal('userLocations', false); setSelectedLocation(null); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            <div className="w-1/3 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
                                {userDataDetailed.locations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setSelectedLocation(loc)}
                                        className={`w-full text-left p-4 border-b border-gray-100 transition-colors hover:bg-white flex items-center justify-between group ${selectedLocation?.id === loc.id ? 'bg-white shadow-sm border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div>
                                            <h3 className={`font-bold ${selectedLocation?.id === loc.id ? 'text-blue-600' : 'text-gray-800'}`}>{loc.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{loc.devices.length} Devices • {loc.meters.length} Meters</p>
                                        </div>
                                        <MapPin size={18} className={`${selectedLocation?.id === loc.id ? 'text-blue-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </div>
                            <div className="w-2/3 overflow-y-auto p-6 bg-white">
                                {selectedLocation ? (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Cpu className="text-blue-500" size={20} /> Devices at {selectedLocation.name}</h3>
                                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden text-sm">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-100/50 text-gray-500 font-bold uppercase text-xs"><tr><th className="py-2 px-4">Name</th><th className="py-2 px-4">Source</th><th className="py-2 px-4">Status</th></tr></thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedLocation.devices.map((d, i) => (
                                                            <tr key={i}><td className="py-2 px-4 font-medium text-gray-900">{d.name}</td><td className="py-2 px-4 text-gray-600">{d.source}</td><td className="py-2 px-4"><span className={`text-xs font-bold ${d.status === 'Active' ? 'text-emerald-600' : 'text-red-600'}`}>{d.status}</span></td></tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Gauge className="text-indigo-500" size={20} /> Meters at {selectedLocation.name}</h3>
                                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden text-sm">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-100/50 text-gray-500 font-bold uppercase text-xs"><tr><th className="py-2 px-4">Name</th><th className="py-2 px-4">Reading</th><th className="py-2 px-4">Status</th></tr></thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedLocation.meters.map((m, i) => (
                                                            <tr key={i}><td className="py-2 px-4 font-medium text-gray-900">{m.name}</td><td className="py-2 px-4 font-mono text-gray-600">{m.reading}</td><td className="py-2 px-4"><span className={`text-xs font-bold ${m.status === 'Active' ? 'text-emerald-600' : 'text-red-600'}`}>{m.status}</span></td></tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <MapPin size={48} className="mb-4 opacity-20" /><p className="text-lg font-medium">Select a location to view details</p>
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
