
export const initialDevicesData = [
    { id: 1, admin: "demoadmin", user: "ashwini", deviceId: "C6:92:06:F0:F8:58", name: "EMBEL-HTTPS", type: "NBIOT", mac: "EE:8A:C2:A1:F7:CD", status: "Active" },
    { id: 2, admin: "kunal", user: "siddhesh", deviceId: "E4:DF:99:FB:F4:3F", name: "EMBEL-OPENCPU_24_04_24", type: "NBIOT", mac: "E4:DF:99:FB:F4:3F", status: "Inactive" },
    { id: 3, admin: "demoadmin", user: "demouser", deviceId: "1234", name: "EMBEL-OPEN_CPU", type: "NBIOT", mac: "E5:E5:61:39:9F:F8", status: "Active" },
    { id: 4, admin: "demoadmin", user: "user4", deviceId: "ID-004", name: "Device-4", type: "NBIOT", mac: "MAC-004", status: "Active" },
    { id: 5, admin: "demoadmin", user: "user5", deviceId: "ID-005", name: "Device-5", type: "NBIOT", mac: "MAC-005", status: "Inactive" },
    { id: 6, admin: "demoadmin", user: "user6", deviceId: "ID-006", name: "Device-6", type: "NBIOT", mac: "MAC-006", status: "Active" },
    { id: 7, admin: "demoadmin", user: "user7", deviceId: "ID-007", name: "Device-7", type: "NBIOT", mac: "MAC-007", status: "Active" },
    { id: 8, admin: "demoadmin", user: "user8", deviceId: "ID-008", name: "Device-8", type: "NBIOT", mac: "MAC-008", status: "Active" },
    { id: 9, admin: "demoadmin", user: "user9", deviceId: "ID-009", name: "Device-9", type: "NBIOT", mac: "MAC-009", status: "Active" },
    { id: 10, admin: "demoadmin", user: "user10", deviceId: "ID-0010", name: "Device-10", type: "NBIOT", mac: "MAC-0010", status: "Active" },
    { id: 11, admin: "demoadmin", user: "user11", deviceId: "ID-0011", name: "Device-11", type: "NBIOT", mac: "MAC-0011", status: "Active" },
    { id: 12, admin: "demoadmin", user: "user12", deviceId: "ID-0012", name: "Device-12", type: "NBIOT", mac: "MAC-0012", status: "Active" },
];

export const initialUsers = [
    { id: 1, firstName: "John", lastName: "Anderson", username: "janderson", email: "john.anderson@email.com", phone: "9876543210", roleId: "ADMIN", address: "Mumbai, MH", status: "Active" },
    { id: 2, firstName: "Sarah", lastName: "Miller", username: "smiller", email: "sarah.miller@email.com", phone: "9876543211", roleId: "USER", address: "Pune, MH", status: "Active" },
    { id: 3, firstName: "Michael", lastName: "Chen", username: "mchen", email: "michael.chen@email.com", phone: "9876543212", roleId: "USER", address: "Nagpur, MH", status: "Inactive" },
    { id: 4, firstName: "Emily", lastName: "Davis", username: "edavis", email: "emily.davis@email.com", phone: "9876543213", roleId: "USER", address: "Nashik, MH", status: "Active" },
    { id: 5, firstName: "David", lastName: "Wilson", username: "dwilson", email: "david.wilson@email.com", phone: "9876543214", roleId: "ADMIN", address: "Aurangabad, MH", status: "Active" },
];

export const sites = [
    { id: 1, name: "Headquarters", location: [19.076, 72.8777], status: "Active" }, // Mumbai
    { id: 2, name: "North Branch", location: [28.6139, 77.209], status: "Active" }, // Delhi
    { id: 3, name: "South Hub", location: [12.9716, 77.5946], status: "Inactive" }, // Bangalore
    { id: 4, name: "West Plant", location: [23.0225, 72.5714], status: "Active" }, // Ahmedabad
    { id: 5, name: "East Depot", location: [22.5726, 88.3639], status: "Deactivated" }, // Kolkata
    { id: 6, name: "Central Unit", location: [17.3850, 78.4867], status: "Active" }, // Hyderabad
];

