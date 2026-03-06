import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import EditServiceDialog from "../../../components/EditServiceDialog";

const CreateService = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    code: "",
    default_price: "",
    allow_price_override: true
  });

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services/hotel-services");
      setServices(res.data.services);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/services/services/create-service", form);

      alert("Service created successfully");

      setForm({
        name: "",
        category: "",
        code: "",
        default_price: "",
        allow_price_override: true
      });

      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (id) => {
    try {
      await api.patch(`/services/${id}/toggle`);
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  // Calculate stats
  const activeServices = services.filter(s => s.is_active === 1).length;
  const totalValue = services.reduce((sum, s) => sum + (s.default_price || 0), 0);
  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
        <p className="text-gray-600 mt-1">Create and manage hotel services and amenities</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Services</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{services.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active Services</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeServices}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Categories</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{categories.length}</p>
        </div>
        {/* <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Price</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            ${services.length ? (totalValue / services.length).toFixed(2) : '0.00'}
          </p>
        </div> */}
      </div>

      {/* Create Service Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-linear-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PlusCircleIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-gray-800">Add New Service</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">Fill in the details to create a new service</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="e.g., Laundry, Spa, Breakfast"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="e.g., Food & Beverage, Wellness"
                />
                <p className="text-xs text-gray-400 mt-1.5">Optional - used for grouping services</p>
              </div>

              {/* Service Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Service Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                  placeholder="e.g., SRV001, LND"
                />
                <p className="text-xs text-gray-400 mt-1.5">Unique identifier for the service</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Default Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Default Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                  <input
                    type="number"
                    name="default_price"
                    value={form.default_price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Price Override Toggle */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allow_price_override"
                      checked={form.allow_price_override}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className={`
                      w-11 h-6 rounded-full transition-colors
                      ${form.allow_price_override ? 'bg-emerald-500' : 'bg-gray-300'}
                      peer-focus:ring-2 peer-focus:ring-emerald-200
                    `}>
                      <span className={`
                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                        transition-all duration-200
                        ${form.allow_price_override ? 'translate-x-5' : 'translate-x-0'}
                      `}></span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Allow price override
                    </label>
                    <p className="text-xs text-gray-500">
                      Staff can modify price at checkout if enabled
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating Service...
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="w-5 h-5" />
                      Create Service
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Services List Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Services List
              </h3>
              <p className="text-xs text-gray-500 mt-1">All available hotel services</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
              {services.length} services
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              {services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm mb-1">No services found</p>
                      <p className="text-gray-400 text-xs">Create your first service above</p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr 
                    key={service.id} 
                    className={`
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      hover:bg-gray-100/50 transition
                      ${service.is_active ? "" : "opacity-60"}
                    `}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="font-medium text-gray-800">{service.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {service.category ? (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          {service.category}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {service.code ? (
                        <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                          {service.code}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600">
                        ${service.default_price}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedService(service)}
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
                          checked={service.is_active === 1}
                          onChange={() => toggleService(service.id)}
                          className="sr-only peer"
                        />
                        <div className={`
                          w-11 h-6 rounded-full transition-colors
                          ${service.is_active === 1 ? 'bg-green-500' : 'bg-gray-300'}
                          peer-focus:ring-2 peer-focus:ring-green-200
                        `}>
                          <span className={`
                            absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
                            transition-all duration-200
                            ${service.is_active === 1 ? 'translate-x-5' : 'translate-x-0'}
                          `}></span>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {service.is_active === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Table Footer */}
            {services.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Showing {services.length} services</span>
                      <span className="text-gray-400">
                        {services.filter(s => s.allow_price_override).length} services allow price override
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
      {selectedService && (
        <EditServiceDialog
          service={selectedService}
          close={() => setSelectedService(null)}
          refresh={fetchServices}
        />
      )}
    </div>
  );
};

export default CreateService;