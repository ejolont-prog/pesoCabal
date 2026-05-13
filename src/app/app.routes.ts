import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { LecturaQrComponent } from './components/lectura-qr/lectura-qr.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      // Esta es la ruta por defecto que mostrará las tarjetas
      { path: 'cuentas', component: CuentasComponent },
      { path: 'lectura-qr', component: LecturaQrComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
