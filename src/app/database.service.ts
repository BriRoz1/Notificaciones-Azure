import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  getPreferencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/preferencias`);
  }
  
}
