import {Component} from '@angular/core';
import {PaginationComponent} from "../pagination/pagination.component";
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {FormsModule} from "@angular/forms";
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzPopconfirmDirective, NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

@Component({
    selector: 'app-agent-home',
    standalone: true,
    imports: [
        PaginationComponent, NzSwitchModule, FormsModule, NzPopconfirmDirective
    ],
    templateUrl: './agent-home.component.html',
    styleUrl: './agent-home.component.css'
})
export class AgentHomeComponent {
    agent_status:boolean = true;
    status_loading: boolean = false;

    cancel(): void {
        this.status_loading = false
        this.nzMessageService.info('click cancel', {nzAnimate: true });
    }

    confirm(): void {
        this.agent_status = !this.agent_status
        this.status_loading = false
        this.nzMessageService.info('click confirm');
    }

    changingStatus(){
        this.status_loading = true
    }

    constructor(private nzMessageService: NzMessageService) {
    }
}
