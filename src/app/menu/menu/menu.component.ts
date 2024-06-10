import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Inject, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, PopupRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const USER_ROLE_KEY = 'user_role';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy { 
  @Output() loginDisplayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  loginDisplay = false;
  isAdmin = false; // Variable para verificar si el usuario es administrador
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService, private router: Router, private http: HttpClient,) { }

  ngOnInit() {
    
    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
  

    // Escuchar evento de inicio de sesión
    this.broadcastService.msalSubject$
    .pipe(
      filter((message: EventMessage) => message.eventType === EventType.LOGIN_SUCCESS),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.getProfile();
    });
    }
  
  login() {
    if (this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        .subscribe({
          next: (result) => {
            console.log(result);
            this.setLoginDisplay();
            this.router.navigate(['/login'])
          },
          error: (error) => console.log(error)
        });
    } else {
      this.authService.loginPopup()
        .subscribe({
          next: (result) => {
            console.log(result);
            this.setLoginDisplay();
            this.router.navigate(['/login'])
          },
          error: (error) => console.log(error)
        });
    }
  }

  logout() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }
  
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    if (this.loginDisplay) {
      const storedUserRole = localStorage.getItem(USER_ROLE_KEY);
      if (storedUserRole) {
        this.isAdmin = storedUserRole === 'admin';
      }
    }
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe((profile: any) => { // Asegúrate de tipar el perfil
        this.isAdmin = profile.jobTitle === 'Administrador'; // Verifica el jobTitle
        localStorage.setItem(USER_ROLE_KEY, this.isAdmin ? 'admin' : 'regular');
      });
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
  
  
}