export const userDataDetailed = {
    devices: [
        { id: 1, name: "EM-001", source: "Energy", params: "Voltage, Current, Power", status: "Active", location: "Mumbai" },
        { id: 2, name: "WM-002", source: "Water", params: "Flow Rate, Volume", status: "Active", location: "Mumbai" },
        { id: 3, name: "GM-003", source: "Gas", params: "Pressure, Volume", status: "Inactive", location: "Delhi" },
        { id: 4, name: "SM-004", source: "Solar", params: "Irradiance, Output", status: "Active", location: "Delhi" },
        { id: 5, name: "EM-005", source: "Energy", params: "Voltage, P.F.", status: "Deactivated", location: "Mumbai" },
    ],
    meters: [
        { id: 1, name: "Meter-01", source: "Energy", reading: "450 kWh", status: "Active", location: "Mumbai" },
        { id: 2, name: "Meter-02", source: "Water", reading: "1200 L", status: "Active", location: "Mumbai" },
        { id: 3, name: "Meter-03", source: "Gas", reading: "34 m3", status: "Active", location: "Delhi" },
        { id: 4, name: "Meter-04", source: "Energy", reading: "0 kWh", status: "Inactive", location: "Delhi" },
        { id: 5, name: "Meter-05", source: "Energy", reading: "0 kWh", status: "Deactivated", location: "Mumbai" },
        { id: 6, name: "Meter-06", source: "Water", reading: "500 L", status: "Active", location: "Mumbai" },
        { id: 7, name: "Meter-07", source: "Gas", reading: "12 m3", status: "Active", location: "Delhi" },
        { id: 8, name: "Meter-08", source: "Solar", reading: "89 kWh", status: "Active", location: "Mumbai" },
    ],
    locations: [
        {
            id: 1, name: "Mumbai Hub",
            devices: [
                { name: "EM-001", source: "Energy", status: "Active" },
                { name: "WM-002", source: "Water", status: "Active" },
                { name: "EM-005", source: "Energy", status: "Deactivated" }
            ],
            meters: [
                { name: "Meter-01", reading: "450 kWh", status: "Active" },
                { name: "Meter-02", reading: "1200 L", status: "Active" },
                { name: "Meter-05", reading: "0 kWh", status: "Deactivated" },
                { name: "Meter-06", reading: "500 L", status: "Active" },
                { name: "Meter-08", reading: "89 kWh", status: "Active" }
            ]
        },
        {
            id: 2, name: "Delhi Center",
            devices: [
                { name: "GM-003", source: "Gas", status: "Inactive" },
                { name: "SM-004", source: "Solar", status: "Active" }
            ],
            meters: [
                { name: "Meter-03", reading: "34 m3", status: "Active" },
                { name: "Meter-04", reading: "0 kWh", status: "Inactive" },
                { name: "Meter-07", reading: "12 m3", status: "Active" }
            ]
        }
    ]
};

export const PAGES_DATA = [
    // PAGES
    { id: 'p1', type: 'Page', label: 'Dashboard Overview', target: 'Dashboard' },
    { id: 'p2', type: 'Page', label: 'Gas Dashboard', target: 'Gas' },
    { id: 'p3', type: 'Page', label: 'Water Dashboard', target: 'Water' },
    { id: 'p4', type: 'Page', label: 'Energy Dashboard', target: 'Energy' },
    { id: 'p5', type: 'Page', label: 'Solar Dashboard', target: 'Solar' },
    { id: 'p6', type: 'Page', label: 'System Alerts', target: 'Alerts' },
    { id: 'p7', type: 'Page', label: 'Resource Analysis', target: 'Analysis' },
    { id: 'p8', type: 'Page', label: 'Users', target: 'Users' },
    { id: 'p9', type: 'Page', label: 'Devices', target: 'Devices' },
    { id: 'p10', type: 'Page', label: 'Billing', target: 'Billing' },
    { id: 'p11', type: 'Page', label: 'Reports', target: 'Reports' },
    { id: 'p12', type: 'Page', label: 'Settings', target: 'Settings' },
    { id: 'p13', type: 'Page', label: 'Support Management', target: 'Support' },
];

