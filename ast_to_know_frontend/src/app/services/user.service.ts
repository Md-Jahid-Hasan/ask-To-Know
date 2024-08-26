import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserDetails} from "./User";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    currentUser:Subject<UserDetails> = new Subject<any>()

    constructor(private http: HttpClient) {}

    userLogin(user: { email: string, password: string }): Observable<any> {
        return this.http.post<any>("api/user/login/", user)
    }

    getLoginUser(){
        this.http.get<any>("api/user/").subscribe(res => this.currentUser.next(res))
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
