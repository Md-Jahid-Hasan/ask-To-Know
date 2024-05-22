import {Component, OnInit} from '@angular/core';
import {UserHomeService} from "../../services/user-home.service";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-user-home',
    standalone: true,
    imports: [
        NgForOf,
        FormsModule
    ],
    templateUrl: './user-home.component.html',
    styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
    categories: any[] = []
    question = {
        question: "",
        category: null
    }

    constructor(private user_home: UserHomeService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.user_home.getAllCategory().subscribe(categories => this.categories = categories)
        }
    }

    submitQuestion() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.user_home.createQuestion(this.question).subscribe(
                response => {
                    console.log(response)
                    this.question = {
                        question: "",
                        category: null
                    }
                })
        }
    }
}