export const PARAMS_DATA = [
    // PARAMETERS
    { id: 'm1', type: 'Parameter', label: 'Voltage L1 (Energy)', value: '230V' },
    { id: 'm2', type: 'Parameter', label: 'Flow Rate (Water)', value: '120 L/m' },
    { id: 'm3', type: 'Parameter', label: 'Gas Pressure', value: '45 PSI' },
    { id: 'm4', type: 'Parameter', label: 'Active Power', value: '450 kW' },
    { id: 'm5', type: 'Parameter', label: 'Solar Irradiance', value: '850 W/m²' },
]

export const initialMetersData = [
    { id: 1, name: "Meter-01", type: "Energy", reading: "450 kWh", status: "Active", location: "Mumbai", user: "ashwini" },
    { id: 2, name: "Meter-02", type: "Water", reading: "1200 L", status: "Active", location: "Mumbai", user: "siddhesh" },
    { id: 3, name: "Meter-03", type: "Gas", reading: "34 m3", status: "Active", location: "Delhi", user: "demouser" },
    { id: 4, name: "Meter-04", type: "Energy", reading: "0 kWh", status: "Inactive", location: "Delhi", user: "user4" },
    { id: 5, name: "Meter-05", type: "Energy", reading: "0 kWh", status: "Deactivated", location: "Mumbai", user: "user5" },
    { id: 6, name: "Meter-06", type: "Water", reading: "500 L", status: "Active", location: "Mumbai", user: "user6" },
    { id: 7, name: "Meter-07", type: "Gas", reading: "12 m3", status: "Active", location: "Delhi", user: "user7" },
    { id: 8, name: "Meter-08", type: "Solar", reading: "89 kWh", status: "Active", location: "Mumbai", user: "user8" },
];

/* -------------------- ENERGY DATA -------------------- */
export const energyDataWeek = [
    { time: 'Mon', usage: 145 }, { time: 'Tue', usage: 152 }, { time: 'Wed', usage: 138 },
    { time: 'Thu', usage: 165 }, { time: 'Fri', usage: 148 }, { time: 'Sat', usage: 125 }, { time: 'Sun', usage: 110 },
];
export const energyDataDay = [
    { time: '00:00', usage: 5 }, { time: '04:00', usage: 8 }, { time: '08:00', usage: 25 },
    { time: '12:00', usage: 45 }, { time: '16:00', usage: 35 }, { time: '20:00', usage: 20 },
];
export const energyDataMonth = [
    { time: 'Week 1', usage: 900 }, { time: 'Week 2', usage: 1100 }, { time: 'Week 3', usage: 950 }, { time: 'Week 4', usage: 1200 },
];
export const energyDataYear = [
    { time: 'Jan', usage: 3800 }, { time: 'Feb', usage: 3600 }, { time: 'Mar', usage: 4000 },
    { time: 'Apr', usage: 4200 }, { time: 'May', usage: 4500 }, { time: 'Jun', usage: 5000 },
    { time: 'Jul', usage: 5200 }, { time: 'Aug', usage: 5100 }, { time: 'Sep', usage: 4800 },
    { time: 'Oct', usage: 4600 }, { time: 'Nov', usage: 4200 }, { time: 'Dec', usage: 4100 },
];
export const energyBreakdownData = [
    { name: 'HVAC', value: 45, color: '#f59e0b' },
    { name: 'Lighting', value: 20, color: '#fbbf24' },
    { name: 'Machinery', value: 25, color: '#fcd34d' },
    { name: 'Other', value: 10, color: '#fde68a' },
];
// Note: Icons need to be handled in the component or mapped by string name if strictly JSON, 
// but here we are in JS so we can keep structure but might need to import icons or handle them in the page.
// For simplicity in data file, we'll keep data separate from React components (icons).
export const energyParameters = [
    { label: 'Voltage (L1)', value: '230.5 V' },
    { label: 'Current', value: '45.2 A' },
    { label: 'Frequency', value: '50.0 Hz' },
    { label: 'Power Factor', value: '0.98' },
    { label: 'Active Power', value: '125 kW' },
    { label: 'Reactive Pwr', value: '12 kVAR' },
    { label: 'Apparent Pwr', value: '128 kVA' },
    { label: 'Phase Angle', value: '120°' },
    { label: 'Load Factor', value: '85%' },
    { label: 'THD', value: '2.5%' },
    { label: 'Battery', value: '100%' },
    { label: 'Grid Status', value: 'Stable' },
];
export const energyAlerts = [
    { id: 1, type: 'critical', title: 'Voltage Spike', message: 'L1 Voltage exceeded 250V.', timestamp: '30m ago' },
    { id: 2, type: 'warning', title: 'High Load', message: 'Machinery load at 95% capacity.', timestamp: '2h ago' },
    { id: 3, type: 'info', title: 'Power Factor', message: 'PF improved to 0.99.', timestamp: '5h ago' },
];
export const allEnergyMeters = [
    { deviceId: 'EM-001', deviceName: 'Main Panel', location: 'Control Room', status: 'active', dailyConsumption: '450 kWh', currentFlow: '125' },
    { deviceId: 'EM-002', deviceName: 'HVAC Unit', location: 'Roof', status: 'active', dailyConsumption: '180 kWh', currentFlow: '45' },
    { deviceId: 'EM-003', deviceName: 'Server Room', location: 'IT Wing', status: 'active', dailyConsumption: '120 kWh', currentFlow: '32' },
    { deviceId: 'EM-004', deviceName: 'Lighting A', location: 'Floor 1', status: 'active', dailyConsumption: '45 kWh', currentFlow: '12' },
    { deviceId: 'EM-005', deviceName: 'Workshop', location: 'Basement', status: 'warning', dailyConsumption: '85 kWh', currentFlow: '28' },
];

