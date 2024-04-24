import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { HttpClient } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.css']
})
export class PreferenciasComponent {
  seleccionados: string[] = [];
  profile!: ProfileType;
  data: any[] = [];
  lista: any[] = [];

  constructor(private databaseService: DatabaseService, private http: HttpClient) { }

  ngOnInit() {
    this.getProfile();
    this.databaseService.getPreferencias()
      .subscribe(
        data => {
          this.data = data;
          console.log('Preferencias:', data);
        },
        error => {
          console.error('Error getting preferens:', error);
        }
      );
      this.databaseService.getlistas()
      .subscribe(
        lista => {
          this.lista = lista;
          console.log('Listas:', lista);
        },
        error => {
          console.error('Error getting listas:', error);
        }
      );
      

  }

  guardarPreferencias() {
    console.log('Preferencias seleccionadas:', this.seleccionados);
    const userData = {
      idprofile: this.profile?.id,
      name: this.profile?.givenName,
      email: this.profile?.userPrincipalName,
      preferencias: this.seleccionados
    };
    this.databaseService.guardarPreferencias(userData)
      .subscribe(
        response => {
          console.log('Datos guardados exitosamente:', response);
          // Puedes realizar acciones adicionales después de guardar los datos si es necesario
        },
        error => {
          console.error('Error al guardar datos:', error);
        }
      );
  }


  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
      });
  }

  onCheckboxChange(event: any) {
    const opcion = event.target.value;
    if (event.target.checked) {
      this.seleccionados.push(opcion);
    } else {
      const index = this.seleccionados.indexOf(opcion);
      if (index !== -1) {
        this.seleccionados.splice(index, 1);
      }
    }
  }
}
