import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";
import {User} from "../../services/User";
import {FormsModule} from "@angular/forms";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        NzColDirective,
        NzFormControlComponent,
        NzInputDirective
    ],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    user_data: any = null
    updated_data: any = {};
    password_validate_status = ""

    constructor(private userService: UserService) {}

    ngOnInit() {
        if (typeof window !== 'undefined') {
            this.userService.getLoginUser().subscribe(user => {
                this.user_data = user
            })
        }
    }

    updateData() {
        if (Object.keys(this.updated_data).length) {
            if (this.updated_data.password == "") {
                delete this.updated_data.password
                delete this.updated_data.confirm_password
            }
            this.userService.updateUser(this.updated_data, this.user_data.id).subscribe(response => {
                console.log(response)
            })
        } else {
            console.log("No data updated. ")
        }
    }

    handleUpdateData(event:any){
        this.user_data[event.target.name] = event.target.value
        this.updated_data[event.target.name] = event.target.value
    }

    handlePasswordValidateStatus(event:any){
        if (this.user_data.password === this.user_data.confirm_password) {
            this.password_validate_status = ""
        }
        else {
            this.password_validate_status = "error"
        }
    }
}
