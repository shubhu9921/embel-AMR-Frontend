import {
    LayoutDashboard,
    Droplet,
    Zap,
    Sun,
    Cpu,
    Users,
    FileText,
    CreditCard,
    Database,
    Bell,
    AlertCircle,
    HelpCircle,
    Settings,
    Flame,
    TrendingUp,
    MapPin
} from "lucide-react";

export const adminMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Water", icon: Droplet },
    { name: "Energy", icon: Zap },
    { name: "Solar", icon: Sun },
    { name: "Gas", icon: Flame },
    { name: "Locations", icon: MapPin },
    { name: "Devices", icon: Cpu },
    { name: "Users", icon: Users },
    { name: "Reports", icon: FileText },
    { name: "Billing", icon: CreditCard },
    { name: "Payloads", icon: Database },
    { name: "Alerts", icon: Bell },
    { name: "Issues", icon: AlertCircle },
    { name: "Support", icon: HelpCircle },
    { name: "Settings", icon: Settings }
];

export const userMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Gas", icon: Flame },
    { name: "Water", icon: Droplet },
    { name: "Energy", icon: Zap },
    { name: "Solar", icon: Sun },
    { name: "Locations", icon: MapPin },
    { name: "Billing", icon: CreditCard },
    { name: "Analysis", icon: TrendingUp },
    { name: "Alerts", icon: Bell },
    { name: "Issues", icon: AlertCircle },
    { name: "Support", icon: HelpCircle },
    { name: "Settings", icon: Settings }
];

export const domesticMenu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Usage", icon: TrendingUp },
    { name: "Billing", icon: CreditCard },
    { name: "Alerts", icon: Bell },
    { name: "Issues", icon: AlertCircle },
    { name: "Support", icon: HelpCircle },
    { name: "Settings", icon: Settings }
];
