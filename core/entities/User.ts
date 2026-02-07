export interface User {
    id?: string;
    name: string;
    email: string;
    password?: string; // Hashed
    role: 'admin' | 'user';
    createdAt?: Date;
}
