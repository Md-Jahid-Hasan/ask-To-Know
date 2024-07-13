import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {UserHomeComponent} from "./components/user-home/user-home.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {UserService} from "./services/user.service";
import {NzFlexDirective} from "ng-zorro-antd/flex";
import {NzAlertComponent} from "ng-zorro-antd/alert";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, LoginComponent, UserCreateComponent, UserHomeComponent, NavbarComponent, NzFlexDirective, NzAlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ast_to_know_frontend';
  api_host: string = "http://127.0.0.1:8000/";

  constructor(private user_service: UserService) {
  }

  ngOnInit() {
      if (typeof window !== 'undefined' && window.localStorage) this.user_service.getLoginUser()
  }
}
