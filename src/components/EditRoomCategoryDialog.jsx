import React, { useState } from "react";
import axios from "../api/axios";

const EditRoomCategoryDialog = ({ category, close, refresh }) => {
  const [form, setForm] = useState({
    name: category.name || "",
    description: category.description || "",
    base_price: category.base_price || "",
    max_occupancy: category.max_occupancy || ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`roomType/room-types/${category.id}`, form);
      refresh();
      close();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Edit Room Category</h3>
              <p className="text-xs text-gray-500 mt-0.5">{category.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="e.g., Deluxe Suite"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
              rows={3}
              placeholder="Describe the room category..."
            />
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Base Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              <input
                type="number"
                value={form.base_price}
                onChange={(e) => handleChange("base_price", e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Max Occupancy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Occupancy <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="number"
                value={form.max_occupancy}
                onChange={(e) => handleChange("max_occupancy", e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="2"
                min="1"
              />
            </div>
          </div>
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
            onClick={handleUpdate}
            disabled={loading}
            className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Updating...
              </span>
            ) : (
              "Update Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomCategoryDialog;