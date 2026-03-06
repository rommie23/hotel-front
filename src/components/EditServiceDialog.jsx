import React, { useState } from "react";
import axios from "../api/axios";

const EditServiceDialog = ({ service, close, refresh }) => {
  const [form, setForm] = useState(service);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const updateService = async () => {
    setLoading(true);
    try {
      await axios.put(`/services/services/${service.id}`, form);
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
        <div className="px-6 py-4 bg-linear-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Edit Service</h3>
              <p className="text-xs text-gray-500 mt-0.5">{service.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="e.g., Laundry"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="e.g., Housekeeping"
            />
          </div>

          {/* Service Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Code
            </label>
            <input
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="e.g., LND001"
            />
            <p className="text-xs text-gray-400 mt-1.5">Optional unique identifier</p>
          </div>

          {/* Default Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Default Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              <input
                type="number"
                value={form.default_price}
                onChange={(e) => handleChange("default_price", e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="0.00"
                min="0"
                step="0.01"
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
            onClick={updateService}
            disabled={loading}
            className="px-5 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-25"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Updating...
              </span>
            ) : (
              "Update Service"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceDialog;