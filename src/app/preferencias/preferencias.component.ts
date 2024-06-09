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
  filteredList: any[] = []; // Lista filtrada para el buscador
  guardandoPreferencias: boolean = false;

  constructor(private databaseService: DatabaseService, private http: HttpClient) { }

  ngOnInit() {
  
    this.getProfile()
      .then(idprofile => {
        if (idprofile) {
          // Obtener las preferencias del idprofile actual
          this.databaseService.getPreferenciasByIdProfile(idprofile)
            .subscribe(
              data => {
                this.data = data;
                console.log('Preferencias:', data);
              },
              error => {
                console.error('Error getting preferencias:', error);
              }
            );
        } else {
          console.error('No se pudo obtener el idprofile del perfil.');
        }

  
      })
      .catch(error => {
        console.error('Error al obtener el idprofile:', error);
      });
 

    
      this.databaseService.getlistas()
      .subscribe(
        lista => {
          this.lista = lista;
          this.filteredList = lista;
          console.log('Listas:', lista);
        },
        error => {
          console.error('Error getting listas:', error);
        }
      );
      

  }

    // Método para filtrar la lista de preferencias según el texto de búsqueda
    filterPreferences(searchText: string) {
      this.filteredList = this.lista.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
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

    // Verificar si ya existen preferencias para el idprofile actual
    this.databaseService.checkPreferenciasExist(userData.idprofile)
      .subscribe(
        exists => {
          if (exists) {
            // Si ya existen preferencias, actualizamos en lugar de insertar
            this.databaseService.guardarPreferencias(userData)
              .subscribe(
                response => {
                  console.log('Datos actualizados exitosamente:', response);
                },
                error => {
                  console.error('Error al actualizar datos:', error);
                }
              );
          } else {
            // Si no existen preferencias, insertamos
            this.databaseService.guardarPreferencias(userData)
              .subscribe(
                response => {
                  console.log('Datos guardados exitosamente:', response);
                },
                error => {
                  console.error('Error al guardar datos:', error);
                }
              );
          }
        },
        error => {
          console.error('Error al verificar preferencias:', error);
        }
      );
  }




  async getProfile(): Promise<string | undefined> {
    try {
      const profile: any = await this.http.get(GRAPH_ENDPOINT).toPromise();
      this.profile = profile;
      console.log('perfil', this.profile.id);
      return this.profile.id;
    } catch (error) {
      console.error('Error getting profile:', error);
      return undefined;
    }
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

  extractContent(preferencia: string): string[] {
    try {
      const parsed = JSON.parse(preferencia);
      if (Array.isArray(parsed)) {
        return parsed;
      } else {
        return [parsed];
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [preferencia]; // Si hay un error, devuelve la cadena original en un array
    }
  }
}
