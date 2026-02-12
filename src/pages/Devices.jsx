import { useState, useEffect, useRef } from "react";
import DeviceModal from "./CreateDeviceModal";
import {
  Router,
  Search,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  ChevronDown,
  Cpu
} from "lucide-react";
import { StatCard } from "./StatCard";

const initialDevicesData = [
  { id: 1, admin: "demoadmin", user: "ashwini", deviceId: "C6:92:06:F0:F8:58", name: "EMBEL-HTTPS", type: "NBIOT", mac: "EE:8A:C2:A1:F7:CD", status: "Active" },
  { id: 2, admin: "kunal", user: "siddhesh", deviceId: "E4:DF:99:FB:F4:3F", name: "EMBEL-OPENCPU_24_04_24", type: "NBIOT", mac: "E4:DF:99:FB:F4:3F", status: "Inactive" },
  { id: 3, admin: "demoadmin", user: "demouser", deviceId: "1234", name: "Embel-OPEN_CPU", type: "NBIOT", mac: "E5:E5:61:39:9F:F8", status: "Active" },
  { id: 4, admin: "demoadmin", user: "user4", deviceId: "ID-004", name: "Device-4", type: "NBIOT", mac: "MAC-004", status: "Active" },
  { id: 5, admin: "demoadmin", user: "user5", deviceId: "ID-005", name: "Device-5", type: "NBIOT", mac: "MAC-005", status: "Inactive" },
  { id: 6, admin: "demoadmin", user: "user6", deviceId: "ID-006", name: "Device-6", type: "NBIOT", mac: "MAC-006", status: "Active" },
  { id: 7, admin: "demoadmin", user: "user7", deviceId: "ID-007", name: "Device-7", type: "NBIOT", mac: "MAC-007", status: "Active" },
  { id: 8, admin: "demoadmin", user: "user8", deviceId: "ID-008", name: "Device-8", type: "NBIOT", mac: "MAC-008", status: "Active" },
  { id: 9, admin: "demoadmin", user: "user9", deviceId: "ID-009", name: "Device-9", type: "NBIOT", mac: "MAC-009", status: "Active" },
  { id: 10, admin: "demoadmin", user: "user10", deviceId: "ID-0010", name: "Device-10", type: "NBIOT", mac: "MAC-0010", status: "Active" },
  { id: 11, admin: "demoadmin", user: "user11", deviceId: "ID-0011", name: "Device-11", type: "NBIOT", mac: "MAC-0011", status: "Active" },
  { id: 12, admin: "demoadmin", user: "user12", deviceId: "ID-0012", name: "Device-12", type: "NBIOT", mac: "MAC-0012", status: "Active" },
];

