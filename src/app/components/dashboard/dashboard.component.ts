import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from "../../auth/auth.service"; // Importamos el servicio

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
  productos = [
    { nombre: 'Pesaje', icon: 'history_edu', route: '/dashboard' },
    { nombre: 'QR', icon: 'qr_code', route: '/dashboard/lectura-qr' },
    { nombre: 'Cuentas', icon: 'analytics', route: '/dashboard/cuentas' }
  ];

  // SOLUCIÓN: Un solo constructor que inyecta ambos servicios
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Función para determinar si mostrar las tarjetas o el contenido hijo
  isHome(): boolean {
    return this.router.url === '/dashboard' || this.router.url === '/';
  }

  cerrarSesion(): void {
    // Ahora funciona porque authService ya está inyectado arriba
    this.authService.logout();
  }
}
