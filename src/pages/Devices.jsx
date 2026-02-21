import React, { useState, useEffect, useRef, useMemo } from "react";
import DeviceModal from "../components/modals/CreateDeviceModal";
import {
  Router,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Cpu,
  Gauge,
  Activity,
  AlertTriangle
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { initialDevicesData, initialMetersData } from "../data/mockData";
import { useTable } from "../hooks/useTable";

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState('devices');
  const [devicesData, setDevicesData] = useState(initialDevicesData);
  const [metersData, setMetersData] = useState(initialMetersData);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingDevice, setEditingDevice] = useState(null);
  const filterRef = useRef(null);

  // Initialize tab from sessionStorage
  useEffect(() => {
    const savedTab = sessionStorage.getItem('devicesPageTab');
    if (savedTab) setActiveTab(savedTab);
  }, [setActiveTab]);

  // Update sessionStorage when tab changes
  useEffect(() => {
    sessionStorage.setItem('devicesPageTab', activeTab);
  }, [activeTab]);

  const currentData = useMemo(() =>
    activeTab === 'devices' ? devicesData : metersData,
    [activeTab, devicesData, metersData]);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData: currentItems,
    allFilteredData: filteredData,
    handlePrevPage,
    handleNextPage
  } = useTable(currentData, {
    searchFields: ['name', 'deviceId', 'user', 'location'],
    initialFilters: { status: 'All' },
    pageSize: 10
  });

  // Reset page, search, status on tab change
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setFilters('status', 'All');
  }, [activeTab, setCurrentPage, setSearchTerm, setFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsFilterOpen]);

  const handleCreateDevice = () => {
    setModalMode('create');
    setEditingDevice(null);
    setIsModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setModalMode('edit');
    setEditingDevice({
      ...device,
      techType: device.type,
      deviceEnable: device.status === 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSaveDevice = (formData) => {
    if (activeTab === 'devices') {
      if (modalMode === 'create') {
        const newDevice = {
          id: devicesData.length + 1,
          admin: formData.admin,
          user: formData.user,
          deviceId: formData.deviceId,
          name: formData.deviceName,
          type: formData.techType,
          mac: formData.macId,
          status: formData.deviceEnable ? "Active" : "Inactive"
        };
        setDevicesData([...devicesData, newDevice]);
      } else {
        setDevicesData(devicesData.map(d =>
          d.id === editingDevice.id ? {
            ...d,
            admin: formData.admin,
            user: formData.user,
            deviceId: formData.deviceId,
            name: formData.deviceName,
            type: formData.techType,
            mac: formData.macId,
            status: formData.deviceEnable ? "Active" : "Inactive"
          } : d
        ));
      }
    }
    setIsModalOpen(false);
  };

  const activeCount = currentData.filter((d) => d.status === "Active").length;
  const inactiveCount = currentData.filter((d) => d.status === "Inactive").length;
  const maintenanceCount = currentData.filter((d) => d.status === "Deactivated").length;
  const startIndex = (currentPage - 1) * 10;

  return (
    <div className="w-full min-h-screen p-6 md:p-8 font-sans">
      {/* Top Header */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${activeTab === 'devices' ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600'} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}>
              {activeTab === 'devices' ? <Cpu size={24} /> : <Gauge size={24} />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {activeTab === 'devices' ? 'Device Management' : 'Meter Management'}
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Manage {activeTab === 'devices' ? 'IoT hardware & connections' : 'utility meter readings'}
              </p>
            </div>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('devices')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'devices' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Cpu size={16} /> Devices
            </button>
            <button
              onClick={() => setActiveTab('meters')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'meters' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Gauge size={16} /> Meters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard title={`Total ${activeTab === 'devices' ? 'Devices' : 'Meters'}`} value={currentData.length.toString().padStart(2, '0')} icon={activeTab === 'devices' ? <Cpu className="w-4 h-4" /> : <Gauge className="w-4 h-4" />} color="blue" description={`Registered ${activeTab}`} compact />
          <StatCard title="Active" value={activeCount.toString().padStart(2, '0')} icon={<Activity className="w-4 h-4" />} color="green" description="Online & Reporting" compact />
          <StatCard title="Inactive" value={inactiveCount.toString().padStart(2, '0')} icon={<AlertTriangle className="w-4 h-4" />} color="orange" description="No recent signal" compact />
          <StatCard title="Maintenance" value={maintenanceCount.toString().padStart(2, '0')} icon={<Router className="w-4 h-4" />} color="red" description="Scheduled service" compact />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl shadow-md shadow-orange-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 transition-all shadow-md shadow-orange-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[160px]" ref={filterRef}>
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${isFilterOpen ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}>
                  <span className="truncate">{filters.status === 'All' ? 'All Status' : filters.status}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                  {['All', 'Active', 'Inactive', 'Deactivated'].map((option) => (
                    <button key={option} onClick={() => { setFilters('status', option); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${filters.status === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}>{option === 'All' ? 'All Status' : option}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleCreateDevice} className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">
                <Plus className="w-5 h-5 stroke-[2.5]" /> Add {activeTab === 'devices' ? 'Device' : 'Meter'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-100">{activeTab === 'devices' ? 'Device' : 'Meter'}</th>
                  <th className="px-6 py-4 border-b border-gray-100">Type</th>
                  <th className="px-6 py-4 border-b border-gray-100">{activeTab === 'devices' ? 'ID' : 'Location'}</th>
                  {activeTab === 'devices' && <th className="px-6 py-4 border-b border-gray-100">MAC</th>}
                  {activeTab === 'meters' && <th className="px-6 py-4 border-b border-gray-100">Reading</th>}
                  <th className="px-6 py-4 border-b border-gray-100">User</th>
                  <th className="px-6 py-4 border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-orange-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${activeTab === 'devices' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {activeTab === 'devices' ? <Cpu size={18} /> : <Gauge size={18} />}
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 text-sm block">{item.name}</span>
                            <span className="text-xs text-gray-400 font-medium">ID: {item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-gray-100 border">{item.type}</span></td>
                      <td className="px-6 py-4 text-sm font-mono">{activeTab === 'devices' ? item.deviceId : item.location}</td>
                      {activeTab === 'devices' && <td className="px-6 py-4 text-sm font-mono text-gray-500">{item.mac}</td>}
                      {activeTab === 'meters' && <td className="px-6 py-4 text-sm font-bold">{item.reading}</td>}
                      <td className="px-6 py-4"><span className="text-sm font-medium">{item.user}</span></td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                          {item.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditDevice(item)} className="p-2 bg-white border rounded-lg hover:text-[#ff6e00] transition-all"><Edit size={16} /></button>
                          <button onClick={() => { if (window.confirm(`Delete ${item.name}?`)) alert("Soon"); }} className="p-2 bg-white border rounded-lg hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No {activeTab} found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between rounded-b-2xl">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + 10, filteredData.length)}</span> of <span className="font-bold text-gray-900">{filteredData.length}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1.5 border bg-white rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all">Previous</button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 border bg-white rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>

      <DeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveDevice} mode={modalMode} initialData={editingDevice || {}} />
    </div>
  );
}
