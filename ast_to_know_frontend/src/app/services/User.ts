export interface User {
    name: string,
    email: string,
    phone_number: string,
    is_staff: boolean,
    role: string,
    password?: string,
    confirm_password?: string
}

export interface UserDetails {
    name: string,
    email: string,
    is_staff: boolean,
    phone_number: string,
    role: string,
    id: number,
    username: string,
    admin_status?: boolean
}

export interface NewAgent {name:string, username:string, email:string}
