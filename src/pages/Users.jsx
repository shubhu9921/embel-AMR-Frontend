import React, { useState } from "react";
import { Search, Plus, Download, Upload, MoreVertical, Edit, Trash2 } from "lucide-react";
import CreateUserModal from "./CreateUserModal";

const initialUsers = [
  { id: 1, firstName: "John", lastName: "Anderson", email: "john.anderson@email.com", phone: "9876543210", roleId: "ADMIN", address: "Mumbai, MH", status: "Active" },
  { id: 2, firstName: "Sarah", lastName: "Miller", email: "sarah.miller@email.com", phone: "9876543211", roleId: "USER", address: "Pune, MH", status: "Active" },
  { id: 3, firstName: "Michael", lastName: "Chen", email: "michael.chen@email.com", phone: "9876543212", roleId: "USER", address: "Nagpur, MH", status: "Inactive" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStatus, setViewStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pageSize = 10;

  // Filter Data
  const filteredUsers = users.filter((user) =>
    (user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (viewStatus === "All" || user.status === viewStatus)
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, filteredUsers.length);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handleCreateUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      phone: userData.mobile,
      roleId: userData.role,
      status: "Active"
    };
    setUsers([...users, newUser]);
  };

  return (
    <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-100 p-4">
      <div className="relative flex flex-col h-[calc(100vh-100px)] overflow-hidden">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-5 space-y-4 flex-1 flex flex-col w-full h-full overflow-hidden">

          {/* Header Section */}
          <div className="flex flex-row justify-between items-center gap-4 mb-2 bg-gray-50/50 -mx-4 -mt-4 p-4 border-b rounded-t-lg">
            <div className="flex items-center gap-4 shrink-0">
              <h1 className="text-xl font-black text-[#002D5E] uppercase tracking-tight">Users</h1>
              <button
                onClick={() => setViewStatus(prev => prev === "All" ? "Inactive" : "All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 border ${viewStatus === 'Inactive' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-gray-200 hover:bg-gray-50'}`}
              >
                {viewStatus === "All" ? "Show Inactive" : "Show All"}
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end">
              {/* Search */}
              <div className="relative w-full max-w-[400px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  placeholder="Search User..."
                  className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input id="user-upload-input" className="hidden" accept=".xlsx,.xls,.csv" type="file" />

                {/* Add User Button */}
                <div className="relative group">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </button>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    Add User
                  </span>
                </div>

                {/* Download List Button */}
                <div className="relative group">
                  <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center">
                    <Download className="w-5 h-5 stroke-[3]" />
                  </button>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    Download List
                  </span>
                </div>

                {/* Upload Excel Button */}
                <div className="relative group">
                  <button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white p-2 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center">
                    <Upload className="w-5 h-5 stroke-[3]" />
                  </button>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-bold text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    Upload Excel
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded border flex-1 custom-scrollbar">
            <table className="w-full text-[13px] min-w-[1000px] border-collapse sticky-header">
              <thead className="bg-[#F8FAFC] text-[#002D5E] font-black uppercase border-b sticky top-0 z-10 text-sm">
                <tr className="text-[#002D5E] font-black uppercase text-sm">
                  <th className="px-3 py-1.5 text-left border-r w-16 text-center">NO.</th>
                  <th className="px-3 py-1.5 text-left border-r">FIRST NAME</th>
                  <th className="px-3 py-1.5 text-left border-r">LAST NAME</th>
                  <th className="px-3 py-1.5 text-left border-r">EMAIL</th>
                  <th className="px-3 py-1.5 text-left border-r">PHONE</th>
                  <th className="px-3 py-1.5 text-left border-r">ROLE ID</th>
                  <th className="px-3 py-1.5 text-left border-r">ADDRESS</th>
                  <th className="px-3 py-1.5 text-left border-r">STATUS</th>
                  <th className="px-3 py-1.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 border-r text-center font-bold text-gray-500">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-2 border-r font-bold text-gray-700">{user.firstName}</td>
                      <td className="px-3 py-2 border-r font-bold text-gray-700">{user.lastName}</td>
                      <td className="px-3 py-2 border-r text-gray-600 font-medium">{user.email}</td>
                      <td className="px-3 py-2 border-r text-gray-600 font-medium">{user.phone}</td>
                      <td className="px-3 py-2 border-r text-blue-600 font-bold">{user.roleId}</td>
                      <td className="px-3 py-2 border-r text-gray-600 text-xs">{user.address}</td>
                      <td className="px-3 py-2 border-r">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded text-blue-600 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-10 text-center text-gray-400 font-medium">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="flex justify-between items-center gap-4 pt-2 border-t">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Showing <span className="text-blue-600">{filteredUsers.length > 0 ? startRange : 0} - {endRange}</span> of <span className="text-gray-900">{filteredUsers.length}</span> users
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100 transition-all font-bold text-gray-600"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
                Page {filteredUsers.length > 0 ? currentPage : 0} of {totalPages || 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50 active:bg-gray-100 transition-all font-bold text-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </main>
  );
}