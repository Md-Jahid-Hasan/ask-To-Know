import {Component} from '@angular/core';
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../pagination/pagination.component";

@Component({
    selector: 'app-user-questions',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        PaginationComponent
    ],
    templateUrl: './user-questions.component.html',
    styleUrl: './user-questions.component.css'
})
export class UserQuestionsComponent {
    shadow: number = -1;

    addShadow(event: any, id: number) {
        this.shadow = event.type == "mouseover" ? id : -1;
    }
}
