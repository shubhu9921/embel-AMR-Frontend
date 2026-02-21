
export const ISSUE_TYPES = [
    { id: 'Devices', label: 'Devices' },
    { id: 'Meters', label: 'Meters' },
    { id: 'Billing', label: 'Billing' },
    { id: 'Reports', label: 'Reports' },
    { id: 'Dashboard', label: 'Dashboard' },
    { id: 'Other', label: 'Other Issues' }
];

export const TICKET_STATUS = {
    PENDING: 'Pending',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved'
};

export const TICKET_PRIORITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
};

export const initialTickets = [
    {
        id: 'TKT-1001',
        userId: 'User1',
        userName: 'Sarah Miller',
        issueType: 'Billing',
        title: 'Incorrect Billing Amount',
        description: 'My energy bill for Jan is 20% higher than expected.',
        source: 'Energy',
        status: TICKET_STATUS.RESOLVED,
        priority: TICKET_PRIORITY.LOW,
        createdAt: '2026-02-15T10:00:00Z',
        assignedTo: 'Support Eng A'
    },
    {
        id: 'TKT-1002',
        userId: 'User1',
        userName: 'Sarah Miller',
        issueType: 'Devices',
        title: 'Energy Meter Offline',
        description: 'The energy meter EM-001 is not sending data.',
        source: 'Energy',
        deviceId: 'EM-001',
        status: TICKET_STATUS.IN_PROGRESS,
        priority: TICKET_PRIORITY.MEDIUM,
        createdAt: '2026-02-20T14:30:00Z',
        assignedTo: 'Support Eng B'
    },
    {
        id: 'TKT-1003',
        userId: 'User2',
        userName: 'Michael Chen',
        issueType: 'Meters',
        title: 'Water Meter Leak Error',
        description: 'Receiving continuous leakage alerts even when everything is shut.',
        source: 'Water',
        status: TICKET_STATUS.PENDING,
        priority: TICKET_PRIORITY.HIGH,
        createdAt: '2026-02-21T09:15:00Z',
    }
];
