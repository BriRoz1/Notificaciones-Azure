import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  apiUrl = 'http://localhost:4000/send-notification';

  constructor(private http: HttpClient) {}

  // getPreferencias() {
  //   return this.http.get<any[]>(`${this.baseUrl}/preferencias`);
  // }

  // buscarPreferencias(texto: string) {
  //   return this.http.get<any[]>(`${this.baseUrl}/preferencias/buscar?texto=${texto}`);
  // }

  // enviarNotificaciones(preferencias: any[], frecuencia: string) {
  //   return this.http.post<any>(`${this.baseUrl}/notificaciones`, { preferencias, frecuencia });
  // }

  sendNotification(token: string, title: string, body: string): Observable<any> {
    const payload = { token, title, body };
    return this.http.post<any>(this.apiUrl, payload);
  }

  sendNotifications(tokens: string[], title: string, body: string): Observable<any> {
    const payload = { tokens, title, body };
    return this.http.post<any>(`${this.apiUrl}/bulk`, payload);
  }
}

