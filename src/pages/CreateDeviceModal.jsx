import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function DeviceModal({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) {
    const defaultFormData = {
        // Allocation
        admin: '',
        user: '',
        // Metadata
        techType: '',
        meterType: '',
        deviceId: '',
        macId: '',
        deviceName: '',
        serialNumber: '',
        billType: '',
        deviceEnable: false,
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

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({ ...defaultFormData, ...initialData });
            } else {
                setFormData(defaultFormData);
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {mode === 'edit' ? 'Edit Device' : 'Add New Device'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <form id="device-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Device Allocation */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Device Allocation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <option value="demoadmin">Demo Admin</option>
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
                                        <option value="user1">User 1</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Device Metadata */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Device Metadata</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Device Technology Type <span className="text-red-500">*</span></label>
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
                                    <label className="text-xs font-semibold text-gray-700">Meter Type <span className="text-red-500">*</span></label>
                                    <select
                                        name="meterType"
                                        value={formData.meterType}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    >
                                        <option value="">Select Meter Type...</option>
                                        <option value="water">Water</option>
                                        <option value="gas">Gas</option>
                                        <option value="energy">Energy</option>
                                        <option value="solar">Solar</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Device ID <span className="text-red-500">*</span></label>
                                    <input
                                        name="deviceId"
                                        value={formData.deviceId}
                                        onChange={handleChange}
                                        placeholder="Enter Device ID"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                        readOnly={mode === 'edit'} // Maybe prevent ID change in edit?
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Device MACID <span className="text-red-500">*</span></label>
                                    <input
                                        name="macId"
                                        value={formData.macId}
                                        onChange={handleChange}
                                        placeholder="Enter Device MACID"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Device Name <span className="text-red-500">*</span></label>
                                    <input
                                        name="deviceName"
                                        value={formData.deviceName}
                                        onChange={handleChange}
                                        placeholder="Device Name"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Device Serial Number</label>
                                    <input
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={handleChange}
                                        placeholder="Device Serial Number"
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
                                        Device Enable
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

                        {/* Section 3: Device Configuration */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Device Configuration</h3>
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

                        {/* Section 4: Device Information */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b pb-2">Device Information</h3>
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
                                        <option value="Residential">Residential</option>
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
                                    <label className="text-xs font-semibold text-gray-700">Device Customer Name</label>
                                    <input
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        placeholder="Customer Name"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-700">Device Customer Address</label>
                                    <input
                                        name="customerAddress"
                                        value={formData.customerAddress}
                                        onChange={handleChange}
                                        placeholder="Customer Address"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Device Meter Location</label>
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
                                    <label className="text-xs font-semibold text-gray-700">City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">State</label>
                                    <input
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">Meter Start Reading <span className="text-red-500">*</span></label>
                                    <input
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
                        form="device-form"
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <Save size={16} />
                        {mode === 'edit' ? 'Update Device' : 'Save Device'}
                    </button>
                </div>
            </div>
        </div>
    );
}
