import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { BaseLayout } from './layouts/base-layout/base-layout';
import { Statistics } from './statistics/statistics';
import { Wallet } from './wallet/wallet';
import { Profile } from './profile/profile';
import { Register } from './user/register/register';

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
  },
  { path: 'register', component: Register },
];
