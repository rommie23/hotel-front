import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { formatHotelDate } from "../../../utils/dateTime";
import { getCompleteOccupancyReport } from "../../../api/reports.api";

export default function OccupancyReport() {
  const today = new Date().toISOString().slice(0, 10);

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getCompleteOccupancyReport(from, to);
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Calculate summary statistics
  const avgOccupancy = data.length > 0
    ? (data.reduce((sum, row) => sum + (row.occupied_rooms / row.total_rooms * 100), 0) / data.length).toFixed(1)
    : 0;

  const totalRooms = data[0]?.total_rooms || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Occupancy Report</h2>
        <p className="text-gray-600 mt-1">Track room occupancy rates across dates</p>
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
            <span className="text-gray-500">Showing occupancy from:</span>
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
            <p className="text-xs text-gray-500 uppercase tracking-wider">Days in Range</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{data.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total days</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalRooms}</p>
            <p className="text-xs text-gray-500 mt-1">Available in hotel</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Occupancy</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{avgOccupancy}%</p>
            <p className="text-xs text-gray-500 mt-1">Period average</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Peak Occupancy</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {Math.max(...data.map(row => row.occupied_rooms))} / {totalRooms}
            </p>
            <p className="text-xs text-gray-500 mt-1">Highest occupied</p>
          </div>
        </div>
      )}

      {/* Occupancy Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Daily Occupancy Breakdown
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {data.length} day{data.length !== 1 ? 's' : ''} in selected range
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupied
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy %
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-600">Loading occupancy data...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                      <p className="text-gray-500 text-lg mb-1">No occupancy data found</p>
                      <p className="text-gray-400 text-sm">Try selecting a different date range</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => {
                  const occupancyPercent = ((row.occupied_rooms / row.total_rooms) * 100).toFixed(1);
                  const isHighOccupancy = occupancyPercent >= 80;
                  const isLowOccupancy = occupancyPercent <= 30;
                  
                  return (
                    <tr 
                      key={row.date} 
                      className={`
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        hover:bg-gray-100/50 transition
                      `}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{formatHotelDate(row.date)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-800">{row.total_rooms}</span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{row.occupied_rooms}</span>
                          <span className="text-xs text-gray-500">rooms</span>
                        </div>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-1.5 bg-indigo-600 rounded-full" 
                            style={{ width: `${(row.occupied_rooms / row.total_rooms) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="font-medium text-green-600">{row.available_rooms}</span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`
                          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                          ${isHighOccupancy ? 'bg-green-100 text-green-800' : ''}
                          ${!isHighOccupancy && !isLowOccupancy ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${isLowOccupancy ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {occupancyPercent}%
                        </span>
                      </td>
                    </tr>
                  );
                })
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