import React, { useState, Suspense, lazy } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Lazy Load Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const GasPage = lazy(() => import("./pages/Gas"));
const WaterPage = lazy(() => import("./pages/Water"));
const EnergyPage = lazy(() => import("./pages/Energy"));
const SolarPage = lazy(() => import('./pages/Solar'));
const AnalysisPage = lazy(() => import("./pages/Analysis"));
const AlertsPage = lazy(() => import("./pages/Alerts"));
const DevicesPage = lazy(() => import("./pages/Devices"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const ReportsPage = lazy(() => import("./pages/Reports"));
const BillingPage = lazy(() => import("./pages/Billing"));
const PayloadsPage = lazy(() => import("./pages/Payloads"));
const LoginPage = lazy(() => import("./pages/Login"));
const MyUsagePage = lazy(() => import("./pages/MyUsage"));
const SupportManagementPage = lazy(() => import("./pages/SupportManagement"));

// Loading Component
const Loading = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
  const [userRole, setUserRole] = useState(sessionStorage.getItem('userRole') || 'Admin');
  const [collapsed, setCollapsed] = useState(false);
  // Initialize activePage from sessionStorage or default to "Dashboard"
  const [activePage, setActivePage] = useState(sessionStorage.getItem('activePage') || "Dashboard");

  // Persist activePage to sessionStorage whenever it changes
  React.useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('activePage', activePage);
    }
  }, [activePage, isAuthenticated]);

  // Auto-collapse on small screens
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // On login, default to Dashboard or previously saved page if valid logic requires it,
    // but typically reset to Dashboard to start fresh session or keep current if seamless.
    // Here we set to Dashboard for new login.
    setActivePage("Dashboard");
    sessionStorage.setItem('activePage', "Dashboard");
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('activePage');
    setIsAuthenticated(false);
    setUserRole('Admin'); // Reset to default
    setActivePage("Dashboard");
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<Loading />}>
        <LoginPage onLogin={handleLogin} />
      </Suspense>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (desktop only, collapsible) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sticky Header */}
        <Header
          userRole={userRole}
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />

        {/* Page content – ONLY this scrolls */}
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<Loading />}>
            {activePage === "Dashboard" && <Dashboard setActivePage={setActivePage} userRole={userRole} />}
            {activePage === "Users" && <Users />}
            {activePage === 'Gas' && <GasPage setActivePage={setActivePage} />}
            {activePage === 'Water' && <WaterPage setActivePage={setActivePage} />}
            {activePage === 'Energy' && <EnergyPage setActivePage={setActivePage} />}
            {activePage === 'Solar' && <SolarPage setActivePage={setActivePage} />}
            {activePage === 'Devices' && <DevicesPage />}
            {activePage === "Alerts" && <AlertsPage />}
            {activePage === "Analysis" && <AnalysisPage />}
            {activePage === "Settings" && <SettingsPage />}
            {activePage === "Reports" && <ReportsPage />}
            {activePage === "Billing" && <BillingPage userRole={userRole} />}
            {activePage === "My Usage" && <MyUsagePage />}
            {activePage === "Payloads" && <PayloadsPage />}
            {activePage === "Support" && <SupportManagementPage />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
