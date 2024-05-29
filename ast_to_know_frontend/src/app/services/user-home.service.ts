import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserHomeService {

    constructor(private http: HttpClient) {}

    getAllCategory(): Observable<any> {
        return this.http.get<any>("api/question/category/")
    }

    createQuestion(question:any): Observable<any> {
        return this.http.post<any>("api/question/list/", question)
    }
}