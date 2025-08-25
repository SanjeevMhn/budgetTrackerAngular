import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { BaseLayout } from './layouts/base-layout/base-layout';
import { Statistics } from './statistics/statistics';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayout,
    children: [
      { path: 'home', component: Dashboard },
      { path: 'statistics', component: Statistics },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
