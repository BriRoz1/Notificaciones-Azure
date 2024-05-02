import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor() { }

  showNotification(title: string, options?: any) {
    if (!("Notification" in window)) {
      console.error("Este navegador no soporta notificaciones push.");
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  }
}