/* -------------------- WATER DATA -------------------- */
export const waterDataWeek = [
    { time: 'Mon', usage: 245 }, { time: 'Tue', usage: 288 }, { time: 'Wed', usage: 210 },
    { time: 'Thu', usage: 260 }, { time: 'Fri', usage: 230 }, { time: 'Sat', usage: 190 }, { time: 'Sun', usage: 160 },
];
export const waterDataDay = [
    { time: '00:00', usage: 10 }, { time: '06:00', usage: 40 }, { time: '12:00', usage: 80 }, { time: '18:00', usage: 60 },
];
export const waterDataMonth = [
    { time: 'Week 1', usage: 1200 }, { time: 'Week 2', usage: 1350 }, { time: 'Week 3', usage: 1100 }, { time: 'Week 4', usage: 1400 },
];
export const waterDataYear = [
    { time: 'Jan', usage: 4500 }, { time: 'Feb', usage: 4200 }, { time: 'Mar', usage: 4800 },
    { time: 'Apr', usage: 5000 }, { time: 'May', usage: 5200 }, { time: 'Jun', usage: 5800 },
    { time: 'Jul', usage: 6000 }, { time: 'Aug', usage: 5900 }, { time: 'Sep', usage: 5500 },
    { time: 'Oct', usage: 5300 }, { time: 'Nov', usage: 4900 }, { time: 'Dec', usage: 4800 },
];
export const waterBreakdownData = [
    { name: 'Dom', value: 40, color: '#06b6d4' },
    { name: 'HVAC', value: 25, color: '#22d3ee' },
    { name: 'Irrig', value: 20, color: '#67e8f9' },
    { name: 'Proc', value: 15, color: '#a5f3fc' },
];
export const waterParameters = [
    { label: 'Pressure', value: '3.2 bar' },
    { label: 'Temperature', value: '18°C' },
    { label: 'Flow Rate', value: '12.5 L/m' },
    { label: 'pH Level', value: '7.2' },
    { label: 'Turbidity', value: '0.5 NTU' },
    { label: 'Chlorine', value: '0.8 mg/L' },
    { label: 'Hardness', value: '120 mg/L' },
    { label: 'Conductivity', value: '450 µS' },
    { label: 'Pump Status', value: 'Active' },
    { label: 'Leak Check', value: 'Pass' },
    { label: 'Battery', value: '100%' },
    { label: 'Signal', value: '-60 dBm' },
];
export const waterAlerts = [
    { id: 1, message: 'Pump Failure detected', type: 'critical', timestamp: '2h ago' },
    { id: 2, message: 'High Pressure Warning', type: 'warning', timestamp: '4h ago' },
];
export const allWaterMeters = [
    { deviceName: 'Main Supply', deviceId: 'WM-001', location: 'Pump Room', status: 'active', currentFlow: '120.5', flowUnit: 'L/min', dailyConsumption: '450 L' },
    { deviceName: 'Cooling Tower', deviceId: 'WM-002', location: 'Roof', status: 'active', currentFlow: '85.0', flowUnit: 'L/min', dailyConsumption: '320 L' },
    { deviceName: 'Irrigation', deviceId: 'WM-003', location: 'Garden', status: 'inactive', currentFlow: '0.0', flowUnit: 'L/min', dailyConsumption: '0 L' },
    { deviceName: 'Cafeteria', deviceId: 'WM-004', location: 'Floor 1', status: 'active', currentFlow: '25.4', flowUnit: 'L/min', dailyConsumption: '150 L' },
];

