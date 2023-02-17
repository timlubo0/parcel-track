export interface User{
    id?: number;
    uuid?: string;
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    accessToken?: string;
    roleId?: number;
    role?: {id: number; uid: number; name: string; slug: string};
    customerId?: number;
}

export interface Preferences{
    language?: string
}