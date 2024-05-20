import { Injectable } from "@angular/core";
import { Messaging, getToken, onMessage, deleteToken } from "@angular/fire/messaging";
import { Observable, Subject, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class pushService {
  message$: Observable<any>;
  private tokenSubject: Subject<string> = new Subject<string>();
  token$: Observable<string> = this.tokenSubject.asObservable();

  constructor(private msg: Messaging) {
    Notification.requestPermission().then((notificationPermissions: NotificationPermission) => {
      if (notificationPermissions === "granted") {
        console.log("Granted");
      }
      if (notificationPermissions === "denied") {
        console.log("Denied");
      }
    });

    navigator.serviceWorker
      .register("firebase-messaging-sw.js", {
        type: "module",
      })
      .then((serviceWorkerRegistration) => {
        getToken(this.msg, {
          vapidKey: `BJQ0QH9y5FjS0bD0AjsJNv1mIVn4j9JOy88SSCEK-QmiGkdUawifLqHAKoel9F7CcaWcDaDfSmxJYdwUMkYfBnU`, // Reemplaza `YOUR_VAPID_KEY` con tu clave VAPID de Firebase
          serviceWorkerRegistration: serviceWorkerRegistration,
        }).then((token) => {
          console.log('Token Navegador:', token);
          // Aquí es un buen lugar para almacenar el token en tu base de datos
          this.tokenSubject.next(token);
        });
      });

    this.message$ = new Observable((sub) => onMessage(this.msg, (msg) => sub.next(msg))).pipe(
      tap((msg) => {
        console.log("My Firebase Cloud Message", msg);
      })
    );
    
  }
  

    async deleteToken() {
      // Podemos eliminar los tokens FCM, asegúrate de actualizar esto también en tu base de datos si los estás almacenando
      await deleteToken(this.msg);
    }
}
