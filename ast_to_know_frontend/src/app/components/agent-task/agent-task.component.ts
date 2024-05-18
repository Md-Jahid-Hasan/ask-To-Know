import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-agent-task',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './agent-task.component.html',
    styleUrl: './agent-task.component.css'
})
export class AgentTaskComponent {
    answer: string = "";
}
