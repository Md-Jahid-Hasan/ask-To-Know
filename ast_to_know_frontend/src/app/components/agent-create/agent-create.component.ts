import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {debounceTime, Subject} from "rxjs";
import {UserService} from "../../services/user.service";

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
export class AgentCreateComponent implements OnInit{
    username_validate_status: string = "";
    username_subject = new Subject();
    user_details:{name:string, username:string, email:string} = {name:"", username:"", email:""};

    agent_create_modal_loading: boolean = false;
    @Input() is_visible: boolean= true;

    @Output() close_create_agent_from_parent = new EventEmitter();

    constructor(private user_service: UserService) {}

    ngOnInit() {
        this.username_subject.pipe(
            debounceTime(1500)
        ).subscribe(value => {
            this.username_validate_status = "validating"
            this.user_service.checkUniqueUsername(value).subscribe(response => {
                if (response.is_unique == true){
                    this.username_validate_status = "success"
                }
                else {
                    this.username_validate_status = "error"
                }
            })
        })
    }

    handleOk(){
        // TODO create backend for agent create
    }

    handleCancel(){
        this.is_visible = false
        this.close_create_agent_from_parent.emit()
    }

     validateUsername(value: string) {
        this.username_validate_status = "validating"
        this.username_subject.next(value)
    }
}
