import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { formatHotelDateCA } from "../../../utils/dateTime";

export default function PaymentsReport() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/payments", {
        params: { from, to }
      });
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Calculate summary stats
  const totalAmount = data.reduce((sum, row) => sum + Number(row.amount), 0);
  const paymentModes = [...new Set(data.map(row => row.payment_mode))];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Payments Report</h2>
        <p className="text-gray-600 mt-1">Track and analyze all payments received</p>
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
            Load Payments
          </button>
        </div>

        {/* Active Date Range Display */}
        {(from || to) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Showing payments from:</span>
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
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Payments</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{data.length}</p>
            <p className="text-xs text-gray-500 mt-1">Transactions</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
            <p className="text-2xl font-bold text-green-600 mt-1">${totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Sum of all payments</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Average Payment</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              ${(totalAmount / (data.length || 1)).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Modes</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{paymentModes.length}</p>
            <p className="text-xs text-gray-500 mt-1">{paymentModes.join(' • ')}</p>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Payment Transactions
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {data.length} payment{data.length !== 1 ? 's' : ''} found in selected date range
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
                  Stay ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received By
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-600">Loading payments...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg mb-1">No payments found</p>
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
                    <td className="px-4 py-3 text-gray-600">
                      <div>{formatHotelDateCA(row.date)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-mono">
                        #{row.stay_id}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{row.guest_name}</div>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600 text-base">
                        ${Number(row.amount).toFixed(2)}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${row.payment_mode === 'Cash' ? 'bg-green-100 text-green-800' : ''}
                        ${row.payment_mode === 'Card' ? 'bg-blue-100 text-blue-800' : ''}
                        ${row.payment_mode === 'UPI' ? 'bg-purple-100 text-purple-800' : ''}
                        ${row.payment_mode === 'Bank Transfer' ? 'bg-indigo-100 text-indigo-800' : ''}
                        ${!['Cash', 'Card', 'UPI', 'Bank Transfer'].includes(row.payment_mode) 
                          ? 'bg-gray-100 text-gray-800' 
                          : ''}
                      `}>
                        {row.payment_mode}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-700">
                            {row.received_by_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-gray-700">{row.received_by_name}</span>
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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>
      )}
    </div>
  );
}