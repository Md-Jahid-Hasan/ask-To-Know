import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AgentService {

    constructor(private http: HttpClient) {
    }

    getSingleQuestion(question_id:string|null): Observable<any> {
        let url = `api/question/client-answer/${question_id}/`
        return this.http.get<any>(url)
    }
}
