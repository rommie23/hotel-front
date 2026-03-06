import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import EditRoomCategoryDialog from "../../../components/EditRoomCategoryDialog";

const RoomCategories = () => {
    const [types, setTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [form, setForm] = useState({
        name: "",
        desc: "",
        base_price: "",
        max_occupancy: ""
    });

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        const res = await axios.get("roomType/room-types");
        setTypes(res.data.data);
    };

    const createType = async (e) => {
        e.preventDefault();

        await axios.post("roomType/room-types", form);

        setForm({
            name: "",
            desc: "",
            base_price: "",
            max_occupancy: ""
        });

        fetchTypes();
    };

    const toggleCategory = async (id) => {
        try {
            await axios.patch(`/roomType/room-types/${id}/toggle-active`);
            fetchTypes();
        } catch (error) {
            alert(error.response?.data?.message || "Error");
        }
    };

    // Calculate stats
    const activeCategories = types.filter(t => t.is_active === 1).length;
    const totalOccupancy = types.reduce((sum, t) => sum + (t.max_occupancy || 0), 0);

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Room Categories</h1>
                <p className="text-gray-600 mt-1">Manage room types, pricing, and occupancy limits</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{types.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Active Categories</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{activeCategories}</p>
                </div>
                {/* <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Capacity</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{totalOccupancy}</p>
                    <p className="text-xs text-gray-500 mt-1">guests (max)</p>
                </div> */}
            </div>

            {/* Add Category Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                        Add New Category
                    </h2>
                </div>

                <form onSubmit={createType} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                placeholder="e.g., Deluxe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                required
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Description
                            </label>
                            <input
                                placeholder="e.g., Ocean view"
                                value={form.desc}
                                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Base Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={form.base_price}
                                    onChange={(e) => setForm({ ...form, base_price: e.target.value })}
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Max Occupancy <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="2"
                                value={form.max_occupancy}
                                onChange={(e) => setForm({ ...form, max_occupancy: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                required
                                min="1"
                            />
                        </div>

                        <div className="md:col-span-1 flex items-end">
                            <button
                                type="submit"
                                className="w-full px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Category
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                            Room Categories List
                        </h3>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            {types.length} categories
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Base Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Max Occupancy
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
                            {types.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <p className="text-gray-500 text-sm mb-1">No categories found</p>
                                            <p className="text-gray-400 text-xs">Add your first room category above</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                types.map((type, index) => (
                                    <tr 
                                        key={type.id} 
                                        className={`
                                            ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                                            hover:bg-gray-100/50 transition
                                            ${type.is_active ? "" : "opacity-40"}
                                        `}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                <span className="font-medium text-gray-800">{type.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {type.description || (
                                                <span className="text-gray-400 italic">No description</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-green-600">
                                                ${type.base_price}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-gray-800">{type.max_occupancy}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedCategory(type)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-xs font-medium"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                        </td>

                                        <td className="px-4 py-3">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={type.is_active === 1}
                                                    onChange={() => toggleCategory(type.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className={`
                                                    w-11 h-6 rounded-full transition-colors
                                                    ${type.is_active === 1 ? 'bg-green-500' : 'bg-gray-300'}
                                                    peer-focus:ring-2 peer-focus:ring-green-200
                                                `}>
                                                    <span className={`
                                                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                                                        transition-all duration-200
                                                        ${type.is_active === 1 ? 'translate-x-5' : 'translate-x-0'}
                                                    `}></span>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {type.is_active === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {/* Table Footer with Summary */}
                        {types.length > 0 && (
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                <tr>
                                    <td colSpan="6" className="px-4 py-3 text-xs text-gray-500">
                                        <div className="flex items-center justify-between">
                                            <span>Showing {types.length} categories</span>
                                            <span className="text-gray-400">
                                                Average price: ${(types.reduce((sum, t) => sum + t.base_price, 0) / types.length).toFixed(2)}
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
            {selectedCategory && (
                <EditRoomCategoryDialog
                    category={selectedCategory}
                    close={() => setSelectedCategory(null)}
                    refresh={fetchTypes}
                />
            )}
        </div>
    );
};

export default RoomCategories;