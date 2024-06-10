import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion.service';
import { Editor, Toolbar } from 'ngx-editor';

interface TokenData {
  token: string;
}

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {
  editor: Editor;

  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
    ['undo', 'redo'],
    
  ];
  colorPresets = [
    'red', '#FF0000', 'rgb(255, 0, 0)', 'blue', '#0000FF', 'rgb(0, 0, 255)', 
    'green', '#00FF00', 'rgb(0, 255, 0)', 'yellow', '#FFFF00', 'rgb(255, 255, 0)', 
    'black', '#000000', 'rgb(0, 0, 0)', '#FF5733', '#33FF57', '#3357FF', '#800080',
    '#FFA500', '#FFC0CB', '#00FFFF', '#808080'
  ];

  
  html = '';

  
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

  // Elimina el token de prueba ya que ahora manejaremos múltiples tokens
  title = 'Tienes una nueva notificacion pendiente';
  body = this.asunto;

  constructor(
    private databaseService: DatabaseService,
    private http: HttpClient,
    private notificationService: NotificacionService
  ) { }

  ngOnInit() {
    this.editor = new Editor();
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
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  sendNotification() {
    const title = 'Tienes una nueva notificacion pendiente';
    const body = this.asunto;

    // Enviar notificaciones a todos los tokens
    this.tokens.forEach(token => {
      this.notificationService.sendNotification(token, title, body)
        .subscribe(
          response => {
            console.log(`Notification sent to token ${token}:`, response);
          },
          error => {
            console.error(`Error sending notification to token ${token}:`, error);
          }
        );
    });
  }

  enviarCorreo() {
    const correoData = {
      to: this.getEmails(),
      subject: this.asunto,
      message: this.cuerpo
    };

    console.log('correo',this.getEmails())
    console.log('asunto',this.asunto)
    console.log('cuerpo',this.cuerpo)


    this.http.post<any>('https://us-central1-proyectoudistrital-97c58.cloudfunctions.net/mailer', correoData).subscribe(
      response => {
        console.log('Correo enviado:', response);
        // Aquí puedes manejar la respuesta si es necesario
      },
      error => {
        console.error('Error al enviar el correo:', error);
        // Aquí puedes manejar el error si es necesario
      }
    );
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
        (tokens: TokenData[]) => {
          this.tokens = tokens.map(t => t.token);
          console.log('Tokens:', this.tokens);
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
