import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserHomeService} from "../../services/user-home.service";
import {Question} from "../../services/Question";

@Component({
    selector: 'app-user-questions',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        NgForOf,
        NgIf
    ],
    templateUrl: './user-questions.component.html',
    styleUrl: './user-questions.component.css'
})
export class UserQuestionsComponent implements OnInit{
    questions: Question[] = []

    constructor(private user_home: UserHomeService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.user_home.getQuestions().subscribe(questions => this.questions = questions.results)
        }
    }
}
