import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AgentService} from "../../services/agent.service";
import {Question} from "../../services/Question";

@Component({
    selector: 'app-agent-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './agent-task.component.html',
    styleUrl: './agent-task.component.css'
})
export class AgentTaskComponent implements OnInit{
    question_id:string|null = null
    question:Question|null = null
    answer:string = ""

    constructor(private activeRoute: ActivatedRoute, private agent_service: AgentService) {
        this.activeRoute.params.subscribe(value => {
            this.question_id = value['id']
        })
    }

    ngOnInit(): void {
         if (typeof window !== 'undefined' && window.localStorage) {
             this.agent_service.getSingleQuestion(this.question_id).subscribe(
                 value => this.question=value
             )
         }
    }


}
