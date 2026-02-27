import React, { useMemo } from 'react';
import { Gauge, Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { RESOURCES } from '../../utils/resourceUtils';
import { useSupport } from '../../context/SupportContext';

// Import newly refactored modular layout components
import { AdminStats } from './stats/AdminStats';
import { DomesticStats } from './stats/DomesticStats';
import { IndustrialStats } from './stats/IndustrialStats';
import { ResourceStats } from './stats/ResourceStats';

export const DashboardStats = React.memo(({
    userRole,
    isAdmin,
    activeResource,
    currentResStats,
    totalDevices,
    deviceStats,
    locationStats,
    totalMeters,
    meterStats,
    totalUsers,
    userStats,
    billingStats,
    revenueStats,
    reportsStats,
    userAssignedDevices,
    userDeviceStats,
    userAssignedLocations,
    userLocationStats,
    userAssignedMeters,
    userMeterStats,
    monthlyCostingData,
    toggleModal,
    handleNavToDevices,
    handleNavToMeters,
    handleNavToUsers,
    handleNavToBilling,
    handleNavToReports,
    handleNavToAlerts,
    handleNavToSupport,
    handleNavToIssues,
    handleNavToLocations,
    handleNavToEnergy,
    handleNavToSolar,
    handleNavToWater,
    handleNavToGas,
    totalLocations,
    topCity
}) => {
    const { getKPIs } = useSupport();

    // Fix: Derive currentUserIdentifier based on userRole dynamically without stale states
    const currentUserIdentifier = useMemo(() => sessionStorage.getItem('userName') || userRole, [userRole]);

    // Memoize the derived Support KPI computations 
    const computedKPIs = useMemo(() => getKPIs(currentUserIdentifier), [getKPIs, currentUserIdentifier]);
    const roleStats = useMemo(() => getKPIs(userRole), [getKPIs, userRole]);

    // Guard 1: Active Resource Drilldown
    if (activeResource !== RESOURCES.ALL) {
        return <ResourceStats activeResource={activeResource} currentResStats={currentResStats} handleNavToSupport={handleNavToSupport} />;
    }

    // Guard 2: Admin specific layout
    if (isAdmin) {
        return (
            <AdminStats
                totalDevices={totalDevices} deviceStats={deviceStats} locationStats={locationStats}
                totalMeters={totalMeters} meterStats={meterStats} totalUsers={totalUsers} userStats={userStats}
                billingStats={billingStats} revenueStats={revenueStats} reportsStats={reportsStats}
                stats={roleStats} monthlyCostingData={monthlyCostingData}
                toggleModal={toggleModal}
                handleNavToDevices={handleNavToDevices}
                handleNavToMeters={handleNavToMeters}
                handleNavToUsers={handleNavToUsers}
                handleNavToBilling={handleNavToBilling}
                handleNavToReports={handleNavToReports}
                handleNavToAlerts={handleNavToAlerts}
                handleNavToSupport={handleNavToSupport}
                handleNavToIssues={handleNavToIssues}
                handleNavToLocations={handleNavToLocations}
                handleNavToEnergy={handleNavToEnergy}
                handleNavToSolar={handleNavToSolar}
                handleNavToWater={handleNavToWater}
                handleNavToGas={handleNavToGas}
                totalLocations={totalLocations}
                topCity={topCity}
                tickets={computedKPIs.tickets || []}
            />
        );
    }

    // Guard 3: Domestic User specific layout
    if (userRole === 'Domestic User') {
        return (
            <DomesticStats
                userAssignedDevices={userAssignedDevices} userDeviceStats={userDeviceStats}
                userAssignedLocations={userAssignedLocations} userLocationStats={userLocationStats}
                userAssignedMeters={userAssignedMeters} userMeterStats={userMeterStats}
                userStats={computedKPIs} monthlyCostingData={monthlyCostingData}
                toggleModal={toggleModal} handleNavToAlerts={handleNavToAlerts} handleNavToIssues={handleNavToIssues} handleNavToBilling={handleNavToBilling} handleNavToSupport={handleNavToSupport} handleNavToLocations={handleNavToLocations}
                handleNavToEnergy={handleNavToEnergy} handleNavToSolar={handleNavToSolar} handleNavToWater={handleNavToWater} handleNavToGas={handleNavToGas}
                tickets={computedKPIs.tickets || []}
            />
        );
    }

    // Guard 4: Industrial User layout
    if (userRole === 'Industrial User') {
        return (
            <IndustrialStats
                userAssignedDevices={userAssignedDevices} userDeviceStats={userDeviceStats}
                userAssignedLocations={userAssignedLocations} userLocationStats={userLocationStats}
                userAssignedMeters={userAssignedMeters} userMeterStats={userMeterStats}
                userStats={computedKPIs} monthlyCostingData={monthlyCostingData}
                toggleModal={toggleModal} handleNavToAlerts={handleNavToAlerts} handleNavToIssues={handleNavToIssues} handleNavToBilling={handleNavToBilling} handleNavToSupport={handleNavToSupport} handleNavToLocations={handleNavToLocations}
                handleNavToEnergy={handleNavToEnergy} handleNavToSolar={handleNavToSolar} handleNavToWater={handleNavToWater} handleNavToGas={handleNavToGas}
                tickets={computedKPIs.tickets || []}
            />
        );
    }

    // No fallback layout to avoid rendering fake placeholder data for unhandled roles
    return null;
});
