import { Component } from '@angular/core';
import {UserQuestionsComponent} from "../user-questions/user-questions.component";
import {UserHomeSidepanelComponent} from "../user-home-sidepanel/user-home-sidepanel.component";

@Component({
  selector: 'app-user-home',
  standalone: true,
    imports: [
        UserQuestionsComponent,
        UserHomeSidepanelComponent
    ],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {

}
