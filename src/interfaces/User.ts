export interface User {
    id?: string;
    first_name: string;
    last_name: string;
    avatar: string;
    email: string;
    password: string;
}

export function instanceOfUser(object: any): object is User {
    return 'member' in object;
}