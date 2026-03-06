import React, { useState } from "react";
import api from "../api/axios";
import { PencilIcon } from "@heroicons/react/24/outline";

const EditStaffDialog = ({ user, close, refresh }) => {
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        role: user.role
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const updateUser = async () => {
        setLoading(true);
        try {
            await api.put(`/users/${user.id}`, form);
            refresh();
            close();
        } catch (error) {
            alert(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    // Role color mapping for preview
    const getRoleColor = (role) => {
        const colors = {
            'ADMIN': 'bg-purple-100 text-purple-700',
            'MANAGER': 'bg-orange-100 text-orange-700',
            'RECEPTION': 'bg-blue-100 text-blue-700',
            'HOUSEKEEPING': 'bg-green-100 text-green-700'
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-linear-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <PencilIcon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Edit Staff Member</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Update staff information and role</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5">
                    {/* Current Role Preview */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Current Role</p>
                        <div className="flex items-center gap-2">
                            <span className={`
                                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                ${getRoleColor(user.role)}
                            `}>
                                {user.role}
                            </span>
                            <span className="text-xs text-gray-400">
                                ID: {user.id}
                            </span>
                        </div>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
                                </svg>
                            </span>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    {/* Role Field */}
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

                    {/* Preview of selected role */}
                    {form.role && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-indigo-50 p-2 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                            <span>Role will be changed to: </span>
                            <span className={`
                                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${getRoleColor(form.role)}
                            `}>
                                {form.role}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={close}
                        className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={updateUser}
                        disabled={loading}
                        className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-25"
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Updating...
                            </>
                        ) : (
                            <>
                                <PencilIcon className="w-4 h-4" />
                                Update Staff
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditStaffDialog;