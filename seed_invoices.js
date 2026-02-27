import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'db.json');

const invoices = [
    { "id": "INV-2025-001", "customer": "John Doe", "email": "john@amr.com", "phone": "+91 98765 43210", "meter": "MTR-001", "resourceType": "SOLAR", "type": "Generation", "amount": "₹5,310", "date": "2025-01-15", "status": "Paid", "address": "123, Main Street, Mumbai, MH 400001", "consumption": "450 kWh", "rate": "₹10/kWh", "subtotal": "₹4,500", "tax": "₹810 (18% GST)", "paidDate": "2025-01-10" },
    { "id": "INV-2025-002", "customer": "Alice Smith", "email": "alice@amr.com", "phone": "+91 98765 43211", "meter": "MTR-003", "resourceType": "WATER", "type": "Usage", "amount": "₹1,416", "date": "2025-01-20", "status": "Pending", "address": "456, Park Avenue, Delhi, DL 110001", "consumption": "120 kL", "rate": "₹10/kL", "subtotal": "₹1,200", "tax": "₹216 (18% GST)" },
    { "id": "INV-2025-003", "customer": "Bob Wilson", "email": "bob@amr.com", "meter": "MTR-004", "resourceType": "ELECTRIC", "type": "Consumption", "amount": "₹10,502", "date": "2025-01-10", "status": "Overdue" },
    { "id": "INV-2025-004", "customer": "Charlie Brown", "email": "charlie@amr.com", "meter": "MTR-006", "resourceType": "WATER", "type": "Maintenance", "amount": "₹1,121", "date": "2025-01-25", "status": "Pending" },
    { "id": "INV-2025-005", "customer": "David Lee", "email": "david@amr.com", "meter": "MTR-007", "resourceType": "ELECTRIC", "type": "Billing", "amount": "₹7,316", "date": "2025-01-18", "status": "Paid" },
    { "id": "INV-2024-089", "customer": "Emma Wilson", "email": "emma@amr.com", "meter": "MTR-008", "resourceType": "GAS", "type": "Consumption", "amount": "₹4,012", "date": "2024-12-30", "status": "Paid" }
];

try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(data);
    db.invoices = invoices;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log("Invoices added to db.json successfully!");
} catch (err) {
    console.error("Error updating db.json:", err);
}
