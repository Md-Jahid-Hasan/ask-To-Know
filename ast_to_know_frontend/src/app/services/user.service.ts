import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {}

    userLogin(user: { email: string, password: string }): Observable<any> {
        return this.http.post<any>("api/user/login/", user)
    }

    getLoginUser():Observable<any>{
        return this.http.get<any>("api/user/")
    }

    updateUser(user:any, user_id:number):Observable<any>{
        return this.http.patch<any>(`api/user/update/${user_id}/`, user)
    }

    createUser(user:any): Observable<any>{
        return this.http.post<any>('api/user/create/', user)
    }

    checkUniqueUsername(username:any): Observable<any>{
        return this.http.get<any>(`api/user/username/?username=${username}`)
    }
}
