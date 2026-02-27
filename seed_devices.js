import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const sourceTypes = ['water', 'solar', 'gas', 'energy'];
const locations = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Basement', 'Roof'];

const generateMockDevices = () => {
    const payloads = [];

    sourceTypes.forEach(source => {
        // 10 Devices for this Source Type
        for (let i = 1; i <= 10; i++) {
            payloads.push({
                admin: "Demo Admin",
                user: "Domestic User1",
                techType: "WIFI",
                meterType: source,
                deviceId: `${source.toUpperCase()}-DEV-${i.toString().padStart(3, '0')}`,
                macId: `00:1A:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}:DD`,
                deviceName: `${source.charAt(0).toUpperCase() + source.slice(1)} Device ${i}`,
                serialNumber: `SN-${Math.floor(Math.random() * 100000)}`,
                billType: "postpaid",
                deviceEnable: true,
                amrEnable: true,
                wakeupTime: "06:00",
                sampleCount: 24,
                timezone: "Asia/Kolkata",
                literPerPulse: source === 'water' ? '10' : 'N/A',
                application: "Commercial",
                type: "Type A",
                diameter: source === 'water' ? '25mm' : 'N/A',
                customerName: "Sample Customer",
                customerAddress: "Tech Park",
                meterLocation: locations[Math.floor(Math.random() * locations.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                city: "Pune",
                state: "Maharashtra",
                startReading: "0",
                status: "Active"
            });
        }

        // 10 Meters for this Source Type
        for (let i = 1; i <= 10; i++) {
            payloads.push({
                admin: "Demo Admin",
                user: "Industrial User1",
                techType: "NBIOT",
                meterType: source,
                deviceId: `${source.toUpperCase()}-MTR-${i.toString().padStart(3, '0')}`,
                macId: `AA:BB:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}:${Math.floor(Math.random() * 90 + 10)}:EE`,
                deviceName: `${source.charAt(0).toUpperCase() + source.slice(1)} Meter ${i}`,
                serialNumber: `SN-MTR-${Math.floor(Math.random() * 100000)}`,
                billType: "postpaid",
                deviceEnable: true,
                amrEnable: true,
                wakeupTime: "08:00",
                sampleCount: 12,
                timezone: "Asia/Kolkata",
                literPerPulse: source === 'water' ? '10' : 'N/A',
                application: "Industrial",
                type: "Type A",
                diameter: source === 'water' ? '50mm' : 'N/A',
                customerName: "Industrial Corp",
                customerAddress: "MIDC",
                meterLocation: locations[Math.floor(Math.random() * locations.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                city: "Pune",
                state: "Maharashtra",
                startReading: Math.floor(Math.random() * 500).toString(),
                status: "Active"
            });
        }
    });

    return payloads;
};

// Directly write arrays to json to bypass HTTP bottlenecks entirely
try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Auto-increment IDs parsing existings
    let idCounter = 1;
    if (dbData.devices && dbData.devices.length > 0) {
        idCounter = Math.max(...dbData.devices.map(d => parseInt(d.id, 10) || 0)) + 1;
    } else {
        dbData.devices = [];
    }

    const newDevices = generateMockDevices().map(dev => {
        dev.id = idCounter++;
        return dev;
    });

    dbData.devices = [...dbData.devices, ...newDevices];

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    console.log(`Successfully injected ${newDevices.length} mock objects into db.json directly.`);
} catch (error) {
    console.error("Direct JSON write failed:", error);
}
