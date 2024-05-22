import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    user_details = {
        email: "",
        password: "",
    }

    constructor(private userService: UserService, private router: Router) {
    }

    onLogin() {
        // This method call when user press login button. This method call login api and store token in localstorage if valid.
        if (this.user_details.email == "" || this.user_details.password === "")
            alert("Valid Data not provided")
        else{
            this.userService.userLogin(this.user_details).subscribe(user_data => {
                    localStorage.setItem('token', user_data.access)
                    this.router.navigate(["/"])
                },
                error => console.log(error.error))
        }
    }

}
