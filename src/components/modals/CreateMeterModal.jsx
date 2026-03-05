import React, { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

const locationData = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat"]
};

export default function CreateMeterModal({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) {
    const defaultFormData = {
        // Allocation
        recordType: 'meter',
        admin: '',
        user: '',
        // Metadata
        techType: '',
        meterType: '',
        deviceId: '', // Keeping internal field name deviceId for compatibility but labeling as Meter ID
        macId: '',
        deviceName: '',
        serialNumber: '',
        billType: '',
        deviceEnable: false, // Internal field name
        amrEnable: false,
        // Configuration
        wakeupTime: '',
        sampleCount: 0,
        timezone: 'Asia/Kolkata',
        literPerPulse: '',
        // Information
        application: '',
        type: '',
        diameter: '',
        customerName: '',
        customerAddress: '',
        meterLocation: '',
        building: '',
        area: '',
        zone: '',
        city: '',
        state: '',
        startReading: ''
    };

    const {
        values: formData,
        handleChange,
        setValues: setFormData,
        handleSubmit
    } = useFormValidation(defaultFormData);

    const [adminList, setAdminList] = React.useState([]);
    const [userList, setUserList] = React.useState([]);

    React.useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                const users = await import('../../services/apiService').then(m => m.apiService.getUsers());
                if (!isMounted) return;
                const admins = users.filter(u => u.role === 'Admin' || u.roleId === 'ADMIN');
                const regulars = users.filter(u => u.role !== 'Admin' && u.roleId !== 'ADMIN');
                setAdminList(admins);
                setUserList(regulars);
            } catch (err) {
                if (isMounted) console.error("Failed to fetch users for dropdown", err);
            }
        };
        fetchUsers();
        return () => { isMounted = false; };
    }, []);

    React.useEffect(() => {
        if (formData.user && userList.length > 0) {
            const selectedUser = userList.find(u => `${u.firstName} ${u.lastName}`.trim() === formData.user);
            if (selectedUser) {
                let appVal = "";
                const roleLower = selectedUser.role?.toLowerCase() || "";
                if (roleLower.includes('domestic')) appVal = 'Domestic';
                else if (roleLower.includes('industrial')) appVal = 'Industrial';
                else if (roleLower.includes('commercial')) appVal = 'Commercial';

                if (appVal && formData.application !== appVal) {
                    setFormData(prev => ({ ...prev, application: appVal }));
                }
            }
        }
    }, [formData.user, userList, setFormData, formData.application]);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                const safeInitialData = Object.fromEntries(
                    Object.entries(initialData).map(([k, v]) => [k, v === null || v === undefined ? '' : v])
                );
                setFormData({ ...defaultFormData, ...safeInitialData, recordType: 'meter' });
            } else {
                setFormData(defaultFormData);
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const onSubmitHandler = async (values) => {
        try {
            await Promise.resolve(onSubmit(values));
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save meter. Please check the form and try again.");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            role="presentation"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="meter-modal-title"
            >

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h2 id="meter-modal-title" className="text-lg font-bold text-gray-800">
                        {mode === 'edit' ? 'Edit Meter' : 'Add New Meter'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Close Modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <form id="meter-form" onSubmit={(e) => handleSubmit(e, onSubmitHandler)} className="space-y-8">

                        {/* Section 1: Meter Allocation */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Meter Allocation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 hidden">
                                    {/* Keep hidden just in case of validation dependencies on recordType */}
                                    <input type="hidden" name="recordType" value="meter" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Admin List <span className="text-red-500">*</span></label>
                                    <select
                                        name="admin"
                                        value={formData.admin}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Admin...</option>
                                        <option value="DA1">DA1</option>
                                        <option value="DA2">DA2</option>
                                        {adminList.map(admin => (
                                            <option key={admin.id} value={`${admin.firstName} ${admin.lastName}`.trim()}>
                                                {admin.firstName} {admin.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">User List (Optional)</label>
                                    <select
                                        name="user"
                                        value={formData.user}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select User...</option>
                                        {userList.map(user => (
                                            <option key={user.id} value={`${user.firstName} ${user.lastName}`.trim()}>
                                                {user.firstName} {user.lastName} {user.role ? `(${user.role})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Meter Metadata */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Meter Metadata</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Technology Type <span className="text-red-500">*</span></label>
                                    <select
                                        name="techType"
                                        value={formData.techType}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Technology Type...</option>
                                        <option value="NBIOT">NBIOT</option>
                                        <option value="4G">4G</option>
                                        <option value="WIFI">WiFi</option>
                                        <option value="ETHERNET">Ethernet</option>
                                        <option value="LORA">LORA</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Source Type <span className="text-red-500">*</span></label>
                                    <select
                                        name="meterType"
                                        value={formData.meterType}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Source Type...</option>
                                        <option value="water">Water</option>
                                        <option value="gas">Gas</option>
                                        <option value="energy">Energy</option>
                                        <option value="solar">Solar</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter ID <span className="text-red-500">*</span></label>
                                    <input
                                        name="deviceId"
                                        value={formData.deviceId}
                                        onChange={handleChange}
                                        placeholder={`Enter Meter ID`}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                        readOnly={mode === 'edit'}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter MACID <span className="text-red-500">*</span></label>
                                    <input
                                        name="macId"
                                        value={formData.macId}
                                        onChange={handleChange}
                                        placeholder={`Enter Meter MACID`}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Name <span className="text-red-500">*</span></label>
                                    <input
                                        name="deviceName"
                                        value={formData.deviceName}
                                        onChange={handleChange}
                                        placeholder="Meter Name"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Serial Number</label>
                                    <input
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={handleChange}
                                        placeholder="Meter Serial Number"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Bill Type <span className="text-red-500">*</span></label>
                                    <select
                                        name="billType"
                                        value={formData.billType}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Bill Type...</option>
                                        <option value="prepaid">Prepaid</option>
                                        <option value="postpaid">Postpaid</option>
                                    </select>
                                </div>
                                <div className="flex items-end gap-6 pb-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="deviceEnable"
                                            checked={formData.deviceEnable}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        Meter Enable
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amrEnable"
                                            checked={formData.amrEnable}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        AMR Enable
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Meter Configuration */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Meter Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Wakeup Time <span className="text-red-500">*</span></label>
                                    <input
                                        type="time"
                                        name="wakeupTime"
                                        value={formData.wakeupTime}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Data Sample Count</label>
                                    <input
                                        type="number"
                                        name="sampleCount"
                                        value={formData.sampleCount}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Timezone</label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Liter Per Pulse <span className="text-red-500">*</span></label>
                                    <input
                                        name="literPerPulse"
                                        value={formData.literPerPulse}
                                        onChange={handleChange}
                                        placeholder="Liter Per Pulse"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Meter Information */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Meter Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Application of AMR</label>
                                    <select
                                        name="application"
                                        value={formData.application}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="Domestic">Domestic</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="Type A">Type A</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Diameter Size</label>
                                    <select
                                        name="diameter"
                                        value={formData.diameter}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Select option</option>
                                        <option value="15mm">15mm</option>
                                        <option value="20mm">20mm</option>
                                        <option value="25mm">25mm</option>
                                        <option value="40mm">40mm</option>
                                        <option value="50mm">50mm</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Customer Name</label>
                                    <input
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        placeholder="Customer Name"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-700">Meter Customer Address</label>
                                    <input
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleChange}
                                        placeholder="Customer Address"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Location</label>
                                    <input
                                        name="meterLocation"
                                        value={formData.meterLocation}
                                        onChange={handleChange}
                                        placeholder="Meter Location"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Building Or Wing</label>
                                    <input
                                        name="building"
                                        value={formData.building}
                                        onChange={handleChange}
                                        placeholder="Building or Wing"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Area</label>
                                    <input
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        placeholder="Area"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Zone</label>
                                    <input
                                        name="zone"
                                        value={formData.zone}
                                        onChange={handleChange}
                                        placeholder="Zone"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">State</label>
                                    <input
                                        name="state"
                                        list="state-list"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Select or type State"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <datalist id="state-list">
                                        {Object.keys(locationData).sort().map(st => (
                                            <option key={st} value={st} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">City</label>
                                    <input
                                        name="city"
                                        list="city-list"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Select or type City"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        disabled={!formData.state}
                                    />
                                    <datalist id="city-list">
                                        {(locationData[formData.state] || []).sort().map(ct => (
                                            <option key={ct} value={ct} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Start Reading <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="startReading"
                                        value={formData.startReading}
                                        onChange={handleChange}
                                        placeholder="Meter Start Reading"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="meter-form"
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <Save size={16} />
                        {mode === 'edit' ? 'Update Meter' : 'Save Meter'}
                    </button>
                </div>
            </div>
        </div>
    );
}
