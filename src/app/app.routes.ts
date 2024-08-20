import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component'),
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
];
