import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardCard from "../../components/DashboardCard";
import {
  HomeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  CurrencyDollarIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard summary
  const fetchSummary = async () => {
    try {

      setLoading(true);

      const res = await api.get("/dashboard/summary");

      setData(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  return (

    <div className="p-6">

      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <DashboardCard
          title="Total Rooms"
          value={data.totalRooms}
          icon={HomeIcon}
          color="purple"
        />

        <DashboardCard
          title="Occupied Rooms"
          value={data.occupiedRooms}
          icon={UserGroupIcon}
          color="red"
        />

        <DashboardCard
          title="Available Rooms"
          value={data.availableRooms}
          icon={CheckCircleIcon}
          color="green"
        />

        <DashboardCard
          title="Cleaning Required"
          value={data.cleaningRooms}
          icon={SparklesIcon}
          color="yellow"
        />

        <DashboardCard
          title="Today's Check-ins"
          value={data.todayCheckins}
          icon={ArrowRightOnRectangleIcon}
          color="blue"
        />

        <DashboardCard
          title="Today's Check-outs"
          value={data.todayCheckouts}
          icon={ArrowLeftOnRectangleIcon}
          color="orange"
        />

        <DashboardCard
          title="Today's Revenue"
          value={`$${data.todayRevenue}`}
          icon={CurrencyDollarIcon}
          color="green"
        />

        <DashboardCard
          title="Today's Payments"
          value={`$${data.todayPayments}`}
          icon={CreditCardIcon}
          color="blue"
        />

      </div>

    </div>
  );
}
