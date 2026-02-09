export interface Advisor {
    number: string;
    imageUrl?: string;
    name?: string;
}

export interface Settings {
    id?: string;
    advisors: Advisor[];
    updatedAt?: Date;
}
