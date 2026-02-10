import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const role = user?.role;

  const menu = [];

  // Common dashboard
  menu.push({ label: "Dashboard", path: "/dashboard" });

  // Reception menu
  if (role === "RECEPTION") {
    menu.push(
      { label: "Availability", path: "/dashboard/reception/availability" },
      { label: "Availability Week", path: "/dashboard/reception/availability-week" },
      { label: "Check In", path: "/dashboard/reception/checkin" },
      { label: "Active Stays", path: "/dashboard/reception/active-stays" }
    );
  }

  // Housekeeping menu
  if (role === "HOUSEKEEPING") {
    menu.push(
      { label: "Rooms To Clean", path: "/dashboard/housekeeping/pending" }
    );
  }

  // Manager / Admin menu
  if (role === "ADMIN" || role === "MANAGER") {
    menu.push(
      { label: "Reports", path: "/dashboard/manager/reports" },
      { label: "Revenue", path: "/dashboard/manager/revenue" },
      { label: "Occupancy", path: "/dashboard/manager/occupancy" }
    );
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="h-14 flex items-center justify-center font-bold text-lg border-b border-slate-700">
        PMS Dashboard
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">

        {menu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-800 text-gray-300"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}
