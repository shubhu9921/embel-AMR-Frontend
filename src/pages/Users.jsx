import { Mail, Shield, MoreVertical } from 'lucide-react';

const users = [
  { id: 1, name: 'John Anderson', email: 'john.anderson@email.com', role: 'Admin', status: 'active', lastActive: '2 hours ago' },
  { id: 2, name: 'Sarah Miller', email: 'sarah.miller@email.com', role: 'User', status: 'active', lastActive: '5 hours ago' },
  { id: 3, name: 'Michael Chen', email: 'michael.chen@email.com', role: 'User', status: 'active', lastActive: '1 day ago' },
  { id: 4, name: 'Emily Rodriguez', email: 'emily.r@email.com', role: 'User', status: 'inactive', lastActive: '3 days ago' },
  { id: 5, name: 'David Kim', email: 'david.kim@email.com', role: 'User', status: 'active', lastActive: '12 hours ago' },
];

export default function UsersPage() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-white p-2 gap-2">
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">User Management</h1>
            <p className="text-xs text-gray-600">Manage household members and permissions</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{user.name}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-900">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${user.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                    {user.lastActive}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}