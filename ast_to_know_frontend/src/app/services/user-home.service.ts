import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "./CommonInterface";
import {Question} from "./Question";

@Injectable({
    providedIn: 'root'
})
export class UserHomeService {
    categories:Category[] = []
    questions: Question[] = []
    question_total_page: number = 1
    question_current_page: number = 1

    constructor(private http: HttpClient) {}

    getAllCategory(): Observable<any> {
        return this.http.get<any>("api/question/category/")
    }

    createQuestion(question:any): Observable<any> {
        return this.http.post<any>("api/question/list/", question)
    }

    getQuestions(query_params:string=""): Observable<any> {
        let url = "api/question/list/" + query_params
        return this.http.get<any>(url)
    }
}
