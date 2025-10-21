import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenuItems from "./pages/admin/AdminMenuItems";
import AdminQrCode from "./pages/admin/AdminQrCode";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminNotification from "./pages/admin/AdminNotification";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./pages/admin/AdminLayout";

// PUBLIC
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import ProtectedRoute from "./guard/ProtectedRoute";

// CUSTOMER
import CustomerLayout from "./pages/customer/CustomerLayout";
import Dashboard from "./pages/customer/Dashboard";
import RewardPoints from "./pages/customer/RewardPoints";
import SuperAdminLayout from "./pages/super-admin/SuperAdminLayout";
import SuperDashboard from "./pages/super-admin/SuperDashboard";
import SuperAnalytics from "./pages/super-admin/SuperAnalytics";

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Routes>
          <Route
            path="/signup"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SignUpPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginPage />} />

          {/* Restaurant Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" index element={<AdminDashboard />} />
            <Route path="menu-items" element={<AdminMenuItems />} />
            <Route path="qr-codes" element={<AdminQrCode />} />
            <Route path="orders" index element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="notifications" element={<AdminNotification />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/:restaurantId" element={<CustomerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reward-points" element={<RewardPoints />} />
          </Route>

          {/* Super Admin Routes */}
          <Route
            path="super-admin"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminLayout></SuperAdminLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperDashboard />} />
            <Route path="dashboard" element={<SuperDashboard />} />
            <Route path="analytics" element={<SuperAnalytics />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
