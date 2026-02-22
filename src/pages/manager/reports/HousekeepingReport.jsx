import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { formatHotelDateCA } from "../../../utils/dateTime";

export default function HousekeepingReport() {
  const today = new Date().toISOString().slice(0, 10);

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/housekeeping", { params: { from, to } });
      setData(res.data.logs || []);
    } catch (error) {
      console.error("Error fetching housekeeping data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Calculate summary statistics
  const totalTasks = data.length;
  const uniqueCleaners = [...new Set(data.map(row => row.cleaner_name))].length;
  const statusCounts = data.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Housekeeping Report</h2>
        <p className="text-gray-600 mt-1">Track room cleaning activities and status</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <button
            onClick={fetchData}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Load Report
          </button>
        </div>

        {/* Active Date Range Display */}
        {(from || to) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Showing housekeeping from:</span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
              {new Date(from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' — '}
              {new Date(to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalTasks}</p>
            <p className="text-xs text-gray-500 mt-1">Cleaning records</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Active Cleaners</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{uniqueCleaners}</p>
            <p className="text-xs text-gray-500 mt-1">Staff members</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts['completed'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Tasks done</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts['in-progress'] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Pending tasks</p>
          </div>
        </div>
      )}

      {/* Housekeeping Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Cleaning Activity Log
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {data.length} cleaning record{data.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cleaner
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-12">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-600">Loading housekeeping data...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                      <p className="text-gray-500 text-lg mb-1">No housekeeping records found</p>
                      <p className="text-gray-400 text-sm">Try selecting a different date range</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={`
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      hover:bg-gray-100/50 transition
                    `}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        <span className="font-medium text-gray-800">Room {row.room_number}</span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-700">
                            {row.cleaner_name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="text-gray-700">{row.cleaner_name}</span>
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${row.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${row.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${row.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                        ${row.status === 'inspected' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {row.status === 'completed' && '✓ '}
                        {row.status === 'in-progress' && '⟳ '}
                        {row.status}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="text-gray-700">{formatHotelDateCA(row.cleaned_at)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(row.cleaned_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      {data.length > 0 && (
        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}