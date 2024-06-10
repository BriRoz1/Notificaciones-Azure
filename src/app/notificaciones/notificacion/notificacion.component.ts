import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../database.service';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion.service';

interface TokenData {
  token: string;
}

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

  title = 'Tienes una nueva notificacion pendiente';
  body = this.asunto;

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
    const title = 'Tienes una nueva notificacion pendiente';
    const body = this.asunto;

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
      message: this.buildHtmlMessage() // Usar HTML para el mensaje
    };

    this.http.post<any>('https://us-central1-proyectoudistrital-97c58.cloudfunctions.net/mailer', correoData).subscribe(
      response => {
        console.log('Correo enviado:', response);
      },
      error => {
        console.error('Error al enviar el correo:', error);
      }
    );
  }

  buildHtmlMessage(): string {
    return `
      <div style="font-family: ${this.selectedFontStyle}; font-size: ${this.selectedFontSize}; color: ${this.colorTexto}; text-align: ${this.centrado ? 'center' : 'left'}; ${this.negrita ? 'font-weight: bold;' : ''} ${this.cursiva ? 'font-style: italic;' : ''}">
        ${this.cuerpo}
      </div>
    `;
  }

  onOptionChange(event: any) {
    this.databaseService.getCorreosByPreferencia(this.selectedOption)
      .subscribe(
        data => {
          this.lista = data;
          this.filteredList = data;
        },
        error => {
          console.error('Error getting listas:', error);
        }
      );

    this.databaseService.getTokensByPreferencia(this.selectedOption)
      .subscribe(
        (tokens: TokenData[]) => {
          this.tokens = tokens.map(t => t.token);
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
