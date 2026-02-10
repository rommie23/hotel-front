import { useEffect, useState } from "react";
import { getDailySummary } from "../../api/reports.api";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDailySummary();
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading reports...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reports Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Revenue Today"
          value={`₹${summary?.revenueToday || 0}`}
        />
        <StatCard
          title="Occupancy"
          value={`${summary?.occupancyPercentage || 0}%`}
        />
        <StatCard
          title="Active Stays"
          value={summary?.activeStays || 0}
        />
      </div>

      {/* Report Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          onClick={() => navigate("/dashboard/manager/revenue")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-2">
            Revenue Report
          </h3>
          <p className="text-gray-500 text-sm">
            Detailed revenue by date range
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/manager/occupancy")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-lg font-semibold mb-2">
            Occupancy Report
          </h3>
          <p className="text-gray-500 text-sm">
            Room occupancy statistics
          </p>
        </div>

      </div>
    </div>
  );
}
