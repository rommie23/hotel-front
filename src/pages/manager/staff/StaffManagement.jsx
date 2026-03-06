import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import EditStaffDialog from "../../../components/EditStaffDialog";
import { UserPlusIcon, PencilIcon } from "@heroicons/react/24/outline";

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "RECEPTION"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await api.get("/users");
        setUsers(res.data.data);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const createUser = async (e) => {
        e.preventDefault();
        await api.post("/users", form);
        setForm({
            name: "",
            email: "",
            password: "",
            role: "RECEPTION"
        });
        fetchUsers();
    };

    const toggleUser = async (id) => {
        await api.patch(`/users/${id}/toggle-active`);
        fetchUsers();
    };

    // Role color mapping
    const getRoleColor = (role) => {
        const colors = {
            'ADMIN': 'bg-purple-100 text-purple-700 border-purple-200',
            'MANAGER': 'bg-orange-100 text-orange-700 border-orange-200',
            'RECEPTION': 'bg-blue-100 text-blue-700 border-blue-200',
            'HOUSEKEEPING': 'bg-green-100 text-green-700 border-green-200'
        };
        return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Calculate stats
    const totalStaff = users.length;
    const activeStaff = users.filter(u => u.is_active === 1).length;
    const roleCounts = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
                <p className="text-gray-600 mt-1">Manage hotel staff accounts and permissions</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{totalStaff}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Active Staff</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{activeStaff}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Admins</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{roleCounts['ADMIN'] || 0}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Reception</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{roleCounts['RECEPTION'] || 0}</p>
                </div>
            </div>

            {/* Create Staff Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <UserPlusIcon className="w-5 h-5 text-indigo-600" />
                        <h2 className="font-semibold text-gray-800">Add New Staff Member</h2>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Create a new staff account with appropriate role</p>
                </div>

                <form onSubmit={createUser} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="name"
                                    placeholder="e.g., John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="e.g., john@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Staff Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="RECEPTION">Reception</option>
                                    <option value="HOUSEKEEPING">Housekeeping</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 mt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition flex items-center justify-center gap-2"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Create Staff Account
                        </button>
                    </div>
                </form>
            </div>

            {/* Staff Table Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                Staff Members
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">All registered staff accounts</p>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                            {users.length} staff
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Staff Member
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <p className="text-gray-500 text-sm mb-1">No staff members found</p>
                                            <p className="text-gray-400 text-xs">Create your first staff account above</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr 
                                        key={user.id} 
                                        className={`
                                            ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                                            hover:bg-gray-100/50 transition
                                            ${user.is_active ? "" : "opacity-60"}
                                        `}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-800">{user.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {user.email}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                                ${getRoleColor(user.role)}
                                            `}>
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-xs font-medium"
                                            >
                                                <PencilIcon className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                        </td>

                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={user.is_active === 1}
                                                    onChange={() => toggleUser(user.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className={`
                                                    w-11 h-6 rounded-full transition-colors
                                                    ${user.is_active === 1 ? 'bg-green-500' : 'bg-gray-300'}
                                                    peer-focus:ring-2 peer-focus:ring-green-200
                                                `}>
                                                    <span className={`
                                                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                                                        transition-all duration-200
                                                        ${user.is_active === 1 ? 'translate-x-5' : 'translate-x-0'}
                                                    `}></span>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {user.is_active === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {/* Table Footer */}
                        {users.length > 0 && (
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                <tr>
                                    <td colSpan="5" className="px-4 py-3 text-xs text-gray-500">
                                        <div className="flex items-center justify-between">
                                            <span>Showing {users.length} staff members</span>
                                            <span className="text-gray-400">
                                                {activeStaff} active · {totalStaff - activeStaff} inactive
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* Edit Dialog */}
            {selectedUser && (
                <EditStaffDialog
                    user={selectedUser}
                    close={() => setSelectedUser(null)}
                    refresh={fetchUsers}
                />
            )}
        </div>
    );
};

export default StaffManagement;