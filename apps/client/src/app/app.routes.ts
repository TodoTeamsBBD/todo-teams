import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page.js';
import { SignUpPage } from './pages/sign-up-page/sign-up-page.js';
import { ToDoList } from './pages/to-do-list/to-do-list.js';
import { DashboardPage } from './pages/dashboard-page/dashboard-page.js';
import { TwoFactorAuthPage } from './pages/two-factor-auth-page/two-factor-auth-page.js';
import { TwoFactorVerify } from './pages/two-factor-verify/two-factor-verify.js';
import { authGuard } from './guards/auth-guard.js';
import { publicGuard } from './guards/public-guard.js';
import { AccessAdministratorPage } from './pages/access-administrator-page/access-administrator-page.js';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage, canActivate: [publicGuard]},
    { path: 'signup', component: SignUpPage, canActivate: [publicGuard]},
    { path: 'to-do-list', component: ToDoList, canActivate: [authGuard]},
    { path: 'dashboard', component: DashboardPage, canActivate: [authGuard]},
    { path: 'signup-2fa', component: TwoFactorAuthPage, canActivate: [authGuard]},
    { path: 'verify-2fa', component: TwoFactorVerify, canActivate: [authGuard]},
    { path: 'access-admin', component: AccessAdministratorPage, canActivate: [authGuard]},
];
