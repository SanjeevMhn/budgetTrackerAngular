import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { BaseLayout } from './layouts/base-layout/base-layout';
import { Statistics } from './statistics/statistics';
import { Wallet } from './wallet/wallet';
import { Profile } from './profile/profile';
import { Register } from './user/register/register';
import { authGuard } from './auth-guard';
import { Login } from './user/login/login';
import { loginGuard } from './login-guard';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayout,
    children: [
      { path: 'home', component: Dashboard },
      { path: 'statistics', component: Statistics },
      { path: 'wallet', component: Wallet },
      { path: 'profile', component: Profile },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
    canActivate: [authGuard]
  },
  { path: 'register/:step', component: Register },
  { path: 'register', component: Register },
  { path: 'login', component: Login, canActivate: [loginGuard] }
];
