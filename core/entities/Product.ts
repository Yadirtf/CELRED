import { Brand } from './Brand';

export interface Product {
    id?: string; // Mongoose ID
    name: string;
    brand: string | Brand; // Reference to Brand ID or populated Brand object
    price: number;
    stock: number;
    description: string;
    imageUrl: string;
    specs?: {
        processor?: string;
        ram?: string;
        storage?: string;
        screen?: string;
        battery?: string;
        camera?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
