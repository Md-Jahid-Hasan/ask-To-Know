import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";
import {AgentCreateComponent} from "../agent-create/agent-create.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
    imports: [
        RouterLink,
        NgIf,
        AgentCreateComponent
    ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
    is_admin: boolean = false;
    is_create_agent_open: boolean = false;

    constructor(private router: Router, private user_service: UserService) {}

    doLogout() {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem("token")
            this.router.navigate(['/login'])
        }
    }

    ngOnInit() {
        this.user_service.currentUser.subscribe(user => this.is_admin=user.is_staff)
    }

    openCreateAgentModal(){
        this.is_create_agent_open = true
    }

    closeCreateAgentModal(){
        this.is_create_agent_open = false
    }

}
