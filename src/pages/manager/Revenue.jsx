import { useState } from "react";
import { getRevenueReport } from "../../api/reports.api";
import StatCard from "../../components/StatCard";

export default function Revenue() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both dates");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await getRevenueReport(fromDate, toDate);

      // Expected backend structure:
      // {
      //   summary: { totalCharges, totalPayments, balance },
      //   rows: [ { date, totalCharges, totalPayments, balance } ]
      // }

      setSummary(res.summary || null);
      setData(res.rows || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch revenue report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Revenue Report</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-lg"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-lg"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerate}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          Generate
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Charges"
            value={`₹${summary.totalCharges}`}
          />
          <StatCard
            title="Total Payments"
            value={`₹${summary.totalPayments}`}
          />
          <StatCard
            title="Balance"
            value={`₹${summary.balance}`}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading revenue data...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Total Charges</th>
                <th className="p-3">Total Payments</th>
                <th className="p-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">₹{row.totalCharges}</td>
                    <td className="p-3">₹{row.totalPayments}</td>
                    <td className="p-3 font-semibold">
                      ₹{row.balance}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
