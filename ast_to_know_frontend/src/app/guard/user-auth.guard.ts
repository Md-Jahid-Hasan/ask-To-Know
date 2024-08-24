import {jwtDecode} from "jwt-decode";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const userAuthGuard = () => {
    const router = inject(Router)
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token')
        if (token) {
            let decodeToken:any = jwtDecode(token)
            const isExpired = decodeToken && decodeToken.exp ? decodeToken.exp < Date.now() / 1000 : false

            if (isExpired) {
                // Can be implemented to refresh access token logic here
                localStorage.removeItem('token')
                router.navigate(['/admin'])
                return false
            } else if (decodeToken.admin){
                router.navigate(['/agent'])
                return false
            }
            else return true
        } else {
            router.navigate(['/login'])
            return false
        }
    } else return false
}
