import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-6">

      {/* Left */}
      <h1 className="text-lg font-semibold">
        Hotel PMS
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="text-sm font-medium">{user?.name || "User"}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}
