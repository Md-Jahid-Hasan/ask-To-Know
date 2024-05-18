import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {UserCreateComponent} from "./components/user-create/user-create.component";
import {AgentHomeComponent} from "./components/agent-home/agent-home.component";
import {UserHomeComponent} from "./components/user-home/user-home.component";
import {AgentTaskComponent} from "./components/agent-task/agent-task.component";
import {UserQuestionsComponent} from "./components/user-questions/user-questions.component";
import {UserQuestionDetailsComponent} from "./components/user-question-details/user-question-details.component";

export const routes: Routes = [
    {path: '', component: UserHomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: UserCreateComponent},
    {path: 'agent', component: AgentHomeComponent},
    {path: 'task/:id', component: AgentTaskComponent},
    {path: 'questions', component: UserQuestionsComponent},
    {path: 'question/:id', component: UserQuestionDetailsComponent},
];
