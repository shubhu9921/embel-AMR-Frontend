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

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (desktop only, collapsible) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sticky Header */}
        <Header

          activePage={activePage}
          setActivePage={setActivePage}
        />

        {/* Page content – ONLY this scrolls */}
        <main className="flex-1 overflow-y-auto">
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "Users" && <Users />}
          {activePage === 'Gas' && <GasPage />}
          {activePage === 'Water' && <WaterPage />}
          {activePage === 'Energy' && <EnergyPage />}
          {activePage === 'Solar' && <SolarPage />}
          {activePage === 'Devices' && <DevicesPage />}
          {activePage === "Alerts" && <AlertsPage />}
          {activePage === "Analysis" && <AnalysisPage />}
          {activePage === "Settings" && (
            <div className="p-6">Settings Page Content</div>
          )}
        </main>
      </div>
    </div>
  );
}
