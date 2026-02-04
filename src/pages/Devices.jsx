import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const devicesData = [
  { id: 1, name: "4G-Gateway-001", mac: "AA:BB:CC:11:22", type: "4G", status: "ACTIVE", linked: "✓ MTR-001" },
  { id: 2, name: "WiFi-Gateway-002", mac: "DD:EE:FF:33:44", type: "WIFI", status: "INACTIVE", linked: "Not linked" },
  { id: 3, name: "WiFi-Gateway-003", mac: "DD:EE:FF:33:55", type: "WIFI", status: "INACTIVE", linked: "Not linked" },
  { id: 4, name: "WiFi-Gateway-004", mac: "DD:EE:FF:33:66", type: "WIFI", status: "ACTIVE", linked: "Not linked" },
  { id: 5, name: "WiFi-Gateway-005", mac: "DD:EE:FF:33:77", type: "WIFI", status: "ACTIVE", linked: "Not linked" },
];

const metersData = [
  { id: 1, number: "MTR-001", type: "SOLAR", assignedTo: "john_doe (USER)", site: "Site A", status: "ACTIVE", battery: "95%", online: true },
  { id: 2, number: "MTR-002", type: "GAS", assignedTo: "admin_user (ADMIN)", site: "Site B", status: "INACTIVE", battery: "80%", online: false },
  { id: 3, number: "MTR-003", type: "WATER", assignedTo: "alice (USER)", site: "Site C", status: "ACTIVE", battery: "60%", online: true },
  { id: 4, number: "MTR-004", type: "ELECTRIC", assignedTo: "bob (USER)", site: "Site D", status: "MAINTENANCE", battery: "70%", online: false },
  { id: 5, number: "MTR-005", type: "SOLAR", assignedTo: "superadmin (ADMIN)", site: "Site E", status: "ACTIVE", battery: "100%", online: true },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("devices");
  const [deviceSearch, setDeviceSearch] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [deviceStatusFilter, setDeviceStatusFilter] = useState("");
  const [meterSearch, setMeterSearch] = useState("");

  const [devicePage, setDevicePage] = useState(1);
  const [meterPage, setMeterPage] = useState(1);
  const pageSize = 3;

  // Filter devices by search, type, and status
  const filteredDevices = devicesData
    .filter(d => d.name.toLowerCase().includes(deviceSearch.toLowerCase()))
    .filter(d => (deviceTypeFilter ? d.type === deviceTypeFilter : true))
    .filter(d => (deviceStatusFilter ? d.status === deviceStatusFilter : true));

  const totalDevicePages = Math.ceil(filteredDevices.length / pageSize);
  const paginatedDevices = filteredDevices.slice((devicePage - 1) * pageSize, devicePage * pageSize);

  // Filter meters by search
  const filteredMeters = metersData.filter(m => m.number.toLowerCase().includes(meterSearch.toLowerCase()));
  const totalMeterPages = Math.ceil(filteredMeters.length / pageSize);
  const paginatedMeters = filteredMeters.slice((meterPage - 1) * pageSize, meterPage * pageSize);

  return (
    <main className="flex-1 overflow-y-auto p-2 md:p-4 scroll-smooth">
      <div className="space-y-4">

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("devices")}
            className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === "devices" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Devices
          </button>
          <button
            onClick={() => setActiveTab("meters")}
            className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === "meters" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          >
            Meters
          </button>
        </div>

        {/* Devices Tab */}
        {activeTab === "devices" && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Devices</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <input
                placeholder="Search devices..."
                value={deviceSearch}
                onChange={e => setDeviceSearch(e.target.value)}
                className="pl-3 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
              />
              <select
                value={deviceTypeFilter}
                onChange={e => setDeviceTypeFilter(e.target.value)}
                className="px-2 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Types</option>
                <option value="4G">4G</option>
                <option value="WIFI">WIFI</option>
              </select>
              <select
                value={deviceStatusFilter}
                onChange={e => setDeviceStatusFilter(e.target.value)}
                className="px-2 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left">Device</th>
                    <th className="px-4 py-2 text-left">MAC</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Linked</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDevices.map(device => (
                    <tr key={device.id} className="border-t hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-2">{device.name}</td>
                      <td className="px-4 py-2">{device.mac}</td>
                      <td className="px-4 py-2">{device.type}</td>
                      <td className="px-4 py-2">{device.status}</td>
                      <td className="px-4 py-2">{device.linked}</td>
                      <td className="px-4 py-2 text-right flex justify-end gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {paginatedDevices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500">No devices found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={devicePage === 1}
                onClick={() => setDevicePage(p => Math.max(p - 1, 1))}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm">
                Page {devicePage} of {totalDevicePages || 1}
              </span>
              <button
                disabled={devicePage === totalDevicePages || totalDevicePages === 0}
                onClick={() => setDevicePage(p => Math.min(p + 1, totalDevicePages))}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Meters Tab */}
        {activeTab === "meters" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Meters</h1>
            </div>

            <input
              placeholder="Search meters..."
              value={meterSearch}
              onChange={e => setMeterSearch(e.target.value)}
              className="pl-3 pr-3 py-2 w-full border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm min-w-[800px]">
                <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left">Meter Number</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                    <th className="px-4 py-2 text-left">Site</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Battery</th>
                    <th className="px-4 py-2 text-left">Online</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMeters.map(meter => (
                    <tr key={meter.id} className="border-t hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-2">{meter.number}</td>
                      <td className="px-4 py-2">{meter.type}</td>
                      <td className="px-4 py-2">{meter.assignedTo}</td>
                      <td className="px-4 py-2">{meter.site}</td>
                      <td className="px-4 py-2">{meter.status}</td>
                      <td className="px-4 py-2">{meter.battery}</td>
                      <td className="px-4 py-2">{meter.online ? "Online" : "Offline"}</td>
                      <td className="px-4 py-2 text-right flex justify-end gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {paginatedMeters.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-3 text-center text-gray-500">No meters found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={meterPage === 1}
                onClick={() => setMeterPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm">
                Page {meterPage} of {totalMeterPages || 1}
              </span>
              <button
                disabled={meterPage === totalMeterPages || totalMeterPages === 0}
                onClick={() => setMeterPage(p => Math.min(p + 1, totalMeterPages))}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
