import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";
import {AgentCreateComponent} from "../agent-create/agent-create.component";
import {PostFeedService} from "../../services/post-feed.service";

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
    is_admin: boolean|null = null;
    user_role: string = ""
    is_create_agent_open: boolean = false;

    constructor(private router: Router, private user_service: UserService, private post_feed: PostFeedService) {}

    doLogout() {
        if (typeof window !== 'undefined' && window.localStorage) {
            this.router.navigate(['/login'])
            localStorage.removeItem("token")
        }
    }

    ngOnInit() {
        this.user_service.currentUser.subscribe(user => {
            this.is_admin = user.is_staff
            this.user_role = user.role
        })
    }

    openCreateAgentModal(){
        this.is_create_agent_open = true
    }

    closeCreateAgentModal(){
        this.is_create_agent_open = false
    }

    openUserQuestionSection(){
        if (!this.is_admin) this.post_feed.user_question_visibility.next(true)
    }

}
