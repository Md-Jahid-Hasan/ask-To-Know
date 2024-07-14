import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NewAgent} from "./User";

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

    answerQuestion(question_id:string|null, question:object): Observable<any> {
        let url = `api/question/client-answer/${question_id}/`
        return this.http.patch<any>(url, question)
    }

    updateAgentStatus(status:number){
        return this.http.get<any>(`api/user/agent/?status=${status}`)
    }

    createNewAgent(agent_details:NewAgent){
        return this.http.post<any>('api/user/agent/', agent_details)
    }
}
