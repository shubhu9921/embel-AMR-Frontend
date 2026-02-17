import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import GasPage from "./pages/Gas";
import WaterPage from "./pages/Water";
import EnergyPage from "./pages/Energy";
import SolarPage from './pages/Solar';
import AnalysisPage from "./pages/Analysis";
import AlertsPage from "./pages/Alerts";
import DevicesPage from "./pages/Devices";
import SettingsPage from "./pages/Settings";
import ReportsPage from "./pages/Reports";
import BillingPage from "./pages/Billing";
import PayloadsPage from "./pages/Payloads";
import LoginPage from "./pages/Login";

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
    return <LoginPage onLogin={handleLogin} />;
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
          {activePage === "Dashboard" && <Dashboard setActivePage={setActivePage} userRole={userRole} />}
          {activePage === "Users" && <Users />}
          {activePage === 'Gas' && <GasPage />}
          {activePage === 'Water' && <WaterPage />}
          {activePage === 'Energy' && <EnergyPage />}
          {activePage === 'Solar' && <SolarPage />}
          {activePage === 'Devices' && <DevicesPage />}
          {activePage === "Alerts" && <AlertsPage />}
          {activePage === "Analysis" && <AnalysisPage />}
          {activePage === "Settings" && <SettingsPage />}
          {activePage === "Reports" && <ReportsPage />}
          {activePage === "Billing" && <BillingPage />}
          {activePage === "Payloads" && <PayloadsPage />}
        </main>
      </div>
    </div>
  );
}
