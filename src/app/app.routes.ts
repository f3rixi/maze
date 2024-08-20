import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'maze',
    loadComponent: () => import('./search/search.component'),
  },
  {
    path: '',
    redirectTo: 'maze',
    pathMatch: 'full',
  },
];
