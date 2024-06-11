import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ProfileComponent } from "./profile/profile.component";

import { MsalModule,MsalRedirectComponent, MsalGuard, MsalInterceptor,} from "@azure/msal-angular"; // Import MsalInterceptor
import { InteractionType, PublicClientApplication, } from "@azure/msal-browser";
import { LoginComponent } from './login/login.component';
import { PreferenciasComponent } from './preferencias/preferencias.component';
import { DatabaseService } from "./database.service";
import { FormsModule } from "@angular/forms";
import { NotificacionComponent } from './notificaciones/notificacion/notificacion.component';
import { MenuComponent } from './menu/menu/menu.component';
import { FooterComponent } from './footer/footer/footer.component';


import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { enviroment } from "../enviroments/enviroment";
import { Firestore } from '@angular/fire/firestore';
import { } from '@angular/fire/messaging';
import { NgxEditorModule } from 'ngx-editor';
import { EditorModule } from "@tinymce/tinymce-angular";




const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;
  

@NgModule({
  declarations: [AppComponent, HomeComponent, ProfileComponent, LoginComponent, PreferenciasComponent, NotificacionComponent, MenuComponent, FooterComponent],
  imports: [
    EditorModule,
    NgxEditorModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "a376a4d7-0043-462b-8e76-0d8b5f1e17fb",
          authority:
            "https://login.microsoftonline.com/9fe31466-2afc-4672-8981-4c994074632d",
          redirectUri: "http://localhost:4200",
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: isIE,
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ["user.read"],
        },
      },
      {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
        ]),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
    DatabaseService,
    provideFirebaseApp(() => initializeApp({"projectId":"proyectoudistrital-97c58","appId":"1:771845660727:web:95ec83640d172e6ec09fb2","storageBucket":"proyectoudistrital-97c58.appspot.com","apiKey":"AIzaSyAB4iAHd6ReFxw14pjMJ36m3b1vOOCtHXU","authDomain":"proyectoudistrital-97c58.firebaseapp.com","messagingSenderId":"771845660727","measurementId":"G-9SHRBS3Z80"})),
    provideMessaging(() => getMessaging())
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}