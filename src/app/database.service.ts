import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


interface Token {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  getPreferencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/preferencias`);
  }
  getlistas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listas`);
  }
  
  guardarPreferencias(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/preferencias`, userData);
  }
  
   // Método para verificar si ya existen preferencias para un idprofile
   checkPreferenciasExist(idProfile: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/preferencias/${idProfile}/exists`);
  }

  getPreferenciasByIdProfile(idProfile: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/preferencias/${idProfile}`);
  }

  getCorreosByPreferencia(preferencia: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/preferencias/${preferencia}/email`);
  }

  guardarTokenFCM(userid: string, token: string): Observable<any> {
    const data ={userid,token};
    return this.http.post<any>(`${this.baseUrl}/notification-permission`, data);
  }

  getTokensByPreferencia(preferencia: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/token/${preferencia}/tokens`);
  }

  
  // getUsersWithNotificationPermission(): Observable<string[]> {
  //   return this.http.get<string[]>(`${this.baseUrl}/notification-permission/users`);
  // }
}

