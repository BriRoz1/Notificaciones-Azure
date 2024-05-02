import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';
import { DatabaseService } from '../../database.service';
import { HttpClient } from '@angular/common/http';
import { PushService } from '../../services/push.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent implements OnInit{
  fechaFinal = Date;
  lista: any[] = [];
  filteredList: any[] = [];
  selectedOption: any;
  backupList: any[] = []; // Copia de seguridad de la lista original
  correos: string[] = [];
  selectedFontStyle: string = 'Arial'; // Valor por defecto
  selectedFontSize: string = 'medium'; // Valor por defecto

  

  tipoLetra: string = 'Arial';
  tamanoLetra: number = 14;
  colorTexto: string = '#000000';
  negrita: boolean = false;
  cursiva: boolean = false;
  centrado: boolean = false;

  destinatarios: string = '';
  asunto: string = '';
  cuerpo: string = '';
  frecuenciaEnvio: string = 'diaria'; // Valor por defecto
  canalEnvio: string = 'email'; // Valor por defecto


  

  constructor(private databaseService: DatabaseService, private http: HttpClient, private pushService: PushService) { }

  ngOnInit() {
    this.databaseService.getlistas()
      .subscribe(
        lista => {
          this.lista = lista;
          this.filteredList = lista;
          this.backupList = lista; // Almacenar una copia de seguridad
          console.log('Listas:', lista);

          
        },
        error => {
          console.error('Error getting listas:', error);
        }
    
      );
      
  }

  mostrarNotificacion() {
    this.pushService.showNotification('FECHAS DE ANTEPROYECTOS .', {
      body: 'Hola, revisa tu correo para consultar las fechas de anteproyectos',
  
    })
    console.log('notificacion enviada');
    
  }

  enviarCorreo() {

    this.destinatarios = this.getEmails(); 
    const data = {
      destinatarios: this.destinatarios,
      asunto: this.asunto,
      cuerpo: this.cuerpo,
      frecuenciaEnvio: this.frecuenciaEnvio,
      canalEnvio: this.canalEnvio
    };

    console.log(' destinatarios', this.destinatarios)
    console.log(' asunto', this.asunto)
    console.log(' frecuencia',this.frecuenciaEnvio)
    console.log(' canalEnvio',this.canalEnvio)
    console.log(' fecha', this.fechaFinal)
    console.log(' Cuerpo', this.cuerpo)

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
          console.log('email:', data);
         
        },
        error => {
          console.error('Error getting listas:', error);
        }
        
      );
      
  }

  onModelChange(event: any) {
    this.filteredList = this.lista.filter(item => item.name === this.selectedOption);
  }
  

  getEmails(): string {
    const emails = this.filteredList.map(item => item.email).filter(email => !!email);
    const emailsString = emails.join(', ');
    return emailsString;
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
      // Agrega más casos según sea necesario
      default:
        textarea.style.fontSize = 'inherit';
        break;
    }
  }

  // Método para aplicar negrita al texto
  aplicarNegrita() {
    this.negrita = !this.negrita;
  }

  // Método para aplicar cursiva al texto
  aplicarCursiva() {
    this.cursiva = !this.cursiva;
  }

  // Método para alinear texto
  alinearTexto(alineacion: string) {
    if (alineacion === 'left') {
      this.centrado = false;
    } else {
      this.centrado = true;
    }
  }

  // Método para cambiar el tamaño de la letra
  cambiarTamano(accion: string) {
    if (accion === 'aumentar') {
      this.tamanoLetra += 2;
    } else if (accion === 'disminuir' && this.tamanoLetra > 8) {
      this.tamanoLetra -= 2;
    }
  }

  // Método para adjuntar archivos
  adjuntarArchivo(event: any) {
    const archivo = event.target.files[0];
    // Aquí puedes manejar el archivo como desees
  }


  limpiarDestinatarios() {
    // Restaurar la lista de destinatarios y la lista filtrada a su estado original
    this.lista = this.backupList;
    this.filteredList = this.backupList;
  
    // Limpiar el campo de destinatarios y otros campos relacionados
    this.destinatarios = '';

    console.log('Valores limpiados exitosamente')
 

  }

  limpiarTodo(){

    this.lista = this.backupList;
    this.filteredList = this.backupList;
  
    // Limpiar el campo de destinatarios y otros campos relacionados
    this.destinatarios = '';
    this.asunto = '';
    this.cuerpo = '';
    this.frecuenciaEnvio = 'diaria'; // Restaurar a la opción por defecto
    this.canalEnvio = 'email'; // Restaurar a la opción por defecto
    // También puedes restablecer otros campos según sea necesario
  
    // Restablecer estilos de fuente y tamaño de letra
    this.selectedFontStyle = 'Arial';
    this.selectedFontSize = 'medium';
    this.tipoLetra = 'Arial';
    this.tamanoLetra = 14;
    this.negrita = false;
    this.cursiva = false;
    this.centrado = false;

  
  }
}

