export interface Attendance {
    userId: string;
    date: string;
    status: 'present' | 'absent';
}

export interface User {
    id: string;
    name: string;
    username?: string;
}