import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {UserHomeComponent} from "./components/user-home/user-home.component";
import {NavbarComponent} from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, LoginComponent, UserCreateComponent, UserHomeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ast_to_know_frontend';
}