/* -------------------- GAS DATA -------------------- */
export const gasDataWeek = [
    { time: 'Mon', usage: 45 }, { time: 'Tue', usage: 52 }, { time: 'Wed', usage: 38 },
    { time: 'Thu', usage: 65 }, { time: 'Fri', usage: 48 }, { time: 'Sat', usage: 55 }, { time: 'Sun', usage: 38 },
];
export const gasDataDay = [
    { time: '00:00', usage: 2 }, { time: '04:00', usage: 3 }, { time: '08:00', usage: 15 },
    { time: '12:00', usage: 25 }, { time: '16:00', usage: 18 }, { time: '20:00', usage: 10 },
];
export const gasDataMonth = [
    { time: 'Week 1', usage: 200 }, { time: 'Week 2', usage: 250 }, { time: 'Week 3', usage: 180 }, { time: 'Week 4', usage: 300 },
];
export const gasDataYear = [
    { time: 'Jan', usage: 1200 }, { time: 'Feb', usage: 1100 }, { time: 'Mar', usage: 900 },
    { time: 'Apr', usage: 800 }, { time: 'May', usage: 500 }, { time: 'Jun', usage: 300 },
    { time: 'Jul', usage: 250 }, { time: 'Aug', usage: 280 }, { time: 'Sep', usage: 350 },
    { time: 'Oct', usage: 600 }, { time: 'Nov', usage: 950 }, { time: 'Dec', usage: 1150 },
];
export const gasBreakdownData = [
    { name: 'Kitchen', value: 45, color: '#f97316' },
    { name: 'Heating', value: 30, color: '#fb923c' },
    { name: 'Boiler', value: 15, color: '#fdba74' },
    { name: 'Other', value: 10, color: '#fed7aa' },
];
export const gasParameters = [
    { label: 'Gas Pressure', value: '2.8 bar' },
    { label: 'System Temp', value: '22°C' },
    { label: 'Flow Velocity', value: '15 m/s' },
    { label: 'Calorific Val', value: '38.5 MJ' },
    { label: 'Supply Line', value: 'Active' },
    { label: 'Valve Pos', value: '100%' },
    { label: 'Methane %', value: '92%' },
    { label: 'Odorant Lvl', value: 'Good' },
    { label: 'Filter Sts', value: 'Clean' },
    { label: 'Regulator', value: 'Stable' },
    { label: 'Leak Sensor', value: 'Safe' },
    { label: 'Battery', value: '98%' },
];
export const gasAlerts = [
    { id: 1, type: 'success', title: 'System Normal', message: 'All gas meters are functioning optimally.', timestamp: '1h ago' },
    { id: 2, type: 'info', title: 'Winter Pattern', message: 'Usage +20% due to heating.', timestamp: '3h ago' },
    { id: 3, type: 'warning', title: 'Minor Leak Check', message: 'Scheduled for Zone B tomorrow.', timestamp: '5h ago' },
];
export const allGasMeters = [
    { deviceId: 'GAS-001', deviceName: 'Main Meter', location: 'Basement', status: 'active', dailyConsumption: '45 m³', currentFlow: '2.1' },
    { deviceId: 'GAS-002', deviceName: 'Kitchen Meter', location: 'Kitchen', status: 'active', dailyConsumption: '12 m³', currentFlow: '0.5' },
    { deviceId: 'GAS-003', deviceName: 'Boiler Room', location: 'Boiler', status: 'active', dailyConsumption: '22 m³', currentFlow: '1.2' },
    { deviceId: 'GAS-004', deviceName: 'Backup Line', location: 'Exterior', status: 'warning', dailyConsumption: '0 m³', currentFlow: '0.0' },
    { deviceId: 'GAS-005', deviceName: 'Annex A', location: 'Wing A', status: 'active', dailyConsumption: '15 m³', currentFlow: '0.8' },
    { deviceId: 'GAS-006', deviceName: 'Annex B', location: 'Wing B', status: 'inactive', dailyConsumption: '0 m³', currentFlow: '0.0' },
    { deviceId: 'GAS-007', deviceName: 'Lab 1', location: 'Wing C', status: 'active', dailyConsumption: '8 m³', currentFlow: '0.4' },
    { deviceId: 'GAS-008', deviceName: 'Lab 2', location: 'Wing C', status: 'active', dailyConsumption: '9 m³', currentFlow: '0.4' },
];

