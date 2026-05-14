import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta, DetalleCuenta } from '../models/beneficio.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {
  private API_URL = 'http://localhost:8082/api/beneficio';

  constructor(private http: HttpClient) {}

  // Listar todas las cuentas (Bandeja Principal)
  listarCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.API_URL}/cuentas`);
  }

  // Listar parcialidades de una cuenta
  listarDetalles(noCuenta: string): Observable<DetalleCuenta[]> {
    return this.http.get<DetalleCuenta[]>(`${this.API_URL}/cuentas/${noCuenta}/detalles`);
  }

  // Registrar peso en báscula
  registrarPeso(idDetalle: number, peso: number): Observable<any> {
    return this.http.post(`${this.API_URL}/detalles/${idDetalle}/pesar`, { peso });
  }
}
