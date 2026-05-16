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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { BeneficioService } from '../../services/beneficio.service';
import { Cuenta, DetalleCuenta } from '../../models/cuenta.model';
import Swal from 'sweetalert2';

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
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {

  columnasCuentas: string[] = ['noCuenta', 'agricultor', 'pesoTotal', 'parcialidades', 'fecha', 'estado', 'acciones'];
  columnasDetalles: string[] = ['idParcialidad', 'placa', 'cui', 'tipoMedida', 'pesoBascula', 'estadoControl', 'operaciones'];

  dataSourceCuentas: Cuenta[] = [];
  dataSourceFiltrado: Cuenta[] = [];
  dataSourceDetalles: DetalleCuenta[] = [];

  cargando: boolean = true;
  vistaDetalle: boolean = false;
  cuentaSeleccionada: string | null = null;
  filtroEstado: string = '';

  // 🚀 Modificado: Ahora se llena dinámicamente con los datos del Catálogo de la BD
  listaEstados: string[] = [];

  // Lista para almacenar las unidades de medida obtenidas del catálogo con ID 3
  listaUnidadesMedida: any[] = [];

  usuarioSesion: string = 'Usuario_PesoCabal_UMG';

  constructor(private beneficioService: BeneficioService) {}

  ngOnInit(): void {
    this.cargarTodoElFlujo();
  }

  // CORREGIDO: Se cambia a '==' para evitar fallos de tipo (string vs number) que provocaban el estado 'null'
  get cuentaActual(): Cuenta | undefined {
    return this.dataSourceCuentas.find(c => c.nocuenta == this.cuentaSeleccionada);
  }

  // 🚀 Nuevo: Orquesta la carga de catálogos secuencialmente antes de renderizar la tabla
  cargarTodoElFlujo() {
    this.cargando = true;

    // Step 1: Cargar estados de pesaje dinámicos del beneficio
    this.beneficioService.listarEstadosPesaje().subscribe({
      next: (estados: any[]) => {
        this.listaEstados = estados.map(e => e.detallecatalogo);
        // Step 2: Cargar unidades de medida
        this.cargarUnidadesMedidaCatalogo();
      },
      error: (err: any) => {
        console.error('Error al cargar catálogo dinámico de estados:', err);
        // Fallback clásico de emergencia si se cae el servicio de catálogos
        this.listaEstados = ['Pesaje iniciado', 'Pesaje finalizado'];
        this.cargarUnidadesMedidaCatalogo();
      }
    });
  }

  // Carga las unidades de medida desde la tabla catalogos donde idcatalogo = 3
  cargarUnidadesMedidaCatalogo() {
    this.beneficioService.listarCatalogosPorId(3).subscribe({
      next: (unidades: any[]) => {
        this.listaUnidadesMedida = unidades;
        // Step 3: Con catálogos listos, cargamos las cuentas
        this.cargarDatosCuentas();
      },
      error: (err: any) => {
        console.error('Error al cargar catalogo de unidades de medida:', err);
        this.cargarDatosCuentas();
      }
    });
  }

  cargarDatosCuentas() {
    this.cargando = true;
    this.beneficioService.listarCuentas().subscribe({
      next: (data) => {
        this.dataSourceCuentas = data;
        this.dataSourceFiltrado = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener cuentas:', err);
        this.cargando = false;
        Swal.fire('Error de Conexion', 'No se logro sincronizar con el modulo de pesaje.', 'error');
      }
    });
  }

  aplicarFiltrosGlobales(valorBusqueda: string): void {
    const termino = valorBusqueda ? valorBusqueda.toLowerCase().trim() : '';

    this.dataSourceFiltrado = this.dataSourceCuentas.filter(c => {
      const matchTexto = c.nocuenta.toLowerCase().includes(termino) ||
        (c.nitagricultor && c.nitagricultor.toLowerCase().includes(termino));
      const matchNombre = c.nombreagricultor && c.nombreagricultor.toLowerCase().includes(termino);

      // La evaluación ahora hace un match exacto con el string renderizado desde la base de datos
      const matchEstado = this.filtroEstado ? (c.estadonombre === this.filtroEstado) : true;

      return (matchTexto || matchNombre) && matchEstado;
    });
  }

  limpiarFiltros(input: HTMLInputElement) {
    input.value = '';
    this.filtroEstado = '';
    this.dataSourceFiltrado = this.dataSourceCuentas;
  }

  verDetalleCuenta(noCuenta: string) {
    this.cuentaSeleccionada = noCuenta;
    this.cargando = true;
    this.beneficioService.listarDetalles(noCuenta).subscribe({
      next: (detalles) => {
        this.dataSourceDetalles = detalles;
        this.vistaDetalle = true;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', 'No se pudo obtener el desglose de parcialidades.', 'error');
      }
    });
  }

  regresarABandeja() {
    this.vistaDetalle = false;
    this.cuentaSeleccionada = null;
    this.cargarTodoElFlujo();
  }

  // ACCIÓN PRINCIPAL: Registra en el flujo de la parcialidad e inserta en la tabla pesajecabal
  async abrirModalPeso(parcialidad: DetalleCuenta) {
    if (!this.cuentaActual) {
      Swal.fire('Accion Bloqueada', 'La cuenta asociada no se encuentra activa o su estado es invalido.', 'error');
      return;
    }

    let opcionesHtml = '';
    this.listaUnidadesMedida.forEach(u => {
      opcionesHtml += `<option value="${u.idopcioncatalogo}">${u.nombreopcion}</option>`;
    });

    if (opcionesHtml === '') {
      opcionesHtml = `<option value="1">Quintales</option>`;
    }

    const { value: formValues } = await Swal.fire({
      title: `Captura de Bascula — Parcialidad #${parcialidad.noparcialidad}`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p><b>Placa del Camion:</b> <span style="background:#eee; padding:3px 6px; border-radius:4px; font-family:monospace;">${parcialidad.placa}</span></p>

          <label style="font-weight: bold; margin-top: 12px; display:block;">Peso Obtenido:</label>
          <input id="swal-peso" class="swal2-input" type="number" step="0.01" style="width: 95%; margin-left:0; margin-top:5px;" placeholder="0.00">

          <label style="font-weight: bold; margin-top: 12px; display:block;">Tipo Medida de Peso (Catalogo):</label>
          <select id="swal-idUnidadMedida" class="swal2-input" style="width: 95%; margin-left:0; margin-top:5px; height: 50px; padding: 0 10px;">
            ${opcionesHtml}
          </select>

          <label style="font-weight: bold; margin-top: 12px; display:block;">Observaciones del Pesaje:</label>
          <textarea id="swal-observaciones" class="swal2-textarea" style="width: 95%; margin-left:0; margin-top:5px; height:80px; resize:none;" placeholder="Escriba comentarios sobre el pesaje..."></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar Peso',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const peso = (document.getElementById('swal-peso') as HTMLInputElement).value;
        const idUnidadMedida = (document.getElementById('swal-idUnidadMedida') as HTMLSelectElement).value;
        const observaciones = (document.getElementById('swal-observaciones') as HTMLTextAreaElement).value;

        if (!peso || isNaN(Number(peso)) || Number(peso) <= 0) {
          Swal.showValidationMessage('Debe ingresar una captura de peso numerico valido.');
          return false;
        }

        return {
          nocuenta: parcialidad.nocuenta,
          parcialidad: parcialidad.noparcialidad.toString(),
          pesoobtenido: Number(peso),
          idunidadmedida: Number(idUnidadMedida),
          observaciones: observaciones || ''
        };
      }
    });

    if (formValues) {
      this.cargando = true;

      this.beneficioService.registrarPeso(parcialidad.iddetallecuenta, formValues).subscribe({
        next: () => {
          this.cargando = false;
          Swal.fire('Exito', 'Se guardo el registro en pesajecabal y se actualizo la parcialidad.', 'success').then(() => {
            this.verDetalleCuenta(this.cuentaSeleccionada!);
          });
        },
        error: (err) => {
          this.cargando = false;
          Swal.fire('Accion Bloqueada', err?.error?.error || 'No es posible ingresar pesajes.', 'error');
        }
      });
    }
  }

  imprimirTicketBoleta(parcialidad: DetalleCuenta) {
    this.cargando = true;
    this.beneficioService.generarBoleta(parcialidad.iddetallecuenta, this.usuarioSesion).subscribe({
      next: (ticket: any) => {
        this.cargando = false;
        const fechaEmitida = new Date(ticket.fechaBoleta).toLocaleString('es-GT', { hour12: true });

        Swal.fire({
          title: 'Honorario de Bascula Emitido',
          html: `
            <div style="text-align: left; font-family: monospace; background: #fffdf2; padding: 12px; border: 1px dashed #444; font-size: 13px; line-height: 1.4; color: #000;">
              <h4 style="text-align:center; margin-top:0;">*** BOLETA DE BASCULA ***</h4>
              <p><b>FECHA BOLETA:</b> ${fechaEmitida}</p>
              <p><b>USUARIO EMISOR:</b> ${ticket.usuario}</p>
              <hr style="border-top: 1px dashed #444;">
              <p><b>NO. CUENTA:</b> #${ticket.cuenta}</p>
              <p><b>ID PESAJE:</b> ${ticket.idPesaje}</p>
              <p><b>ID PARCIALIDAD:</b> ${ticket.idParcialidad}</p>
              <hr style="border-top: 1px dashed #444;">
              <p><b>PLACA VEHICULO:</b> ${ticket.placa}</p>
              <p><b>CUI PILOTO:</b> ${ticket.cui}</p>
              <p style="font-size: 14px; font-weight:bold; margin-top:10px;">
                <b>PESO BASCULA:</b>
                <span style="background:#000; color:#fff; padding:1px 4px;">
                  ${ticket.pesoObtenido} ${ticket.tipoMedida || 'Quintales'}
                </span>
              </p>
            </div>
          `,
          confirmButtonText: 'Cerrar'
        });
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', err?.error?.error || 'No se pudo generar la boleta.', 'error');
      }
    });
  }
}
