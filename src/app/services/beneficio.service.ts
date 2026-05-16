import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta, DetalleCuenta } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private apiUrl = 'http://localhost:8082/api/beneficio';

  constructor(private http: HttpClient) {}

  listarCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.apiUrl}/cuentas`);
  }

  // ✅ FIX 1: Ruta corregida a /cuentas/{noCuenta}/detalles
  listarDetalles(noCuenta: string): Observable<DetalleCuenta[]> {
    return this.http.get<DetalleCuenta[]>(`${this.apiUrl}/cuentas/${noCuenta}/detalles`);
  }

  registrarPeso(idDetalle: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalles/${idDetalle}/pesar`, payload);
  }

  // ✅ FIX 2: Ruta corregida a /detalles/{id}/boleta con header X-User-Logged
  generarBoleta(idDetalle: number, usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'X-User-Logged': usuario });
    return this.http.post<any>(`${this.apiUrl}/detalles/${idDetalle}/boleta`, {}, { headers });
  }

  // ✅ FIX 3: Usa apiUrl base en lugar de URL hardcodeada
  listarCatalogosPorId(idCatalogo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogos/${idCatalogo}`);
  }

  listarEstadosPesaje(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogos/estados-pesaje`);
  }
}
