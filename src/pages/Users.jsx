import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  ChevronDown
} from "lucide-react";
import CreateUserModal from "../components/modals/CreateUserModal";
import { StatCard } from "../components/dashboard/StatCard";
import { apiService } from "../services/apiService";

import { useData } from "../context/DataContext";

export default function UsersPage() {
  const {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser
  } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewStatus, setViewStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingUser, setEditingUser] = useState(null);
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
  const filteredUsers = users.filter((user) =>
    ((user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
    (viewStatus === "All" || user.status === viewStatus)
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, viewStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handleAddUserClick = () => {
    setModalMode('create');
    setEditingUser(null);
    setIsCreateModalOpen(true);
  };

  const handleEditUserClick = (user) => {
    setModalMode('edit');
    setEditingUser({
      ...user,
      role: user.roleId,
      mobile: user.phone
    });
    setIsCreateModalOpen(true);
  };

  const handleUserSubmit = async (userData) => {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      phone: userData.mobile,
      address: userData.address,
      status: userData.status || "Active",
      onlineStatus: "Offline"
    };

    if (modalMode === 'create') {
      try {
        payload.id = Date.now().toString(); // Fallback string payload
        payload.password = userData.password; // required
        await addUser(payload);
      } catch (err) {
        console.error("Failed to create user", err);
      }
    } else {
      try {
        if (userData.password) {
          payload.password = userData.password;
        } else {
          payload.password = editingUser.password;
        }
        await updateUser(editingUser.id, payload);
      } catch (err) {
        console.error("Failed to update user", err);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await deleteUser(user.id);
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  // KPI Calculations
  const getRoleStats = (role) => {
    // Role matching is now case-insensitive and handles "Industrial" vs "Industrial User"
    const isMatch = (userRole, target) => {
      if (target === 'Total') return true;
      const uRole = (userRole || '').toLowerCase();
      const tRole = target.toLowerCase();
      return uRole === tRole || uRole.startsWith(tRole);
    };

    const roleUsers = users.filter(u => isMatch(u.role, role));
    const active = roleUsers.filter(u => u.status === 'Active').length;
    const inactive = roleUsers.filter(u => u.status === 'Inactive' || u.status === 'Deactivated').length;
    const deactivated = roleUsers.filter(u => u.status === 'Deactivated').length;

    return {
      total: roleUsers.length,
      breakdown: [
        { label: 'Active', value: active, color: 'text-green-500' },
        { label: 'Inactive', value: inactive, color: 'text-red-500' },
        { label: 'Deactivated', value: deactivated, color: 'text-gray-400' }
      ]
    };
  };

  const totalStats = getRoleStats('Total');
  const adminStats = getRoleStats('Admin');
  const industrialStats = getRoleStats('Industrial');
  const domesticStats = getRoleStats('Domestic');

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full min-h-screen p-4 md:p-6 font-sans flex flex-col pt-6 md:pt-8">
        {/* Top Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  User Management
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Real-time monitoring and analytics
                </p>
              </div>
            </div>
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20" />
          </div>
        </div>

        <div className="space-y-6 w-full mt-4">

          {/* KPI Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Total Users"
              value={totalStats.total}
              icon={<Users className="w-4 h-4" />}
              color="orange"
              description="Overall registered accounts"
              statusBreakdown={totalStats.breakdown}
            />
            <StatCard
              title="System Admins"
              value={adminStats.total}
              icon={<UserCheck className="w-4 h-4" />}
              color="purple"
              description="Total account managers"
              statusBreakdown={adminStats.breakdown}
            />
            <StatCard
              title="Industrial Users"
              value={industrialStats.total}
              icon={<UserPlus className="w-4 h-4" />}
              color="blue"
              description="Enterprise level accounts"
              statusBreakdown={industrialStats.breakdown}
            />
            <StatCard
              title="Domestic Users"
              value={domesticStats.total}
              icon={<UserPlus className="w-4 h-4" />}
              color="cyan"
              description="Residential account holders"
              statusBreakdown={domesticStats.breakdown}
            />
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">

            {/* Header Controls */}
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-[84px] z-20 rounded-t-2xl shadow-md shadow-orange-100">
              {/* Left: Title & Search */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-80 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search users..."
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
                      {viewStatus === 'All' ? 'All Users' : viewStatus === 'Active' ? 'Active Only' : 'Inactive Only'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}>
                    {['All', 'Active', 'Inactive'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setViewStatus(option);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${viewStatus === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                          }`}
                      >
                        {option === 'All' ? 'All Users' : option === 'Active' ? 'Active Only' : 'Inactive Only'}
                      </button>
                    ))}
                  </div>
                </div>


                {/* Action Buttons */}
                <button
                  onClick={handleAddUserClick}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span className="hidden sm:inline">Add User</span>
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
                    <th className="px-6 py-4 border-b border-gray-100">Name & Email</th>
                    <th className="px-6 py-4 border-b border-gray-100">Role</th>
                    <th className="px-6 py-4 border-b border-gray-100">Phone</th>
                    <th className="px-6 py-4 border-b border-gray-100">Address</th>
                    <th className="px-6 py-4 border-b border-gray-100">Status</th>
                    <th className="px-6 py-4 border-b border-gray-100">Online</th>
                    <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-orange-50/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-400 group-hover:text-[#ff6e00]">
                          {startIndex + index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm group-hover:text-[#ff6e00] transition-colors">{user.firstName} {user.lastName}</span>
                            <span className="text-xs text-gray-400 font-medium mt-0.5">{user.email}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${user.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : user.role === 'Industrial'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : user.role === 'Support Engineer'
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600 font-medium font-mono">
                          {user.phone}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.address}
                        </td>

                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${user.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                              }`}></div>
                            {user.status}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${user.onlineStatus === 'Online' ? 'text-blue-600' : 'text-gray-400'}`}>
                            {user.onlineStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditUserClick(user)}
                              className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-[#ff6e00] hover:text-[#ff6e00] hover:shadow-md transition-all active:scale-90"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-600 hover:shadow-md transition-all active:scale-90"
                              title="Delete User"
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
                          <p className="text-lg font-medium text-gray-600">No users found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                          <button
                            onClick={() => { setSearchTerm(""); setViewStatus("All"); }}
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
                Showing <span className="font-bold text-gray-900">{filteredUsers.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + pageSize, filteredUsers.length)}</span> of <span className="font-bold text-gray-900">{filteredUsers.length}</span> results
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

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleUserSubmit}
          mode={modalMode}
          initialData={editingUser}
        />
      </main>
    </div>
  );
}