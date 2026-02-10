import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getDailySummary } from "../../api/reports.api";
import StatCard from "../../components/StatCard";


export default function DashboardHome() {
    const { user } = useAuth();

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await getDailySummary();
                console.log(data);

                setSummary(data);
            } catch (err) {
                console.error("Failed to load dashboard summary", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                Welcome, {user?.name}
            </h2>

            {/* ADMIN / MANAGER DASHBOARD */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            )}

            {/* RECEPTION DASHBOARD */}
            {user?.role === "RECEPTION" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Check-ins Today</p>
                        <p className="text-3xl font-bold mt-2">
                            {summary?.checkinsToday || 0}
                        </p>
                    </div> */}
                    <StatCard
                        title="Check-ins Today"
                        value={`₹${summary?.checkinsToday || 0}`}
                    />

                    {/* <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Occupied Rooms</p>
                        <p className="text-3xl font-bold mt-2">
                            {summary?.occupiedRooms || 0}
                        </p>
                    </div> */}
                    <StatCard
                        title="Occupied Rooms"
                        value={`₹${summary?.occupiedRooms || 0}`}
                    />

                    {/* <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Payments Today</p>
                        <p className="text-3xl font-bold mt-2">
                            ₹{summary?.paymentsToday || 0}
                        </p>
                    </div> */}
                    <StatCard
                        title="Payments Today"
                        value={`₹${summary?.paymentsToday || 0}`}
                    />

                </div>
            )}

            {/* HOUSEKEEPING DASHBOARD */}
            {user?.role === "HOUSEKEEPING" && (
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-lg font-medium">
                        Rooms pending for cleaning:{" "}
                        <span className="font-bold">
                            {summary?.roomsPendingCleaning || 0}
                        </span>
                    </p>
                </div>
            )}

        </div>
    );
}
