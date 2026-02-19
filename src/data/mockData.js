
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
