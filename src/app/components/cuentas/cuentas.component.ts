import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

// Asegúrate de que estas rutas sean correctas según tu proyecto
import { BeneficioService } from '../../services/beneficio.service';
import { Cuenta } from '../../models/cuenta.model';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  // 1. Definición de las columnas que pide el HTML
  columnas: string[] = ['noCuenta', 'agricultor', 'pesoTotal', 'parcialidades', 'fecha', 'estado', 'acciones'];

  // 2. Variables de datos
  dataSource: Cuenta[] = [];
  dataSourceFiltrado: Cuenta[] = [];

  // 3. Variables de estado y filtros
  cargando: boolean = true;
  filtroEstado: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  listaEstados: string[] = ['Pesaje Iniciado', 'Pesaje Finalizado', 'Cuenta Cerrada', 'Cuenta Confirmada'];

  constructor(private beneficioService: BeneficioService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.beneficioService.listarCuentas().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.dataSourceFiltrado = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  // 4. Método para filtrar (el que te daba error)
  aplicarFiltrosGlobales(busqueda: string) {
    this.dataSourceFiltrado = this.dataSource.filter(c => {
      const matchBusqueda = c.noCuenta.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nitagricultor.includes(busqueda);
      const matchEstado = this.filtroEstado ? (this.getEstadoNombre(c.idEstadoPesaje) === this.filtroEstado) : true;
      return matchBusqueda && matchEstado;
    });
  }

  // 5. Método para limpiar filtros
  limpiarFiltros(input: HTMLInputElement) {
    input.value = '';
    this.filtroEstado = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.dataSourceFiltrado = this.dataSource;
  }

  // 6. Método para obtener el nombre del estado
  getEstadoNombre(id: number): string {
    return id === 27 ? 'Pesaje Iniciado' : 'Pendiente';
  }

  // 7. Método para cambiar el estado desde el menú
  cambiarEstado(cuenta: Cuenta, nuevoEstado: string) {
    console.log(`Cambiando cuenta ${cuenta.noCuenta} a ${nuevoEstado}`);
    // Aquí puedes agregar la lógica para llamar al backend
  }
}
