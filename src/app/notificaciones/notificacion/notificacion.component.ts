import { Component, OnInit } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';
import { DatabaseService } from '../../database.service';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent implements OnInit{

  lista: any[] = [];
  filteredList: any[] = [];
  selectedOption: any;
  backupList: any[] = []; // Copia de seguridad de la lista original
  correos: string[] = [];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(){
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



  onOptionChange(event: any) {
    console.log('Opción seleccionada:', this.selectedOption);
    this.databaseService.getCorreosByPreferencia(this.selectedOption)
      .subscribe(
        data=> {
          this.lista = data;
          this.filteredList = data;
          console.log('email:', data);
        },
        error => {
          console.error('Error getting listas:', error);
        }
      );
  }

  getEmails(): string {
    const emails = this.filteredList.map(item => item.email).filter(email => !!email);
    return emails.length > 0 ? emails.join(', ') : '';
  }

  // Método para filtrar la lista según el término de búsqueda
  filterList(term: string): void {
    this.filteredList = this.backupList.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
  }
  


}
