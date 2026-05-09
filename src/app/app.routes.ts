import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { LecturaQrComponent } from './components/lectura-qr/lectura-qr.component';

export const routes: Routes = [
  // 1. Si el usuario no escribe nada, lo mandamos al dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // 2. Definimos la ruta del dashboard
  { path: 'dashboard', component: DashboardComponent },

  // 3. Definimos las otras rutas
  { path: 'cuentas', component: CuentasComponent },
  { path: 'lectura-qr', component: LecturaQrComponent },

  // 4. Comodín: si escriben cualquier otra cosa, que vuelvan al dashboard
  { path: '**', redirectTo: 'dashboard' }
];
