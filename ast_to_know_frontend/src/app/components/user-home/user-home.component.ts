import {Component, OnInit} from '@angular/core';
import {UserQuestionsComponent} from "../user-questions/user-questions.component";
import {UserHomeSidepanelComponent} from "../user-home-sidepanel/user-home-sidepanel.component";
import {UserHomeService} from "../../services/user-home.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {File} from "node:buffer";
import {QuillEditorComponent} from "ngx-quill";

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'list': 'ordered'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],

        ['clean']
    ]
};

@Component({
    selector: 'app-user-home',
    standalone: true,
    imports: [
        UserQuestionsComponent,
        UserHomeSidepanelComponent,
        FormsModule,
        NgForOf,
        NgIf,
        QuillEditorComponent
    ],
    templateUrl: './user-home.component.html',
    styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
    categories: any[] = []
    searched_categories: any[] = []
    selected_category: string | null = null
    question: { question: string, category: number | null} = {
        question: "",
        category: null
    }
    attached_files: File[] = []

    constructor(private user_home: UserHomeService) {
    }

    ngOnInit() {
        if (typeof window !== 'undefined') {
            this.user_home.getAllCategory().subscribe(categories => {
                this.categories = categories
                this.searched_categories = categories
            })
        }
    }

    selectCategory(category: { id: number, name: string }) {
        this.question.category = category.id
        this.selected_category = category.name
    }

    selectFile(event: any) {
        this.attached_files.push(event.target.files[0])
    }

    deleteFile(file: File) {
        this.attached_files = this.attached_files.filter(f => f != file)
    }

    searchCategory(event: any) {
        let query = event.target.value
        if (query == "") this.searched_categories = this.categories
        else this.searched_categories = this.categories.filter(cat => cat.name.toLowerCase().includes(query))
    }

    submitQuestion() {
        if (typeof window !== 'undefined' && window.localStorage &&
            this.question.category != null && this.question.question != "") {
            let data:any = new FormData()
            data.append("question", this.question.question)
            data.append("category", this.question.category)
            this.attached_files.forEach(file => {
                data.append("question_attachments", file, file.name)
            })
            this.user_home.createQuestion(data).subscribe(
                response => {
                    this.question = {
                        question: "",
                        category: null
                    }
                    this.selected_category = null
                    this.attached_files = []
                })
        }
    }

    protected readonly modules = modules;
}
