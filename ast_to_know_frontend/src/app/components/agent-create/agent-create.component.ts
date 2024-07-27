import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {debounceTime, Subject} from "rxjs";
import {UserService} from "../../services/user.service";
import {NewAgent} from "../../services/User";
import {AgentService} from "../../services/agent.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
    selector: 'app-agent-create',
    standalone: true,
    imports: [
        NzModalModule,
        NzFormDirective,
        NzFormItemComponent,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzInputDirective,
        ReactiveFormsModule,
        NzColDirective,
        NzFlexDirective,
        NzRowDirective,
        FormsModule
    ],
    templateUrl: './agent-create.component.html',
    styleUrl: './agent-create.component.css'
})
export class AgentCreateComponent implements OnInit {
    username_validate_status: string = "";
    name_validate_status: string = "";
    email_validate_status: string = "";

    username_subject = new Subject();
    user_details: NewAgent = {name: "", username: "", email: ""};

    agent_create_modal_loading: boolean = false;
    @Input() is_visible: boolean = true;

    @Output() close_create_agent_from_parent = new EventEmitter();

    constructor(private user_service: UserService, private agent_service: AgentService, private message: NzMessageService) {
    }

    ngOnInit() {
        this.username_subject.pipe(
            debounceTime(1500)
        ).subscribe(value => {
            this.username_validate_status = "validating"
            this.user_service.checkUniqueUsername(value).subscribe(response => {
                if (response.is_unique == true) {
                    this.username_validate_status = "success"
                } else {
                    this.username_validate_status = "error"
                }
            })
        })
    }

    handleOk() {
        let input_email = this.user_details.email.split(" ").join("")
        let input_name = this.user_details.name.split(" ").join("")

        if (input_email == "") this.email_validate_status = "error"
        if (input_name == "") this.name_validate_status = "error"

        if (input_name != "" && input_email != "" && this.user_details.username != "") {
            this.agent_create_modal_loading = true
            this.agent_service.createNewAgent(this.user_details).subscribe(res => {
                if (res.success == true) this.message.success("New Agent successfully create")
                this.agent_create_modal_loading = false
                this.is_visible = false
                this.user_details = {name: "", username: "", email: ""}
                this.close_create_agent_from_parent.emit()
            }, error => {
                for (let property in error.error) {
                    this.message.error(error.error[property][0], {nzDuration: 5000})
                }
                this.agent_create_modal_loading = false
            })
        } else this.is_visible = true
    }

    handleCancel() {
        this.is_visible = false
        this.email_validate_status = ""
        this.name_validate_status = ""
        this.close_create_agent_from_parent.emit()
    }

    validateUsername(value: string) {
        this.username_validate_status = "validating"
        this.username_subject.next(value)
    }
}
