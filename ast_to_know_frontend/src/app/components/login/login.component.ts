import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzAlertComponent} from "ng-zorro-antd/alert";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        NzAlertComponent,
        NgIf
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    user_details = {
        email: "",
        password: "",
    }
    error_message: string | null = null

    constructor(private userService: UserService, private router: Router, private message: NzMessageService) {
    }

    onLogin() {
        // This method call when user press login button. This method call login api and store token in localstorage if valid.
        if (this.user_details.email == "" || this.user_details.password === "")
            alert("Valid Data not provided")
        else {
            this.userService.userLogin(this.user_details).subscribe(user_data => {
                    this.userService.currentUser.next(user_data.user)
                    localStorage.setItem('token', user_data.access)
                    this.router.navigate(["/"])
                },
                error => this.error_message = "No user found with this credentials")
        }
    }

    closeErrorMessage(){
        this.error_message = null
    }

    protected readonly console = console;
}
