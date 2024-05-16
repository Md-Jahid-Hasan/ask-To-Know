import {Component} from '@angular/core';
import {QuillEditorComponent, QuillModule } from "ngx-quill";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-agent-task',
    standalone: true,
    imports: [
        FormsModule, QuillModule, QuillEditorComponent
    ],
    templateUrl: './agent-task.component.html',
    styleUrl: './agent-task.component.css'
})
export class AgentTaskComponent {
    answer: string = "";
}
