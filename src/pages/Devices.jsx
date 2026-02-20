import React, { useState, useEffect, useRef } from "react";
import DeviceModal from "../components/modals/CreateDeviceModal";
import {
  Router,
  Search,
  Plus,
  Download,
  Upload,
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

export default function DevicesPage() {
  const [activeTab, setActiveTab] = useState('devices');
  const [devicesData, setDevicesData] = useState(initialDevicesData);
  const [metersData, setMetersData] = useState(initialMetersData);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingDevice, setEditingDevice] = useState(null);
  const pageSize = 10;
  const filterRef = useRef(null);

  // Initialize tab from sessionStorage
  useEffect(() => {
    const savedTab = sessionStorage.getItem('devicesPageTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Update sessionStorage when tab changes
  useEffect(() => {
    sessionStorage.setItem('devicesPageTab', activeTab);
    // Reset filters and pagination on tab change
    setCurrentPage(1);
    setSearchTerm("");
    setStatusFilter("All");
  }, [activeTab]);

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

  // Filter Data
  const currentData = activeTab === 'devices' ? devicesData : metersData;

  const filteredData = currentData.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.deviceId && item.deviceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.user && item.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

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

          {/* Tab Switcher - Prominent in Header */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('devices')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'devices'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Cpu size={16} />
              Devices
            </button>
            <button
              onClick={() => setActiveTab('meters')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'meters'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Gauge size={16} />
              Meters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto space-y-6">

        {/* KPI Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title={`Total ${activeTab === 'devices' ? 'Devices' : 'Meters'}`}
            value={currentData.length.toString().padStart(2, '0')}
            icon={activeTab === 'devices' ? <Cpu className="w-4 h-4" /> : <Gauge className="w-4 h-4" />}
            color="blue"
            description={`Registered ${activeTab}`}
            compact
          />
          <StatCard
            title="Active"
            value={activeCount.toString().padStart(2, '0')}
            icon={<Activity className="w-4 h-4" />}
            color="green"
            description="Online & Reporting"
            compact
          />
          <StatCard
            title="Inactive"
            value={inactiveCount.toString().padStart(2, '0')}
            icon={<AlertTriangle className="w-4 h-4" />}
            color="orange"
            description="No recent signal"
            compact
          />
          <StatCard
            title="Maintenance"
            value={currentData.filter((d) => d.status === "Deactivated").length.toString().padStart(2, '0')}
            icon={<Router className="w-4 h-4" />}
            color="red"
            description="Scheduled service"
            compact
          />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">

          {/* Header Controls */}
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl shadow-md shadow-orange-100">
            {/* Left: Search */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-md shadow-orange-100 hover:shadow-orange-200 group-hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Actions & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Custom Filter Dropdown */}
              <div className="relative min-w-[160px]" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 ${isFilterOpen
                    ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="truncate">
                    {statusFilter === 'All' ? 'All Status' : statusFilter === 'Active' ? 'Active Only' : statusFilter}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                  {['All', 'Active', 'Inactive', 'Deactivated'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setStatusFilter(option);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${statusFilter === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                        }`}
                    >
                      {option === 'All' ? 'All Status' : option}
                    </button>
                  ))}
                </div>
              </div>


              {/* Action Buttons */}
              <button
                onClick={handleCreateDevice}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add {activeTab === 'devices' ? 'Device' : 'Meter'}</span>
              </button>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => alert("Import feature coming soon!")}
                  className="p-2 text-gray-600 hover:bg-white hover:text-[#ff6e00] hover:shadow-sm rounded-lg transition-all"
                  title="Import"
                  aria-label="Import devices"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <div className="w-[1px] bg-gray-300 my-1"></div>
                <button
                  onClick={() => alert("Export feature coming soon!")}
                  className="p-2 text-gray-600 hover:bg-white hover:text-[#ff6e00] hover:shadow-sm rounded-lg transition-all"
                  title="Export"
                  aria-label="Export devices"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-100">{activeTab === 'devices' ? 'Device Name' : 'Meter Name'}</th>
                  <th className="px-6 py-4 border-b border-gray-100">Type</th>
                  <th className="px-6 py-4 border-b border-gray-100">{activeTab === 'devices' ? 'Device ID' : 'Location'}</th>
                  {activeTab === 'devices' && <th className="px-6 py-4 border-b border-gray-100">MAC Address</th>}
                  {activeTab === 'meters' && <th className="px-6 py-4 border-b border-gray-100">Reading</th>}
                  <th className="px-6 py-4 border-b border-gray-100">User</th>
                  <th className="px-6 py-4 border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-orange-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${activeTab === 'devices' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {activeTab === 'devices' ? <Cpu size={18} /> : <Gauge size={18} />}
                          </div>
                          <div>
                            <span className="font-bold text-gray-800 text-sm group-hover:text-[#ff6e00] transition-colors block">{item.name}</span>
                            <span className="text-xs text-gray-400 font-medium">ID: {item.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          {item.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 font-medium font-mono">
                        {activeTab === 'devices' ? item.deviceId : item.location}
                      </td>

                      {activeTab === 'devices' && (
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                          {item.mac}
                        </td>
                      )}
                      {activeTab === 'meters' && (
                        <td className="px-6 py-4 text-sm text-gray-800 font-bold font-mono">
                          {item.reading}
                        </td>
                      )}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                            {item.user ? item.user.substring(0, 2).toUpperCase() : 'NA'}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{item.user}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                          item.status === 'Inactive' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-500 animate-pulse' :
                            item.status === 'Inactive' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}></div>
                          {item.status}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditDevice(item)}
                            className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-[#ff6e00] hover:text-[#ff6e00] hover:shadow-md transition-all active:scale-90"
                            title="Edit"
                            aria-label="Edit device"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                                alert("Delete functionality coming soon!");
                              }
                            }}
                            className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-600 hover:shadow-md transition-all active:scale-90"
                            title="Delete"
                            aria-label="Delete device"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                          <Search className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-gray-600">No {activeTab} found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                        <button
                          onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                          className="mt-2 text-[#ff6e00] text-sm font-bold hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 bg-gray-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + pageSize, filteredData.length)}</span> of <span className="font-bold text-gray-900">{filteredData.length}</span> results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === page
                      ? 'bg-[#ff6e00] text-white shadow-md shadow-orange-500/30'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDevice}
        mode={modalMode}
        initialData={editingDevice || {}}
      />
    </div>
  );
}
