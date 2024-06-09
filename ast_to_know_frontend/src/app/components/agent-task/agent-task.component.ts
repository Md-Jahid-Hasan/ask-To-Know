import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AgentService} from "../../services/agent.service";
import moment from 'moment';
import {formatDate, NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-agent-task',
    standalone: true,
    imports: [FormsModule, NgForOf, NgIf],
    templateUrl: './agent-task.component.html',
    styleUrl: './agent-task.component.css'
})
export class AgentTaskComponent implements OnInit {
    question_id: string | null = null
    question: any = undefined
    answer: string = ""

    constructor(private activeRoute: ActivatedRoute, private agent_service: AgentService) {
        this.activeRoute.params.subscribe(value => {
            this.question_id = value['id']
        })
    }

    getTimeDifference(time:string){
        return moment(time).fromNow()
    }

    ngOnInit(): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.agent_service.getSingleQuestion(this.question_id).subscribe(
                value => {
                    this.question = value;
                    this.answer = value && value.answer
                    // value && this.answer=value.answer;
                    // if (value){
                    //     this.answer = value
                    // }
                }
            )
        }
    }

    saveAnswer(){
        if (this.answer){
            this.agent_service.answerQuestion(this.question_id, {answer: this.answer}).subscribe(
                value => console.log(value)
            )
        }
    }


    protected readonly formatDate = formatDate;
    protected readonly moment = moment;
}
