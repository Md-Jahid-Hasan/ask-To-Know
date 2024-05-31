import { Component } from '@angular/core';
import {PaginationComponent} from "../pagination/pagination.component";

@Component({
  selector: 'app-agent-home',
  standalone: true,
    imports: [
        PaginationComponent
    ],
  templateUrl: './agent-home.component.html',
  styleUrl: './agent-home.component.css'
})
export class AgentHomeComponent {

}
