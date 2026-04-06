import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    // IMPORTANTE: La ruta ahora coincide con la carpeta que creaste
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
