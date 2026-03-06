import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardCard from "../../components/DashboardCard";
import { getTodayArrivals } from "../../api/dashboard.api";
import { getTodayCheckouts } from "../../api/dashboard.api";


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
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkouts, setCheckouts] = useState([]);

  // Fetch dashboard summary
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/summary");
      // console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchArrivals();
    fetchCheckouts();
  }, []);


  const fetchArrivals = async () => {
    try {
      const data = await getTodayArrivals();      
      setArrivals(data);
    } catch (error) {
      console.error("Arrivals Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckouts = async () => {
    try {
      const data = await getTodayCheckouts();
      setCheckouts(data);
    } catch (error) {
      console.error("Checkouts Error:", error);
    } finally {
      setLoading(false);
    }
  };

  

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
        
        <DashboardCard
          title="Today's Arrivals"
          value={`${data?.todayArrivals}`}
          icon={ArrowRightOnRectangleIcon}
          color="red"
        />

      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      {/* Today's Arrivals Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-gray-800 text-sm">Today's Arrivals</h3>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {arrivals.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Guest</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Rm</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Paid</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Due</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {arrivals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-gray-400 text-xs">
                    No arrivals today
                  </td>
                </tr>
              ) : (
                arrivals.slice(0, 4).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-20">
                      {item.guest_name}
                    </td>
                    <td className="px-3 py-2">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                        {item.room_type}
                      </span>
                    </td>
                    <td className="px-3 py-2">{item.rooms_count}</td>
                    <td className="px-3 py-2 text-green-600 font-medium">${item.paid_amount}</td>
                    <td className="px-3 py-2">
                      <span className={item.due_amount > 0 ? 'text-red-500' : 'text-gray-300'}>
                        ${item.due_amount}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => navigate(`/dashboard/reception/reservations/${item.id}`)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Check-In"
                      >
                        <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {arrivals.length > 4 && (
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-center">
            <span className="text-[10px] text-gray-500">+{arrivals.length - 4} more</span>
          </div>
        )}
      </div>

      {/* Today's Departures Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-linear-to-r from-amber-50 to-orange-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-gray-800 text-sm">Today's Departures</h3>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {checkouts.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Guest</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Rm</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Type</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Paid</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500">Due</th>
                <th className="px-3 py-2 text-left font-medium text-gray-500"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {checkouts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-gray-400 text-xs">
                    No departures today
                  </td>
                </tr>
              ) : (
                checkouts.slice(0, 4).map((item) => (
                  <tr key={item.stay_id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-20">
                      {item.full_name}
                    </td>
                    <td className="px-3 py-2">
                      <span className="bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        #{item.room_number}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                        {item.room_type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-green-600 font-medium">${item.paid_amount}</td>
                    <td className="px-3 py-2">
                      <span className={item.due_amount > 0 ? 'text-red-500' : 'text-gray-300'}>
                        ${item.due_amount}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => navigate(`/dashboard/reception/stays/${item.stay_id}`)}
                        className="text-amber-600 hover:text-amber-800 p-1"
                        title="Checkout"
                      >
                        <ArrowRightCircleIcon className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {checkouts.length > 4 && (
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-center">
            <span className="text-[10px] text-gray-500">+{checkouts.length - 4} more</span>
          </div>
        )}
      </div>
    </div>

    </div>
  );
}