/* -------------------- SOLAR DATA -------------------- */
export const solarDataWeek = [
    { time: 'Mon', generation: 145 }, { time: 'Tue', generation: 162 }, { time: 'Wed', generation: 138 },
    { time: 'Thu', generation: 45 }, { time: 'Fri', generation: 158 }, { time: 'Sat', generation: 175 }, { time: 'Sun', generation: 180 },
];
export const solarDataDay = [
    { time: '06:00', generation: 5 }, { time: '09:00', generation: 45 }, { time: '12:00', generation: 125 },
    { time: '15:00', generation: 95 }, { time: '18:00', generation: 25 }, { time: '21:00', generation: 0 },
];
export const solarDataMonth = [
    { time: 'Week 1', generation: 900 }, { time: 'Week 2', generation: 1100 }, { time: 'Week 3', generation: 850 }, { time: 'Week 4', generation: 1200 },
];
export const solarDataYear = [
    { time: 'Jan', generation: 3800 }, { time: 'Feb', generation: 4200 }, { time: 'Mar', generation: 4800 },
    { time: 'Apr', generation: 5200 }, { time: 'May', generation: 5800 }, { time: 'Jun', generation: 6000 },
    { time: 'Jul', generation: 5900 }, { time: 'Aug', generation: 5500 }, { time: 'Sep', generation: 5100 },
    { time: 'Oct', generation: 4600 }, { time: 'Nov', generation: 4000 }, { time: 'Dec', generation: 3600 },
];
export const solarBreakdownData = [
    { name: 'String 1', value: 35, color: '#10b981' },
    { name: 'String 2', value: 30, color: '#34d399' },
    { name: 'String 3', value: 25, color: '#6ee7b7' },
    { name: 'String 4', value: 10, color: '#a7f3d0' },
];
export const solarParameters = [
    { label: 'Irradiance', value: '850 W/m²' },
    { label: 'Panel Temp', value: '45°C' },
    { label: 'Grid Freq', value: '50.1 Hz' },
    { label: 'Efficiency', value: '98.5%' },
    { label: 'Total Energy', value: '45.2 MWh' },
    { label: 'CO2 Saved', value: '12.5 T' },
    { label: 'Active Strings', value: '4/4' },
    { label: 'Inverter Sts', value: 'Online' },
    { label: 'Battery Lvl', value: '100%' },
    { label: 'Weather', value: 'Sunny' },
    { label: 'Performance', value: '92%' },
    { label: 'Export', value: '12 kWh' },
];
export const solarAlerts = [
    { id: 1, type: 'success', title: 'Peak Generation', message: 'System reached 125kW peak.', timestamp: '1h ago' },
    { id: 2, type: 'info', title: 'Cleaning Due', message: 'Panel efficiency -2% from dust.', timestamp: '2d ago' },
    { id: 3, type: 'warning', title: 'Grid Sync', message: 'Minor fluctuations detected.', timestamp: '5h ago' },
];
export const allSolarInverters = [
    { deviceId: 'INV-001', deviceName: 'Main Inverter', location: 'Plant Room', status: 'active', dailyConsumption: '450 kWh', currentFlow: '125' },
    { deviceId: 'INV-002', deviceName: 'String Inv A', location: 'Roof East', status: 'active', dailyConsumption: '180 kWh', currentFlow: '45' },
    { deviceId: 'INV-003', deviceName: 'String Inv B', location: 'Roof West', status: 'active', dailyConsumption: '120 kWh', currentFlow: '32' },
    { deviceId: 'INV-004', deviceName: 'Backup Unit', location: 'Basement', status: 'active', dailyConsumption: '15 kWh', currentFlow: '5' },
];

