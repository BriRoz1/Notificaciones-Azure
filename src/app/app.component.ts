import { Component, OnInit, OnDestroy, Inject, inject } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  loginDisplay = false;
  private messaging = inject(Messaging);

  updateLoginDisplay(value: boolean) {
    this.loginDisplay = value;
  }
}