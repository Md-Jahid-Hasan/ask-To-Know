import {Component, OnInit} from '@angular/core';
import {PaginationComponent} from "../pagination/pagination.component";
import {UserHomeService} from "../../services/user-home.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {FormsModule} from "@angular/forms";
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzPopconfirmDirective, NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {AgentService} from "../../services/agent.service";
import {NzRibbonComponent} from "ng-zorro-antd/badge";
import moment from "moment";

@Component({
    selector: 'app-agent-home',
    standalone: true,
    imports: [
        PaginationComponent,
        NgForOf,
        RouterLink,
        NgIf,
        PaginationComponent, NzSwitchModule, FormsModule, NzPopconfirmDirective, NzRibbonComponent
    ],
    templateUrl: './agent-home.component.html',
    styleUrl: './agent-home.component.css'
})
export class AgentHomeComponent implements OnInit {
    agent_status: boolean = true;
    status_loading: boolean = false;
    isExpectedAnswerDelay: boolean = false;

    questions: any = []
    current_page: number = 1
    total_pages: number = 1
    waiting_time_for_user = {
        hh: "0",
        mm: "0"
    }

    constructor(private user_home: UserHomeService, private nzMessageService: NzMessageService,
                private agent_service: AgentService) {
    }

    cancel(): void {
        this.status_loading = false
        this.nzMessageService.info('click cancel', {nzAnimate: true});
    }

    confirm(): void {
        this.agent_status = !this.agent_status
        this.status_loading = false
        this.nzMessageService.info('click confirm');
    }

    changingStatus() {
        this.status_loading = true
    }

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.current_page = 1
            this.user_home.getQuestions().subscribe(questions => {
                    this.questions = questions.results
                    this.total_pages = Math.ceil(questions.count / 5)
                }
            )
        }
    }

    paginatedData(page_number: number) {
        this.current_page = page_number
        this.user_home.getQuestions(`?page=${page_number}`).subscribe(
            questions => this.questions = questions.results
        )
    }

    setWaitingTimeForUser(question: any) {
        if (this.waiting_time_for_user.hh !== "0" || this.waiting_time_for_user.mm !== "0") {
            let total_minutes = (parseInt(this.waiting_time_for_user.hh) * 60 + parseInt(this.waiting_time_for_user.mm))
            let expected_answer_at = new Date(new Date().getTime() + total_minutes * 60000)
            question.expected_answer_at = expected_answer_at
            // let question_data = {expected_answer_at: new Date(new Date().getTime() + total_minutes*60000)}
            this.agent_service.answerQuestion(question.id, {expected_answer_at: expected_answer_at}).subscribe(res => {
                this.waiting_time_for_user.hh = "0"
                this.waiting_time_for_user.mm = "0"
            })
        }
    }

    getTimeDifference(time: string) {
        return moment(time).fromNow()
    }

    getExpectedAnswerTime(time: string) {
        let expectedTime = this.getTimeDifference(time)
        if (new Date(time) > new Date()) {
            this.isExpectedAnswerDelay = false
            return "Answer within " + expectedTime
        } else {
            this.isExpectedAnswerDelay = true
            return "Answer " + expectedTime
        }
    }
}