/* -------------------- DASHBOARD DATA -------------------- */
export const multiResourceDataDay = [
    { name: "00:00", Energy: 10, Water: 5, Gas: 2, Solar: 0 },
    { name: "04:00", Energy: 15, Water: 8, Gas: 3, Solar: 0 },
    { name: "08:00", Energy: 45, Water: 25, Gas: 10, Solar: 20 },
    { name: "12:00", Energy: 60, Water: 40, Gas: 15, Solar: 55 },
    { name: "16:00", Energy: 50, Water: 35, Gas: 12, Solar: 45 },
    { name: "20:00", Energy: 30, Water: 20, Gas: 8, Solar: 5 },
];
export const multiResourceDataWeek = [
    { name: "Mon", Energy: 400, Water: 240, Gas: 100, Solar: 300 },
    { name: "Tue", Energy: 300, Water: 139, Gas: 200, Solar: 250 },
    { name: "Wed", Energy: 200, Water: 480, Gas: 150, Solar: 320 },
    { name: "Thu", Energy: 278, Water: 390, Gas: 210, Solar: 280 },
    { name: "Fri", Energy: 189, Water: 480, Gas: 240, Solar: 310 },
    { name: "Sat", Energy: 239, Water: 380, Gas: 180, Solar: 290 },
    { name: "Sun", Energy: 349, Water: 430, Gas: 220, Solar: 350 },
];
export const multiResourceDataMonth = [
    { name: "W1", Energy: 2100, Water: 1200, Gas: 600, Solar: 1800 },
    { name: "W2", Energy: 2300, Water: 1400, Gas: 750, Solar: 2000 },
    { name: "W3", Energy: 1900, Water: 1100, Gas: 550, Solar: 1600 },
    { name: "W4", Energy: 2500, Water: 1600, Gas: 800, Solar: 2200 },
];
export const multiResourceDataYear = [
    { name: "Jan", Energy: 8500, Water: 4500, Gas: 2200, Solar: 7000 },
    { name: "Apr", Energy: 9200, Water: 5100, Gas: 2400, Solar: 8500 },
    { name: "Jul", Energy: 10500, Water: 6000, Gas: 2800, Solar: 9200 },
    { name: "Oct", Energy: 8800, Water: 4800, Gas: 2300, Solar: 7800 },
];
export const dashboardAlerts = [
    {
        id: 1,
        type: "critical",
        category: "System",
        priority: 1,
        title: "Meters Offline",
        message: "South Hub: 5 meters offline",
        timestamp: "10m",
        role: "Admin"
    },
    {
        id: 2,
        type: "warning",
        category: "Industrial",
        priority: 2,
        title: "High Usage",
        message: "West Plant: Usage spike detected",
        timestamp: "25m",
        role: "Industrial"
    },
    {
        id: 3,
        type: "info",
        category: "Maintenance",
        priority: 3,
        title: "North Branch: Scheduled maintenance",
        message: "Scheduled maintenance for power lines in North Branch from 2 PM to 4 PM.",
        timestamp: "1h",
        role: "Admin"
    },
    {
        id: 4,
        type: "critical",
        category: "Safety",
        priority: 1,
        title: "Gas Leak Detected",
        message: "Unit 4: Minor gas leak detected in supply line. Valve auto-shut triggered.",
        timestamp: "5h",
        role: "Industrial"
    },
    {
        id: 5,
        type: "warning",
        category: "Residential",
        priority: 2,
        title: "Unusual Water Flow",
        message: "Continuous water flow detected for 4 hours at User 2 residence.",
        timestamp: "12h",
        role: "Domestic"
    },
    {
        id: 6,
        type: "success",
        category: "System",
        priority: 3,
        title: "Backup Battery Restored",
        message: "Backup power system in Central Wing is now fully charged and operational.",
        timestamp: "1d",
        role: "Admin"
    }
];
