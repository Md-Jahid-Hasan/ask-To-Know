import {Component, OnInit} from '@angular/core';
import {PaginationComponent} from "../pagination/pagination.component";
import {UserHomeService} from "../../services/user-home.service";
import {Question} from "../../services/Question";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {FormsModule} from "@angular/forms";
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzPopconfirmDirective, NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

@Component({
    selector: 'app-agent-home',
    standalone: true,
    imports: [
        PaginationComponent,
        NgForOf,
        RouterLink,
        NgIf,
        PaginationComponent, NzSwitchModule, FormsModule, NzPopconfirmDirective
    ],
    templateUrl: './agent-home.component.html',
    styleUrl: './agent-home.component.css'
})
export class AgentHomeComponent implements OnInit{
    agent_status:boolean = true;
    status_loading: boolean = false;

    questions: any = []
    current_page: number = 1
    total_pages: number = 1

    constructor(private user_home: UserHomeService, private nzMessageService: NzMessageService) {
    }

    cancel(): void {
        this.status_loading = false
        this.nzMessageService.info('click cancel', {nzAnimate: true });
    }

    confirm(): void {
        this.agent_status = !this.agent_status
        this.status_loading = false
        this.nzMessageService.info('click confirm');
    }

    changingStatus(){
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
}
