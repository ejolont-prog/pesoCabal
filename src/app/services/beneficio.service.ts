import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta, DetalleCuenta } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private API_URL = 'http://localhost:8082/api/beneficio';

  constructor(private http: HttpClient) {}

  // 1. Listar todas las cuentas (Bandeja Principal filtrada en DB)
  listarCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.API_URL}/cuentas`);
  }

  // 2. Listar parcialidades de una cuenta
  listarDetalles(noCuenta: string): Observable<DetalleCuenta[]> {
    return this.http.get<DetalleCuenta[]>(`${this.API_URL}/cuentas/${noCuenta}/detalles`);
  }

  // 3. Registrar peso en báscula física (Paso 3 del CU)
  registrarPeso(idDetalle: number, peso: number): Observable<any> {
    return this.http.post(`${this.API_URL}/detalles/${idDetalle}/pesar`, { peso });
  }

  // 4. Generar Boleta de control (Paso 4 del CU)
  generarBoleta(idDetalle: number, usuarioLogueado: string): Observable<any> {
    const headers = new HttpHeaders().set('X-User-Logged', usuarioLogueado);
    return this.http.post(`${this.API_URL}/detalles/${idDetalle}/boleta`, {}, { headers });
  }
}
