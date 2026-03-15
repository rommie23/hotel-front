import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  TagIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();

  const role = user?.role;

  const menu = [];

  // Icon mapping
  const getIcon = (label) => {
    const icons = {
      "Dashboard": HomeIcon,
      "Availability": CalendarIcon,
      "Availability Week": ClockIcon,
      "Check In": ArrowRightOnRectangleIcon,
      "Active Stays": SparklesIcon,
      "Rooms To Clean": ClipboardDocumentCheckIcon,
      "Reports": DocumentChartBarIcon,
      "Revenue": CurrencyDollarIcon,
      "Manage Services": WrenchScrewdriverIcon,
      "Manage Rooms": BuildingOfficeIcon,
      "Manage Room Categories": TagIcon
    };
    return icons[label] || HomeIcon;
  };

  // Common dashboard
  menu.push({ label: "Dashboard", path: "/dashboard" });

  // Reception menu
  if (role === "RECEPTION") {
    menu.push(
      { label: "Availability", path: "/dashboard/reception/availability" },
      { label: "Availability Week", path: "/dashboard/reception/availability-week" },
      { label: "Check In", path: "/dashboard/reception/checkin" },
      { label: "Active Stays", path: "/dashboard/reception/active-stays" },
      { label: "Rooms To Clean", path: "/dashboard/housekeeping/pending" },
      { label: "Reservations", path: "/dashboard/reception/manage-reservation"}
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
      { label: "Manage Services", path: "/dashboard/manager/manage-services" },
      { label: "Manage Rooms", path: "/dashboard/manager/manage-rooms" },
      { label: "Manage Room Categories", path: "/dashboard/manager/manage-room-categories" },
      { label: "Manage Staff", path: "/dashboard/manager/manage-staff" },
      { label: "Reservations", path: "/dashboard/reception/manage-reservation"}
    );
  }

  // Group menu items by category (optional)
  const getRoleBadge = () => {
    const badges = {
      "RECEPTION": { text: "Reception", color: "bg-blue-500" },
      "HOUSEKEEPING": { text: "Housekeeping", color: "bg-green-500" },
      "ADMIN": { text: "Admin", color: "bg-purple-500" },
      "MANAGER": { text: "Manager", color: "bg-orange-500" }
    };
    return badges[role] || { text: role, color: "bg-gray-500" };
  };

  const roleBadge = getRoleBadge();

  return (
    <aside className="w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen sticky top-0 shadow-xl">
      
      {/* Logo Area with Role Badge */}
      <div className="h-auto py-5 px-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-white">P</span>
          </div>
          <span className="font-bold text-lg tracking-tight">PMS Dashboard</span>
        </div>
        
        {/* Role Badge */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-1 rounded-full ${roleBadge.color} bg-opacity-20 text-${roleBadge.color.split('-')[1]}-300 font-medium`}>
            {roleBadge.text}
          </span>
          <span className="text-xs text-gray-400">{user?.email || ''}</span>
        </div>
      </div>

      {/* Menu Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Navigation
        </p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <div className="space-y-1">
          {menu.map((item, idx) => {
            const Icon = getIcon(item.label);
            
            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : "text-gray-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`} />
                    
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Stats / Footer Info */}
        <div className="mt-8 pt-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-300">All systems operational</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              v2.1.0
            </p>
          </div>
        </div>
      </nav>

      {/* User Menu (Optional - can be expanded) */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}