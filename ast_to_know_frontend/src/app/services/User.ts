export interface User {
    name: string,
    email: string,
    phone_number: string,
    is_staff: boolean,
    role: string,
    password?: string,
    confirm_password?: string
}