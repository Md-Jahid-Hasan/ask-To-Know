import { Component, OnInit } from '@angular/core';
import {UserQuestionsComponent} from "../user-questions/user-questions.component";
import {UserHomeSidepanelComponent} from "../user-home-sidepanel/user-home-sidepanel.component";
import {UserHomeService} from "../../services/user-home.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-user-home',
  standalone: true,
    imports: [
        UserQuestionsComponent,
        UserHomeSidepanelComponent,
        FormsModule,
        NgForOf
    ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
    categories: any[] = []
    selected_category: string|null = null
    question:{question:string, category: number|null} = {
        question: "test",
        category: null
    }

    constructor(private user_home: UserHomeService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined') {
            console.log("testeing")
            this.user_home.getAllCategory().subscribe(categories => this.categories = categories)
        }
    }

    selectCategory(category: {id:number, name:string}) {
        this.question.category = category.id
        this.selected_category = category.name
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
