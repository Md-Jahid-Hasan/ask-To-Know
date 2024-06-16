import {Component, OnInit} from '@angular/core';
import {formatDate, NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../pagination/pagination.component";
import {UserHomeService} from "../../services/user-home.service";
import moment from 'moment';
import {Question} from "../../services/Question";
import {QuillViewHTMLComponent} from "ngx-quill";
import {NzRibbonComponent} from "ng-zorro-antd/badge";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
    selector: 'app-user-questions',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        PaginationComponent,
        RouterLink,
        NgForOf,
        NgIf,
        QuillViewHTMLComponent,
        NzRibbonComponent,
        NzTagComponent,
        NzIconDirective
    ],
    templateUrl: './user-questions.component.html',
    styleUrl: './user-questions.component.css'
})
export class UserQuestionsComponent implements OnInit {
    questions: Question[] = []
    current_page: number = 1
    total_pages: number = 1

    constructor(private user_home: UserHomeService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.current_page = 1
            this.user_home.getQuestions().subscribe(questions => {
                    this.questions = questions.results
                    this.total_pages = Math.ceil(questions.count/5)
                }
            )
        }
    }

    getTimeDifference(time: string) {
        return moment(time).fromNow()
    }

    paginatedData(page_number: number) {
        this.current_page = page_number
        this.user_home.getQuestions(`?page=${page_number}`).subscribe(
            questions => this.questions = questions.results
        )
    }

    protected readonly formatDate = formatDate;
}
