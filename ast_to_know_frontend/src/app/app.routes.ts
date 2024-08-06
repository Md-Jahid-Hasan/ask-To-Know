import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {AgentHomeComponent} from "./components/agent-home/agent-home.component";
import {UserHomeComponent} from "./components/user-home/user-home.component";
import {AgentTaskComponent} from "./components/agent-task/agent-task.component";
import {userAuthGuard} from "./guard/user-auth.guard";
import {adminGuard} from "./guard/admin.guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {PostFeedComponent} from "./components/post-feed/post-feed.component";

export const routes: Routes = [
    {path: '', component: PostFeedComponent, canActivate: [userAuthGuard]},
    {path: 'home', component: UserHomeComponent, canActivate: [userAuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: UserCreateComponent},
    {path: 'agent', component: AgentHomeComponent, canActivate:[adminGuard]},
    {path: 'task/:id', component: AgentTaskComponent, canActivate:[adminGuard]},
    {path: 'user', component: UserProfileComponent},
];
