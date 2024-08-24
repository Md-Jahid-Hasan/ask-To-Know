import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../pagination/pagination.component";
import {UserHomeService} from "../../services/user-home.service";
import {QuillViewHTMLComponent} from "ngx-quill";
import {NzRibbonComponent} from "ng-zorro-antd/badge";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {getTimeDifference} from "../common/time"
import {NzSpinComponent} from "ng-zorro-antd/spin";

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
        NzIconDirective,
        NzSpinComponent
    ],
    templateUrl: './user-questions.component.html',
    styleUrl: './user-questions.component.css'
})
export class UserQuestionsComponent implements OnInit {
    current_page: number = 1
    total_pages: number = 1
    isExpectedAnswerDelay: boolean = false
    is_loading: boolean = false

    constructor(private user_home: UserHomeService) {
    }

    ngOnInit() {
        this.current_page = this.user_home.question_current_page
        this.total_pages = this.user_home.question_total_page

        if (typeof window !== 'undefined' && window.localStorage && this.user_home.questions.length === 0) {
            this.current_page = 1
            this.user_home.question_current_page = 1
            this.paginatedData(this.current_page)
        }
    }

    getQuestions(){
        return this.user_home.questions
    }

    paginatedData(page_number: number) {
        this.is_loading = true
        this.current_page = page_number
        this.user_home.question_current_page = page_number
        this.user_home.getQuestions(`?page=${page_number}`).subscribe(questions => {
                this.user_home.questions = questions.results
                this.total_pages = Math.ceil(questions.count / 5)
                this.user_home.question_total_page = this.total_pages
                this.is_loading = false
            }
        )
    }

    getExpectedAnswerTime(time: string) {
        let expectedTime = this.getTimeDifference(time)
        if (new Date(time) > new Date()) {
            this.isExpectedAnswerDelay = false
            return "Expected answer " + expectedTime
        } else {
            this.isExpectedAnswerDelay = true
            return "Expected answer " + expectedTime
        }
    }

    protected readonly getTimeDifference = getTimeDifference;
}
