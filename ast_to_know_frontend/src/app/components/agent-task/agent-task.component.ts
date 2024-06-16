import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AgentService} from "../../services/agent.service";
import moment from 'moment';
import {formatDate, NgForOf, NgIf} from "@angular/common";
import {QuillEditorComponent, QuillViewHTMLComponent} from "ngx-quill";
import {Question, Question_Attachments} from "../../services/Question";

import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzUploadComponent, NzUploadFile} from "ng-zorro-antd/upload";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzTagComponent} from "ng-zorro-antd/tag";


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
    selector: 'app-agent-task',
    standalone: true,
    imports: [FormsModule, NgForOf, NgIf, QuillEditorComponent, QuillViewHTMLComponent, NzButtonComponent, NzIconDirective, NzUploadComponent, NzFlexDirective, NzTagComponent],
    templateUrl: './agent-task.component.html',
    styleUrl: './agent-task.component.css'
})
export class AgentTaskComponent implements OnInit {
    fileList: NzUploadFile[] = [];
    question_id: string | null = null
    question: Question | null = null;
    answer: string = ""
    deleted_attachment:number[] = []

    constructor(private activeRoute: ActivatedRoute, private agent_service: AgentService) {
        this.activeRoute.params.subscribe(value => {
            this.question_id = value['id']
        })
    }

    getTimeDifference(time: string) {
        return moment(time).fromNow()
    }

    ngOnInit(): void {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.agent_service.getSingleQuestion(this.question_id).subscribe(
                value => {
                    this.question = value;
                    this.answer = value && value.answer
                    this.fileList = value.agent_attachments
                }
            )
        }
    }

    saveAnswer() {
        if (this.answer) {
            let data:any = new FormData()
            data.append("answer", this.answer)
            this.deleted_attachment.forEach(id => {
                data.append("deleted_attachments", id)
            })
            this.fileList.forEach(file => {
                !("id" in file) && data.append("question_attachments", file, file.name)
            })
            this.agent_service.answerQuestion(this.question_id, data).subscribe(
                value => console.log(value)
            )
        }
    }

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    deleteFile(file:NzUploadFile|Question_Attachments) {
        if ("id" in file){
            this.deleted_attachment.push(file.id)
        }
    }

    protected readonly formatDate = formatDate;
    protected readonly moment = moment;
    protected readonly modules = modules;
}
