import { useState } from "react";
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

const initialDevicesData = [
  { id: 1, admin: "demoadmin", user: "ashwini", deviceId: "C6:92:06:F0:F8:58", name: "EMBEL-HTTPS", type: "NBIOT", mac: "EE:8A:C2:A1:F7:CD", status: "Active" },
  { id: 2, admin: "kunal", user: "siddhesh", deviceId: "E4:DF:99:FB:F4:3F", name: "EMBEL-OPENCPU_24_04_24", type: "NBIOT", mac: "E4:DF:99:FB:F4:3F", status: "Deactive" },
  { id: 3, admin: "demoadmin", user: "demouser", deviceId: "1234", name: "Embel-OPEN_CPU", type: "NBIOT", mac: "E5:E5:61:39:9F:F8", status: "Active" },
  { id: 4, admin: "demoadmin", user: "user4", deviceId: "ID-004", name: "Device-4", type: "NBIOT", mac: "MAC-004", status: "Active" },
  { id: 5, admin: "demoadmin", user: "user5", deviceId: "ID-005", name: "Device-5", type: "NBIOT", mac: "MAC-005", status: "Deactive" },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingDevice, setEditingDevice] = useState(null);
  const pageSize = 10;

  // Filter Data
  const filteredDevices = devicesData.filter(device => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        status: formData.deviceEnable ? "Active" : "Deactive"
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
          status: formData.deviceEnable ? "Active" : "Deactive"
        } : d
      ));
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 scroll-smooth">
      <div className="px-2 py-4 md:px-4">
        <div className="relative flex flex-col h-[calc(100vh-120px)] overflow-hidden">
          <div className="flex-1 flex flex-col w-full h-full">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-5 space-y-4 h-full flex flex-col overflow-hidden">

              {/* Header Section */}
              <div className="flex flex-row justify-between items-center gap-4 mb-2 bg-gray-50/50 -mx-4 -mt-4 md:-mx-5 md:-mt-5 p-4 border-b rounded-t-lg">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-black text-[#002D5E] uppercase tracking-tight">Devices</h1>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm transition-all appearance-none cursor-pointer text-gray-700 hover:border-blue-300"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Deactive">Deactive</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full max-w-[400px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      placeholder="Search Device..."
                      className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="relative group">
                      <button
                        onClick={handleCreateDevice}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg text-sm font-bold uppercase transition-all shadow-md active:scale-95 flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 stroke-[3]" />
                      </button>
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        Create Device
                      </span>
                    </div>
                    <div className="relative group">
                      <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center">
                        <Download className="w-5 h-5 stroke-[3]" />
                      </button>
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        Download List
                      </span>
                    </div>
                    <div className="relative group">
                      <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg text-sm font-bold uppercase transition-all shadow-md active:scale-95 flex items-center justify-center">
                        <Upload className="w-5 h-5 stroke-[3]" />
                      </button>
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                        Upload Excel
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto rounded-xl border border-gray-200 flex-1 text-[13px] custom-scrollbar bg-white shadow-sm">
                <table className="w-full relative border-collapse">
                  <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-gray-200">
                    <tr className="text-[#002D5E] font-black uppercase text-sm">
                      <th className="px-4 py-2 text-left border-r border-gray-200">NO.</th>
                      <th className="px-4 py-2 text-left border-r border-gray-200">ADMIN</th>
                      <th className="px-4 py-2 text-left border-r border-gray-200">USER</th>
                      <th className="px-4 py-2 text-left border-r border-gray-200">DEVICE ID</th>
                      <th className="px-4 py-2 text-left border-r border-gray-200">DEVICE NAME</th>
                      <th className="px-4 py-2 text-left border-r border-gray-200">TYPE</th>
                      <th className="px-4 py-2 text-left border-r border-gray-200">MAC ID</th>
                      <th className="px-4 py-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentDevices.length > 0 ? (
                      currentDevices.map((device, index) => (
                        <tr key={device.id} className="cursor-pointer transition-colors text-gray-700 hover:bg-gray-50">
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{startIndex + index + 1}</td>
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{device.admin}</td>
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{device.user}</td>
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{device.deviceId}</td>
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{device.name}</td>
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{device.type}</td>
                          <td className="px-4 py-1.5 border-r border-gray-200 text-gray-700">{device.mac}</td>
                          <td className="px-4 py-1.5 flex justify-end gap-2 text-right">
                            <button
                              onClick={() => handleEditDevice(device)}
                              className="hover:bg-blue-100 p-1 rounded-lg transition-colors active:scale-90"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button className="hover:bg-red-100 p-1 rounded-lg transition-colors active:scale-90">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          No devices found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer / Pagination */}
              <div className="flex justify-between items-center gap-4 pt-2 border-t">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Showing <span className="text-blue-600">{currentDevices.length > 0 ? startIndex + 1 : 0} - {startIndex + currentDevices.length}</span> of <span className="text-gray-900">{filteredDevices.length}</span> devices
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100 transition-all"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>

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