export default function DevicesPage() {
  const [devicesData, setDevicesData] = useState(initialDevicesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingDevice, setEditingDevice] = useState(null);
  const pageSize = 10;
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

  // Filter Data
  const filteredDevices = devicesData.filter(device => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredDevices.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentDevices = filteredDevices.slice(startIndex, startIndex + pageSize);

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
      // Map existing device data to form fields
      admin: device.admin,
      user: device.user,
      techType: device.type,
      meterType: 'water', // Default or derive if available
      deviceId: device.deviceId,
      macId: device.mac,
      deviceName: device.name,
      // Add other fields if available in device object, otherwise defaults
      deviceEnable: device.status === 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSaveDevice = (formData) => {
    if (modalMode === 'create') {
      const newDevice = {
        id: devicesData.length + 1,
        admin: formData.admin,
        user: formData.user || "N/A",
        deviceId: formData.deviceId,
        name: formData.deviceName,
        type: formData.techType,
        mac: formData.macId,
        status: formData.deviceEnable ? "Active" : "Inactive"
      };
      setDevicesData([...devicesData, newDevice]);
    } else {
      // Update existing device
      setDevicesData(devicesData.map(d =>
        d.deviceId === editingDevice.deviceId ? {
          ...d,
          admin: formData.admin,
          user: formData.user || "N/A",
          deviceId: formData.deviceId,
          name: formData.deviceName,
          type: formData.techType,
          mac: formData.macId,
          status: formData.deviceEnable ? "Active" : "Inactive"
        } : d
      ));
    }
  };

  // KPI Counts
  const totalDevices = devicesData.length;
  const activeDevices = devicesData.filter(d => d.status === "Active").length;
  const inactiveDevices = devicesData.filter(d => d.status === "Inactive").length;
  // Assuming 'maintenance' could be derived or just a placeholder for now
  const maintenanceDevices = 0;

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth font-sans">

      {/* Top Header */}
      {/* Top Header */}
      <div className="sticky top-0 z-30 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-orange-50/90 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Cpu size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Device Management
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Monitor & configure devices
              </p>
            </div>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20" />
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto space-y-6">

        {/* KPI Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Devices"
            value={totalDevices}
            icon={<Cpu className="w-4 h-4" />}
            color="orange"
            description="Total deployed units"
            compact
          />
          <StatCard
            title="Active Devices"
            value={activeDevices}
            icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ring-2 ring-green-200"></div>}
            color="green"
            description="Online & communicating"
            compact
          />
          <StatCard
            title="Inactive Devices"
            value={inactiveDevices}
            icon={<div className="w-2 h-2 bg-red-500 rounded-full ring-2 ring-red-200"></div>}
            color="red"
            description="Offline or disconnected"
            compact
          />
          <StatCard
            title="Maintenance"
            value={maintenanceDevices}
            icon={<Router className="w-4 h-4" />}
            color="amber"
            description="Under maintenance"
            compact
          />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">

          {/* Header Controls */}
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl">
            {/* Left: Title & Search */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-md shadow-orange-100 hover:shadow-orange-200 group-hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Actions & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter */}
              <div className="relative min-w-[160px]" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 ${isFilterOpen
                    ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="truncate">
                    {statusFilter === 'All' ? 'All Status' : statusFilter}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                  {['All', 'Active', 'Inactive'].map((option) => (
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

              <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

              {/* Action Buttons */}
              <button
                onClick={handleCreateDevice}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Device</span>
              </button>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button className="p-2 text-gray-600 hover:bg-white hover:text-[#ff6e00] hover:shadow-sm rounded-lg transition-all" title="Import">
                  <Upload className="w-5 h-5" />
                </button>
                <div className="w-[1px] bg-gray-300 my-1"></div>
                <button className="p-2 text-gray-600 hover:bg-white hover:text-[#ff6e00] hover:shadow-sm rounded-lg transition-all" title="Export">
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
                  <th className="px-6 py-4 border-b border-gray-100">#</th>
                  <th className="px-6 py-4 border-b border-gray-100">Device Details</th>
                  <th className="px-6 py-4 border-b border-gray-100">Type</th>
                  <th className="px-6 py-4 border-b border-gray-100">Owner</th>
                  <th className="px-6 py-4 border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentDevices.length > 0 ? (
                  currentDevices.map((device, index) => (
                    <tr
                      key={device.id}
                      className="group hover:bg-orange-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-gray-400 group-hover:text-[#ff6e00]">
                        {startIndex + index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm group-hover:text-[#ff6e00] transition-colors">{device.name}</span>
                          <span className="text-xs text-gray-400 font-mono mt-0.5">{device.deviceId}</span>
                          <span className="text-[10px] text-gray-300 uppercase tracking-widest">{device.mac}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            {device.type}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold text-gray-700">{device.user}</span>
                          <span className="text-xs text-gray-400">Admin: {device.admin}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${device.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                            }`}></div>
                          {device.status}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditDevice(device)}
                            className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-[#ff6e00] hover:text-[#ff6e00] hover:shadow-md transition-all active:scale-90"
                            title="Edit Device"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-600 hover:shadow-md transition-all active:scale-90"
                            title="Delete Device"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                          <Search className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-gray-600">No devices found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
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
              Showing <span className="font-bold text-gray-900">{filteredDevices.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + pageSize, filteredDevices.length)}</span> of <span className="font-bold text-gray-900">{filteredDevices.length}</span> results
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
        onSubmit={handleSaveDevice}
        mode={modalMode}
        initialData={editingDevice}
      />
    </main>
  );
}
