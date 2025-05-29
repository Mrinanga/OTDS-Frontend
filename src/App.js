import React, { useContext, createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardAdmin";
import BookingCourierPage from "./pages/BookingCourierPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import PickupPage from "./pages/PickupPage";
import AgentsPage from "./pages/AgentsPage";
import CustomersPage from "./pages/CustomersPage";
import ZonesPage from "./pages/ZonesPage";
import BillingPage from "./pages/BillingPage";
import SupportPage from "./pages/SupportPage";
import NotificationsPage from "./pages/NotificationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardBranchOffice from "./pages/DashboardBranchOffice";

import Sidebar from "./components/Shared/Sidebar";
import Topbar from "./components/Shared/Topbar";
import BranchSidebar from "./components/Shared/BranchSidebar";
import BranchTopbar from "./components/Shared/BranchTopbar";

import "./styles/app.css";

// Auth Context
export const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function RoleRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && role === allowedRole ? children : <Navigate to="/" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole }}>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? role === "admin"
                  ? <Navigate to="/dashboard-admin" />
                  : <Navigate to="/dashboard-branch" />
                : <LoginPage />
            }
          />

          {/* Protected Layout */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <div className="app-container">
                  {role === "branch" ? <BranchSidebar /> : <Sidebar />}
                  <div className="main-content">
                    {role === "branch" ? <BranchTopbar /> : <Topbar />}
                    <div className="page-content">
                      <Routes>
                        <Route
                          path="/dashboard-admin"
                          element={
                            <RoleRoute allowedRole="admin">
                              <DashboardAdmin />
                            </RoleRoute>
                          }
                        />
                        <Route
                          path="/dashboard-branch"
                          element={
                            <RoleRoute allowedRole="branch">
                              <DashboardBranchOffice />
                            </RoleRoute>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <PrivateRoute>
                              <DashboardPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/bookingcourier"
                          element={
                            <PrivateRoute>
                              <BookingCourierPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/shipments"
                          element={
                            <PrivateRoute>
                              <ShipmentsPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/pickup-requests"
                          element={
                            <PrivateRoute>
                              <PickupPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/ratecalculator"
                          element={
                            <PrivateRoute>
                              <AgentsPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/customers"
                          element={
                            <PrivateRoute>
                              <CustomersPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/zones"
                          element={
                            <PrivateRoute>
                              <ZonesPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/billing"
                          element={
                            <PrivateRoute>
                              <BillingPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/support"
                          element={
                            <PrivateRoute>
                              <SupportPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <PrivateRoute>
                              <NotificationsPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/reports"
                          element={
                            <PrivateRoute>
                              <ReportsPage />
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <PrivateRoute>
                              <SettingsPage />
                            </PrivateRoute>
                          }
                        />
                        {/* Catch-all fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
