import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastMessage, ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-stack',
  imports: [CommonModule],
  templateUrl: './toast-stack.html',
  styleUrl: './toast-stack.css',
})
export class ToastStack {
  constructor(public toastService: ToastService) {}

  trackById(_index: number, item: ToastMessage): number {
    return item.id;
  }
}
