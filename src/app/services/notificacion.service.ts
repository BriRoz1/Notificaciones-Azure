import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getPreferencias() {
    return this.http.get<any[]>(`${this.baseUrl}/preferencias`);
  }

  buscarPreferencias(texto: string) {
    return this.http.get<any[]>(`${this.baseUrl}/preferencias/buscar?texto=${texto}`);
  }

  enviarNotificaciones(preferencias: any[], frecuencia: string) {
    return this.http.post<any>(`${this.baseUrl}/notificaciones`, { preferencias, frecuencia });
  }
}
