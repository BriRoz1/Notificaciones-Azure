import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion.service';



@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
  fechaFinal: Date = new Date();
  lista: any[] = [];
  filteredList: any[] = [];
  selectedOption: any;
  backupList: any[] = [];
  correos: string[] = [];
  selectedFontStyle: string = 'Arial';
  selectedFontSize: string = 'medium';

  tipoLetra: string = 'Arial';
  tamanoLetra: number = 14;
  colorTexto: string = '#000000';
  negrita: boolean = false;
  cursiva: boolean = false;
  centrado: boolean = false;

  destinatarios: string = '';
  asunto: string = '';
  cuerpo: string = '';
  frecuenciaEnvio: string = 'diaria';
  canalEnvio: string = 'email';


  tokens: string[] = [];


  token = 'e-ov_S2TyjHwFqyJqWe1fT:APA91bE8LJC2c4oSS38_lP2id0Ipnl5XcWSCOvrOa1Lb-lNgPAn16-fny3FPxr2_plzHVSjOfVx26Qd9ZbgMGYjSVlJoiCOsreksfknCiYypgjlPZY602fm1QErS53NX-O3KO1ruLuqb'; // Reemplaza esto con el token real
  title = 'Demon';
  body = 'Halo 2 vista';




  constructor(
    private databaseService: DatabaseService,
    private http: HttpClient,
    private notificationService: NotificacionService
  ) { }

  ngOnInit() {
    this.databaseService.getlistas()
      .subscribe(
        lista => {
          this.lista = lista;
          this.filteredList = lista;
          this.backupList = lista;
          console.log('Listas:', lista);
        },
        error => {
          console.error('Error getting listas:', error);
        }
      );

    
    
  }

  sendNotification() {
    this.notificationService.sendNotification(this.token, this.title, this.body)
      .subscribe(response => {
        console.log('Notification sent:', response);
      }, error => {
        console.error('Error sending notification:', error);
      });
  }

  // mostrarNotificacion() {
  //   this.pushService.showNotification('FECHAS DE ANTEPROYECTOS .', {
  //     body: 'Hola, revisa tu correo para consultar las fechas de anteproyectos',
  //   });
  //   console.log('Notificación enviada');
  // }

  enviarCorreo() {
    this.destinatarios = this.getEmails();
    const data = {
      destinatarios: this.destinatarios,
      asunto: this.asunto,
      cuerpo: this.cuerpo,
      frecuenciaEnvio: this.frecuenciaEnvio,
      canalEnvio: this.canalEnvio
    };

    console.log('Destinatarios', this.destinatarios);
    console.log('Asunto', this.asunto);
    console.log('Frecuencia', this.frecuenciaEnvio);
    console.log('CanalEnvio', this.canalEnvio);
    console.log('Fecha', this.fechaFinal);
    console.log('Cuerpo', this.cuerpo);

    this.http.post('URL_DE_TU_CLOUD_FUNCTION', data)
      .subscribe(response => {
        console.log('Correo enviado exitosamente:', response);
      }, error => {
        console.error('Error al enviar el correo:', error);
      });
  }

  onOptionChange(event: any) {
    console.log('Opción seleccionada:', this.selectedOption);
    this.databaseService.getCorreosByPreferencia(this.selectedOption)
      .subscribe(
        data => {
          this.lista = data;
          this.filteredList = data;
          console.log('Email:', data);
        },
        error => {
          console.error('Error getting listas:', error);
        }
      );
      this.databaseService.getTokensByPreferencia(this.selectedOption)
      .subscribe(
        tokens => {
          this.tokens = tokens;
          console.log('Tokens:', tokens);
        },
        error => {
          console.error('Error getting tokens:', error);
        }
      );
  }

  
  

  onModelChange(event: any) {
    this.filteredList = this.lista.filter(item => item.name === this.selectedOption);
  }

  getEmails(): string {
    const emails = this.filteredList.map(item => item.email).filter(email => !!email);
    return emails.join(', ');
  }

  




  applyFontStyle(): void {
    const textarea = document.querySelector('.form-control') as HTMLTextAreaElement;
    textarea.style.fontFamily = this.selectedFontStyle;
  }

  applyFontSize(): void {
    const textarea = document.querySelector('.form-control') as HTMLTextAreaElement;
    switch (this.selectedFontSize) {
      case 'small':
        textarea.style.fontSize = '12px';
        break;
      case 'medium':
        textarea.style.fontSize = '16px';
        break;
      case 'large':
        textarea.style.fontSize = '20px';
        break;
      default:
        textarea.style.fontSize = 'inherit';
        break;
    }
  }

  aplicarNegrita() {
    this.negrita = !this.negrita;
  }

  aplicarCursiva() {
    this.cursiva = !this.cursiva;
  }

  alinearTexto(alineacion: string) {
    this.centrado = alineacion !== 'left';
  }

  cambiarTamano(accion: string) {
    if (accion === 'aumentar') {
      this.tamanoLetra += 2;
    } else if (accion === 'disminuir' && this.tamanoLetra > 8) {
      this.tamanoLetra -= 2;
    }
  }

  adjuntarArchivo(event: any) {
    const archivo = event.target.files[0];
    // Manejar el archivo como desees
  }

  limpiarDestinatarios() {
    this.lista = this.backupList;
    this.filteredList = this.backupList;
    this.destinatarios = '';
    console.log('Valores limpiados exitosamente');
  }

  limpiarTodo() {
    this.lista = this.backupList;
    this.filteredList = this.backupList;
    this.destinatarios = '';
    this.asunto = '';
    this.cuerpo = '';
    this.frecuenciaEnvio = 'diaria';
    this.canalEnvio = 'email';
    this.selectedFontStyle = 'Arial';
    this.selectedFontSize = 'medium';
    this.tipoLetra = 'Arial';
    this.tamanoLetra = 14;
    this.negrita = false;
    this.cursiva = false;
    this.centrado = false;
  }
}