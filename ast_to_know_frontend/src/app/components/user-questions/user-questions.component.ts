import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../pagination/pagination.component";
import {UserHomeService} from "../../services/user-home.service";
import {Question} from "../../services/Question";

@Component({
    selector: 'app-user-questions',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        PaginationComponent,
        RouterLink,
        NgForOf,
        NgIf
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

    paginatedData(page_number: number) {
        this.current_page = page_number
        this.user_home.getQuestions(`?page=${page_number}`).subscribe(
            questions => this.questions = questions.results
        )
    }
}
