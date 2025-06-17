import React, { useContext, createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

import DashboardPage from "./pages/DashboardAdmin";
import BookingCourierPage from "./pages/BookingCourierPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import ShipmentsPageBranchOffice from "./pages/ShipmentsPageBranchOffice";
import FinalDestinationPage from "./pages/FinalDestinationPage";
import PickupPage from "./pages/PickupPage";
import PickupPageBranchOffice from "./pages/PickupPageBranchOffice"
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

import "./App.css";

// Auth Context
export const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function RoleRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated && role === allowedRole ? children : <Navigate to="/" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      setIsAuthenticated(true);
      setRole(user.role);
      if (user.branch && user.branch.branch_id) {
        setBranchId(user.branch.branch_id);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <AuthContext.Provider value={{ 
          isAuthenticated, 
          setIsAuthenticated, 
          role, 
          setRole,
          branchId,
          setBranchId 
        }}>
          <Router>
            <Routes>
              {/* Public Login Route */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    role === "branch_office" ? (
                      <Navigate to="/dashboard-branch" replace />
                    ) : (
                      <Navigate to="/dashboard-admin" replace />
                    )
                  ) : (
                    <LoginPage />
                  )
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/dashboard-admin"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <DashboardAdmin />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              {/* Protected Branch Office Routes */}
              <Route
                path="/dashboard-branch"
                element={
                  <RoleRoute allowedRole="branch_office">
                    <div className="app-container">
                      <BranchSidebar />
                      <div className="main-content">
                        <BranchTopbar />
                        <div className="page-content">
                          <DashboardBranchOffice />
                        </div>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />
              <Route
                path="/dashboard-branch/bookings"
                element={
                  <RoleRoute allowedRole="branch_office">
                    <div className="app-container">
                      <BranchSidebar />
                      <div className="main-content">
                        <BranchTopbar />
                        <div className="page-content">
                          <BookingCourierPage />
                        </div>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />
              <Route
                path="/dashboard-branch/pickup-requests"
                element={
                  <RoleRoute allowedRole="branch_office">
                    <div className="app-container">
                      <BranchSidebar />
                      <div className="main-content">
                        <BranchTopbar />
                        <div className="page-content">
                          <PickupPageBranchOffice />
                        </div>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />
              <Route
                path="/dashboard-branch/shipments"
                element={
                  <RoleRoute allowedRole="branch_office">
                    <div className="app-container">
                      <BranchSidebar />
                      <div className="main-content">
                        <BranchTopbar />
                        <div className="page-content">
                          <ShipmentsPageBranchOffice />
                        </div>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />
              <Route
                path="/dashboard-branch/finaldestination"
                element={
                  <RoleRoute allowedRole="branch_office">
                    <div className="app-container">
                      <BranchSidebar />
                      <div className="main-content">
                        <BranchTopbar />
                        <div className="page-content">
                          <FinalDestinationPage />
                        </div>
                      </div>
                    </div>
                  </RoleRoute>
                }
              />

              {/* Other Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <DashboardPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/bookingcourier"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <BookingCourierPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/shipments"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <ShipmentsPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/pickup-requests"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <PickupPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/finaldestination"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <FinalDestinationPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/ratecalculator"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <AgentsPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/customers"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <CustomersPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/zones"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <ZonesPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/billing"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <BillingPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/support"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <SupportPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <NotificationsPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <ReportsPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <div className="app-container">
                      <Sidebar />
                      <div className="main-content">
                        <Topbar />
                        <div className="page-content">
                          <SettingsPage />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
