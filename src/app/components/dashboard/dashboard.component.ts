import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importaciones de Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Datos para las tarjetas de Peso Cabal
  productos = [
    { nombre: 'Pesaje', icon: 'history_edu', route: '/historial' },
    { nombre: 'QR', icon: 'qr_code', route: '/lectura-qr' },
    { nombre: 'Cuentas', icon: 'analytics', route: '/reportes' }
  ];

  // Eliminamos el AuthService del constructor
  constructor() {}

  cerrarSesion(): void {
    // Como no hay login, podemos simplemente recargar la app o redirigir al inicio
    console.log('Cerrando sesión simulado');
    window.location.href = '/';
  }
}
