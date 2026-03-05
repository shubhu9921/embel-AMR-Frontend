import React, { useState, useEffect, useRef, useMemo } from "react";
import CreateDeviceModal from "../components/modals/CreateDeviceModal";
import CreateMeterModal from "../components/modals/CreateMeterModal";
import DeviceDetailsModal from "../components/modals/DeviceDetailsModal";
import { DeviceCard } from "../components/dashboard/DeviceCard";
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
  AlertTriangle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Monitor, // Added Monitor icon
  Droplet, // Added Droplet icon
  Sun,     // Added Sun icon
  Flame    // Added Flame icon
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { useTable } from "../hooks/useTable";
import { useData } from "../context/DataContext";

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState('devices');
  const {
    devices: devicesData,
    meters: metersData,
    isLoading,
    addDevice,
    updateDevice,
    deleteDevice,
    addMeter,
    updateMeter,
    deleteMeter,
    refreshData
  } = useData();

  // Renamed selectedSource to sourceFilter for clarity and consistency with instruction
  const [sourceFilter, setSourceFilter] = useState('All');

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

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

  const currentData = useMemo(() => {
    let data = activeTab === 'devices' ? devicesData : metersData;
    if (sourceFilter !== 'All') { // Use sourceFilter here
      data = data.filter(d => d.meterType?.toLowerCase() === sourceFilter.toLowerCase());
    }
    return data;
  }, [activeTab, devicesData, metersData, sourceFilter]); // Dependency on sourceFilter

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

  // Reset page, search, status on tab change or source change
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setFilters('status', 'All');
  }, [activeTab, sourceFilter, setCurrentPage, setSearchTerm, setFilters]); // Dependency on sourceFilter

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
    setEditingDevice({ recordType: activeTab === 'meters' ? 'meter' : 'device' });
    setIsModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setModalMode('edit');
    setEditingDevice({
      ...device,
      recordType: activeTab === 'meters' ? 'meter' : 'device',
      techType: device.type,
      macId: device.mac || device.macId,
      deviceName: device.name || device.deviceName,
      deviceId: device.deviceId,
      deviceEnable: device.status === 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEditMeter = (meter) => {
    setModalMode('edit');
    setEditingDevice({
      ...meter,
      recordType: 'meter',
      techType: meter.type || meter.meterType,
      macId: meter.mac || meter.macId,
      deviceName: meter.name || meter.meterName,
      deviceId: meter.meterId || meter.deviceId,
      deviceEnable: meter.status === 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSaveDevice = async (formData) => {
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

      // Clean up undefined values from payload so they don't overwrite good data with undefined
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
        // Clean baseItem from internal fields before merging
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
      setDetailsModalOpen(false); // Close details modal if open
      setSelectedDetailItem(null); // Clear selected item
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to Save: The item may have been deleted from the database. Refreshing data...");
      await refreshData();
    }
  };

  const handleDeleteDevice = async (item) => {
    const isMeter = activeTab === 'meters';
    if (window.confirm(`Are you sure you want to delete ${item.name || item.deviceId}?`)) {
      try {
        if (isMeter) {
          await deleteMeter(item.id);
        } else {
          await deleteDevice(item.id);
        }
        setDetailsModalOpen(false); // Close details modal if open
        setSelectedDetailItem(null); // Clear selected item
      } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete.");
      }
    }
  };

  const openDetailsModal = (item) => {
    setSelectedDetailItem(item);
    setDetailsModalOpen(true);
  };

  const allItems = useMemo(() => {
    // Treat everything from getDevices() as a device and everything from getInitialMeters() as a meter
    const devs = devicesData.map(d => ({ ...d, _itemType: 'device' }));
    const mtrs = metersData.map(d => ({ ...d, _itemType: 'meter' }));
    return [...devs, ...mtrs];
  }, [devicesData, metersData]);

  const getStats = (sourceType) => {
    // Only aggregate data for the current active tab (devices or meters)
    const baseList = activeTab === 'devices'
      ? allItems.filter(d => d._itemType === 'device')
      : allItems.filter(d => d._itemType === 'meter');

    const dataList = sourceType ? baseList.filter(d => d.meterType?.toLowerCase() === sourceType.toLowerCase()) : baseList;
    const total = dataList.length;
    const active = dataList.filter(d => d.status?.toLowerCase() === 'active').length;
    const inactive = dataList.filter(d => d.status?.toLowerCase() === 'inactive').length;
    const deactive = dataList.filter(d => ['deactive', 'deactivated'].includes(d.status?.toLowerCase())).length;

    return {
      value: total,
      subValue: activeTab === 'devices' ? `Active: ${active}` : `Meters: ${total}`,
      statusBreakdown: [
        { label: 'Active', value: active, color: 'text-green-500' },
        { label: 'Inactive', value: inactive, color: 'text-orange-500' },
        { label: 'Deactive', value: deactive, color: 'text-red-500' }
      ]
    };
  };

  // Specific counts for sub-headings or metadata
  const deviceCount = devicesData.length;
  const meterCount = metersData.length;

  const startIndex = (currentPage - 1) * 10;

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full min-h-screen p-4 md:p-6 font-sans pt-6 md:pt-8">
        {/* Top Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
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

            <div className="flex items-center gap-4">
              <select
                value={sourceFilter} // Use sourceFilter here
                onChange={(e) => setSourceFilter(e.target.value)} // Update sourceFilter
                className="p-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white outline-none focus:ring-2 focus:ring-[#ff6e00]/20 min-w-[140px]"
              >
                <option value="All">All Sources</option>
                <option value="Water">Water Source</option>
                <option value="Solar">Solar Source</option>
                <option value="Gas">Gas Source</option>
                <option value="Energy">Energy Source</option>
              </select>

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
        </div>


        <div className="space-y-6 w-full mt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Updated StatCards */}
            <StatCard
              title={activeTab === 'devices' ? "Total Devices" : "Total Meters"}
              value={(activeTab === 'devices' ? devicesData.length : metersData.length).toString().padStart(2, '0')}
              icon={<div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Monitor size={20} /></div>}
              description={activeTab === 'devices' ? "Connected monitoring units" : "Utility reading units"}
              color="blue"
              onClick={() => { setSourceFilter('All'); setFilters('status', 'All'); setSearchTerm(''); }}
              statusBreakdown={[
                { label: 'Active', value: (activeTab === 'devices' ? devicesData.filter(d => d.status === 'Active').length : metersData.filter(m => m.status === 'Active').length), color: 'text-emerald-500' },
                { label: 'Warning', value: (activeTab === 'devices' ? devicesData.filter(d => d.status === 'Warning').length : metersData.filter(m => m.status === 'Warning').length), color: 'text-amber-500' }
              ]}
            />
            <StatCard
              title="Water Source"
              value={(devicesData.filter(d => d.meterType === 'Water').length + metersData.filter(m => m.meterType === 'Water').length).toString().padStart(2, '0')}
              icon={<div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><Droplet size={20} /></div>}
              description="Water management assets"
              color="cyan"
              onClick={() => { setActiveTab('meters'); setSourceFilter('Water'); }}
              statusBreakdown={[
                { label: 'Meters', value: metersData.filter(m => m.meterType === 'Water').length, color: 'text-cyan-500' },
                { label: 'Devices', value: devicesData.filter(d => d.meterType === 'Water').length, color: 'text-blue-500' }
              ]}
            />
            <StatCard
              title="Solar Source"
              value={(devicesData.filter(d => d.meterType === 'Solar').length + metersData.filter(m => m.meterType === 'Solar').length).toString().padStart(2, '0')}
              icon={<div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Sun size={20} /></div>}
              description="Solar energy monitoring"
              color="amber"
              onClick={() => { setActiveTab('meters'); setSourceFilter('Solar'); }}
              statusBreakdown={[
                { label: 'Inverters', value: metersData.filter(m => m.meterType === 'Solar').length, color: 'text-amber-500' },
                { label: 'Sensors', value: devicesData.filter(d => d.meterType === 'Solar').length, color: 'text-orange-500' }
              ]}
            />
            <StatCard
              title="Gas Source"
              value={(devicesData.filter(d => d.meterType === 'Gas').length + metersData.filter(m => m.meterType === 'Gas').length).toString().padStart(2, '0')}
              icon={<div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Flame size={20} /></div>}
              description="Gas flow monitoring"
              color="orange"
              onClick={() => { setActiveTab('meters'); setSourceFilter('Gas'); }}
              statusBreakdown={[
                { label: 'Meters', value: metersData.filter(m => m.meterType === 'Gas').length, color: 'text-orange-500' },
                { label: 'Warning', value: devicesData.filter(d => d.meterType === 'Gas' && d.status === 'Warning').length, color: 'text-red-500' }
              ]}
            />
            <StatCard title="Energy Source" value={(devicesData.filter(d => d.meterType === 'Energy').length + metersData.filter(m => m.meterType === 'Energy').length).toString().padStart(2, '0')} subValue={`Meters: ${metersData.filter(m => m.meterType === 'Energy').length}`} statusBreakdown={[{ label: 'Meters', value: metersData.filter(m => m.meterType === 'Energy').length, color: 'text-green-500' }]} icon={<Activity className="w-4 h-4" />} color="green" compact onClick={() => { setActiveTab('meters'); setSourceFilter('Energy'); }} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-[84px] z-20 rounded-t-2xl shadow-md shadow-orange-100">
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
                    {['All', 'Active', 'Inactive', 'Warning', 'Deactivated'].map((option) => (
                      <button key={option} onClick={() => { setFilters('status', option); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${filters.status === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}>{option === 'All' ? 'All Status' : option}</button>
                    ))}
                  </div>
                </div>

                <button onClick={handleCreateDevice} className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">
                  <Plus className="w-5 h-5 stroke-[2.5]" /> Add {activeTab === 'devices' ? 'Device' : 'Meter'}
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-50/30 rounded-b-2xl min-h-[500px]">
              {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentItems.map((item) => (
                    <div key={item.id} onClick={() => openDetailsModal(item)} className="cursor-pointer transition-transform hover:-translate-y-1">
                      <DeviceCard
                        deviceName={item.name || item.deviceName}
                        deviceId={item.deviceId}
                        location={item.city || item.location || item.meterLocation}
                        status={item.status}
                        currentFlow={item.admin}
                        flowUnit="Admin"
                        dailyConsumption={item.user}
                        color={activeTab === 'devices' ? 'indigo' : (item.meterType?.toUpperCase() === 'WATER' ? 'blue' : item.meterType?.toUpperCase() === 'GAS' ? 'orange' : item.meterType?.toUpperCase() === 'SOLAR' ? 'amber' : 'emerald')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                  <AlertCircle size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-lg text-gray-500">No {activeTab} found</p>
                  <p className="text-sm">Try adjusting your filters or add a new {activeTab === 'devices' ? 'device' : 'meter'}</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <button disabled={currentPage === 1} onClick={handlePrevPage} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-600"><ChevronLeft size={20} /></button>
                    <span className="text-sm font-bold text-gray-600 min-w-[100px] text-center">Page {currentPage} of {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={handleNextPage} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-600"><ChevronRight size={20} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {detailsModalOpen && selectedDetailItem && (
          <DeviceDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedDetailItem(null);
            }}
            item={selectedDetailItem}
            type={activeTab === 'devices' ? 'device' : 'meter'}
            onEdit={activeTab === 'devices' ? handleEditDevice : handleEditMeter}
            onDelete={handleDeleteDevice}
          />
        )}
        {activeTab === 'devices' ? (
          <CreateDeviceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveDevice} mode={modalMode} initialData={editingDevice || {}} />
        ) : (
          <CreateMeterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveDevice} mode={modalMode} initialData={editingDevice || {}} />
        )}
      </main>
    </div>
  );
}

