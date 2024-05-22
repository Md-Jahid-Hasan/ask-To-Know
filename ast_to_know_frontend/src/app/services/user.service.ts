import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) {
    }

    userLogin(user: { email: string, password: string }): Observable<any> {
        return this.http.post<any>("api/user/login/", user)
    }
}
