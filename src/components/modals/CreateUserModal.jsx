import React, { useEffect, useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

export default function CreateUserModal({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) {
    const defaultFormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Domestic',
        mobile: '',
        address: '',
        status: 'Active'
    };
    const [submitError, setSubmitError] = useState(null);

    const {
        values: formData,
        handleChange,
        setValues: setFormData,
        handleSubmit,
        isSubmitting
    } = useFormValidation(defaultFormData);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    firstName: initialData.firstName || '',
                    lastName: initialData.lastName || '',
                    email: initialData.email || '',
                    password: initialData.password || '',
                    role: initialData.role || 'Domestic',
                    mobile: initialData.phone || '',
                    address: initialData.address || '',
                    status: initialData.status || 'Active'
                });
            } else {
                setFormData(defaultFormData);
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const onSubmitHandler = async (values) => {
        setSubmitError(null);
        try {
            await Promise.resolve(onSubmit(values));
            onClose();
        } catch (err) {
            console.error(err);
            setSubmitError(err.message || 'An error occurred while saving user.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {mode === 'edit' ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {submitError && (
                    <div role="alert" aria-live="assertive" className="mx-6 mt-4 p-3 bg-red-50/80 text-red-600 text-sm font-medium rounded-xl flex items-center justify-between gap-2 border border-red-100 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} /> {submitError}
                        </div>
                        <button type="button" onClick={() => setSubmitError(null)} aria-label="Dismiss error" className="p-1 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <form id="user-form" onSubmit={(e) => handleSubmit(e, onSubmitHandler)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-semibold text-gray-700">Password {mode === 'create' && <span className="text-red-500">*</span>}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={mode === 'edit' ? "Leave blank to keep current password" : "Password"}
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required={mode === 'create'}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Role <span className="text-red-500">*</span></label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Industrial">Industrial</option>
                                    <option value="Domestic">Domestic</option>
                                    <option value="Support Engineer">Support Engineer</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-semibold text-gray-700">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Full Address"
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
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
                        form="user-form"
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 min-w-[120px]
                            ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                        ) : (
                            <><Save size={16} /> {mode === 'edit' ? 'Update User' : 'Save User'}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
