import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page.js';
import { SignUpPage } from './pages/sign-up-page/sign-up-page.js';
import { ToDoList } from './pages/to-do-list/to-do-list.js';
import { DashboardPage } from './pages/dashboard-page/dashboard-page.js';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'signup', component: SignUpPage },
    { path: 'to-do-list', component: ToDoList },
    { path: 'dashboard', component: DashboardPage}
];
