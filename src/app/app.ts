import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastStack } from './shared/toast-stack/toast-stack';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastStack],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Desi Parcel Connect';
}
