
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
        ticketId: 'TKT-1001',
        userName: 'Customer 1',
        mobile: '987XXXXX10',
        email: 'customer1@example.com',
        location: 'Site A',
        type: 'Alert',
        issueType: 'Alert',
        source: 'Water',
        description: 'Water leakage detected in Kitchen.',
        date: '2024-02-23',
        createdAt: '2024-02-23T08:30:00Z',
        status: TICKET_STATUS.PENDING,
        priority: TICKET_PRIORITY.HIGH
    },
    {
        id: 'TKT-1002',
        ticketId: 'TKT-1002',
        userName: 'Customer 2',
        mobile: '987XXXXX11',
        email: 'customer2@example.com',
        location: 'Site B',
        type: 'Issue',
        issueType: 'Issue',
        source: 'Energy',
        description: 'Meter not showing reading.',
        date: '2024-02-23',
        createdAt: '2024-02-23T10:00:00Z',
        status: TICKET_STATUS.IN_PROGRESS,
        priority: TICKET_PRIORITY.MEDIUM,
        assignedTo: 'Support Eng A'
    },
    {
        id: 'TKT-1003',
        ticketId: 'TKT-1003',
        userName: 'Customer 3',
        mobile: '987XXXXX12',
        email: 'customer3@example.com',
        location: 'Site C',
        type: 'Alert',
        issueType: 'Alert',
        source: 'Energy',
        description: 'High energy consumption on Production Floor.',
        date: '2024-02-22',
        createdAt: '2024-02-22T14:30:00Z',
        status: TICKET_STATUS.RESOLVED,
        priority: TICKET_PRIORITY.LOW,
        assignedTo: 'Support Eng B'
    },
    {
        id: 'TKT-1004',
        ticketId: 'TKT-1004',
        userName: 'Customer 4',
        mobile: '987XXXXX13',
        email: 'customer4@example.com',
        location: 'Site D',
        type: 'Issue',
        issueType: 'Issue',
        source: 'Water',
        description: 'No water supply in Kitchen.',
        date: '2024-02-23',
        createdAt: '2024-02-23T07:30:00Z',
        status: TICKET_STATUS.PENDING,
        priority: TICKET_PRIORITY.HIGH
    }
];

export const SUPPORT_ENGINEERS = [
    { id: 'eng1', name: 'Rahul Patil', email: 'rahul@support.com', phone: '9876543210', specialization: 'Energy Devices' },
    { id: 'eng2', name: 'Sanjay Kumar', email: 'sanjay@support.com', phone: '9876543211', specialization: 'Water Infrastructure' },
    { id: 'eng3', name: 'Anita Singh', email: 'anita@support.com', phone: '9876543212', specialization: 'Gas Supply' },
    { id: 'eng4', name: 'Vikram Rao', email: 'vikram@support.com', phone: '9876543213', specialization: 'Solar Panels' },
];
