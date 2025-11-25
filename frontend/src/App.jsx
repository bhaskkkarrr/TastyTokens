import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenuItems from "./pages/admin/AdminMenuItems";
import AdminQrCode from "./pages/admin/AdminQrCode";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminNotification from "./pages/admin/AdminNotification";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProviders from "./pages/admin/AdminProviders";

// PUBLIC
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import ProtectedRoute from "./guard/ProtectedRoute";

// CUSTOMER
import PublicLayout from "./pages/public/PublicLayout";
import CustomerMenu from "./pages/public/CustomerMenu";
import CartPage from "./pages/public/CartPage";
import Checkout from "./pages/public/Checkout";
import OrderStatus from "./pages/public/OrderStatus";
import CustomerProviders from "./pages/public/CustomerProviders";

// SUPER-ADMIN
import SuperAdminLayout from "./pages/super-admin/SuperAdminLayout";
import AdminOffers from "./pages/admin/AdminOffer";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public / Auth routes */}
        <Route path="/" element={<LoginPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProviders>
                <AdminLayout />
              </AdminProviders>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="menu-items" element={<AdminMenuItems />} />
          <Route path="qr-codes" element={<AdminQrCode />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="notifications" element={<AdminNotification />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Customer */}
        <Route
          path="/r/:restaurantId/t/:tableId/*"
          element={
            <CustomerProviders>
              <PublicLayout />
            </CustomerProviders>
          }
        >
          <Route index element={<CustomerMenu />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:orderId" element={<OrderStatus />} />
        </Route>

        {/* Super Admin */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
