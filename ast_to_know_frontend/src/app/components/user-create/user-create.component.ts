import {Component, OnInit} from '@angular/core';
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {Router, RouterLink} from "@angular/router";
import {NzFormControlComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {debounceTime, Subject} from "rxjs";

@Component({
    selector: 'app-user-create',
    standalone: true,
    imports: [
        NzRowDirective,
        RouterLink,
        NzFormControlComponent,
        NzColDirective,
        NzInputDirective,
        FormsModule
    ],
    templateUrl: './user-create.component.html',
    styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
    username_validate_status:string = ""
    password_validate_status:string = ""
    username_subject = new Subject()

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit() {
        this.username_subject.pipe(
            debounceTime(1500)
        ).subscribe(value => {
            this.username_validate_status = "validating"
            this.userService.checkUniqueUsername(value).subscribe(response => {
                if (response.is_unique == true){
                    this.username_validate_status = "success"
                }
                else {
                    this.username_validate_status = "error"
                }
            })
        })
    }

    user_details: any = {
        name: "", username: "", phone_number: "", password: "", confirm_password: ""
    }

    checkPasswordMatch(event: any) {
        if (this.user_details.password == this.user_details.confirm_password){
            this.password_validate_status = "success"
        } else {
            this.password_validate_status = "error"
        }
    }

    createUser() {
        if (this.username_validate_status == "success" && this.password_validate_status == "success") {
            if (this.user_details.name == "" || this.user_details.email == "" || this.user_details.phone_number == ""){
                console.log("Name, email or phone number can't be null")
            } else {
                this.userService.createUser(this.user_details).subscribe(res => {
                        if (res.success == true)
                            this.router.navigate(["/login"])
                    },
                    error => {
                        console.log(error.status)
                    }
                )
            }
        }
    }

    validateUsername(value: string) {
        this.username_validate_status = "validating"
        this.username_subject.next(value)
    }
}
