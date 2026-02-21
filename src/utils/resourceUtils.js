import { Zap, Droplet, Flame, Sun, LayoutDashboard } from "lucide-react";

export const RESOURCES = {
    ALL: 'All',
    ENERGY: 'Energy',
    WATER: 'Water',
    GAS: 'Gas',
    SOLAR: 'Solar'
};

export const RESOURCE_CONFIG = [
    {
        id: RESOURCES.ALL,
        label: 'All',
        icon: LayoutDashboard,
        activeBg: 'bg-indigo-600 text-white shadow-md',
        inactiveBg: 'hover:bg-indigo-50 text-gray-500',
        color: 'indigo'
    },
    {
        id: RESOURCES.ENERGY,
        label: 'Energy',
        icon: Zap,
        activeBg: 'bg-emerald-500 text-white shadow-md',
        inactiveBg: 'hover:bg-emerald-50 text-gray-500',
        color: 'emerald'
    },
    {
        id: RESOURCES.GAS,
        label: 'Gas',
        icon: Flame,
        activeBg: 'bg-orange-500 text-white shadow-md',
        inactiveBg: 'hover:bg-orange-50 text-gray-500',
        color: 'orange'
    },
    {
        id: RESOURCES.WATER,
        label: 'Water',
        icon: Droplet,
        activeBg: 'bg-cyan-500 text-white shadow-md',
        inactiveBg: 'hover:bg-cyan-50 text-gray-500',
        color: 'cyan'
    },
    {
        id: RESOURCES.SOLAR,
        label: 'Solar',
        icon: Sun,
        activeBg: 'bg-amber-500 text-white shadow-md',
        inactiveBg: 'hover:bg-amber-50 text-gray-500',
        color: 'amber'
    },
];

export const getResourceById = (id) => RESOURCE_CONFIG.find(r => r.id === id);

export const getStatusColor = (status) => {
    switch (status) {
        case 'Active': return 'text-emerald-500';
        case 'Inactive': return 'text-amber-500';
        case 'Deactivated':
        case 'Deactive': return 'text-red-500';
        default: return 'text-gray-500';
    }
};

export const getStatusBgColor = (status) => {
    switch (status) {
        case 'Active': return 'bg-emerald-100 text-emerald-700';
        case 'Inactive': return 'bg-amber-100 text-amber-700';
        case 'Deactivated':
        case 'Deactive': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};
