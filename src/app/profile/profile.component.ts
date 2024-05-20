import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../database.service';
import { pushService } from '../../app/services/push.service';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;
  tokenFCM: string = ''

  constructor(
    private http: HttpClient,
    private pushService: pushService,
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
    this.getProfile();

    
      // Escuchar mensajes FCM
  this.pushService.message$.subscribe(msg => {
    console.log('Mensaje FCM recibido:', msg);
    // Aquí puedes manejar el mensaje recibido
  });

  this.pushService.token$.subscribe(token => {
    this.tokenFCM = token; // Guardar el token en la variable del componente
    console.log('Token FCM recibido en NotificacionComponent:', token);
    this.guardarDatosEnBaseDeDatos();
  });

  
  }
  guardarDatosEnBaseDeDatos() {
  if (this.profile && this.profile.id && this.tokenFCM) {
    this.databaseService.guardarTokenFCM(this.profile.id, this.tokenFCM)
      .subscribe(response => {
        console.log('Datos guardados en la base de datos:', response);
      }, error => {
        console.error('Error al guardar datos en la base de datos:', error);
      });
  } else {
    console.error('No se pueden guardar los datos en la base de datos porque faltan el ID de perfil o el token FCM');
  }
}

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
        console.log('perfil', profile)
      });
  }



}