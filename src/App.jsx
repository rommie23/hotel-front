import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";

import Login from "./pages/login/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";

// Reception
import Availability from "./pages/reception/Availability";
import CheckIn from "./pages/reception/CheckIn";
import ActiveStays from "./pages/reception/ActiveStays";
import StayBilling from "./pages/reception/StayBilling";
import CheckOut from "./pages/reception/CheckOut";

// Housekeeping
import CleaningBoard from "./pages/housekeeping/CleaningBoard";

// Manager
import Reports from "./pages/manager/reports/Reports";
import Revenue from "./pages/manager/Revenue";
import AvailabilityWeek from "./pages/reception/AvailabilityWeek";
import CreateService from "./pages/manager/services/CreateService";
import CreateRoom from "./pages/manager/rooms/CreateRoom";
import RoomCategories from "./pages/manager/rooms/RoomCategories";
import StaffManagement from "./pages/manager/staff/StaffManagement";
// import Occupancy from "./pages/manager/Occupancy";

function App() {
  return (
    <BrowserRouter>
    <Routes>

      {/* Root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard Layout (PROTECTED) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />

        {/* RECEPTION */}
        <Route
          path="reception/availability"
          element={
            <RoleRoute allowedRoles={["RECEPTION"]}>
              <Availability />
            </RoleRoute>
          }
        />
        <Route
          path="reception/availability-week"
          element={
            <RoleRoute allowedRoles={["RECEPTION"]}>
              <AvailabilityWeek />
            </RoleRoute>
          }
        />

        <Route
          path="reception/checkin"
          element={
            <RoleRoute allowedRoles={["RECEPTION"]}>
              <CheckIn />
            </RoleRoute>
          }
        />

        <Route
          path="reception/billing/:stayId"
          element={
            <RoleRoute allowedRoles={["RECEPTION"]}>
              <StayBilling />
            </RoleRoute>
          }
        />
        <Route
          path="reception/checkout/:stayId"
          element={
            <RoleRoute allowedRoles={["RECEPTION"]}>
              <CheckOut />
            </RoleRoute>
          }
        />

        <Route
          path="reception/active-stays"
          element={
            <RoleRoute allowedRoles={["RECEPTION"]}>
              <ActiveStays />
            </RoleRoute>
          }
        />

        {/* HOUSEKEEPING */}
        <Route
          path="housekeeping/pending"
          element={
            <RoleRoute allowedRoles={["HOUSEKEEPING", "RECEPTION" ]}>
              <CleaningBoard />
            </RoleRoute>
          }
        />

        {/* MANAGER / ADMIN */}
        <Route
          path="manager/reports"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <Reports />
            </RoleRoute>
          }
        />

        <Route
          path="manager/revenue"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <Revenue />
            </RoleRoute>
          }
        />

        <Route
          path="manager/manage-services"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <CreateService />
            </RoleRoute>
          }
        />
        <Route
          path="manager/manage-rooms"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <CreateRoom />
            </RoleRoute>
          }
        />
        <Route
          path="manager/manage-room-categories"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <RoomCategories />
            </RoleRoute>
          }
        />
        <Route
          path="manager/manage-staff"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <StaffManagement />
            </RoleRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
