import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly itemsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly items$ = this.itemsSubject.asObservable();
  private idCounter = 0;

  show(text: string, type: ToastType = 'info', durationMs = 3000): void {
    const id = ++this.idCounter;
    const next = [...this.itemsSubject.value, { id, text, type }];
    this.itemsSubject.next(next);
    window.setTimeout(() => this.dismiss(id), durationMs);
  }

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'error', 4000);
  }

  warning(text: string): void {
    this.show(text, 'warning', 4000);
  }

  info(text: string): void {
    this.show(text, 'info');
  }

  dismiss(id: number): void {
    this.itemsSubject.next(this.itemsSubject.value.filter((i) => i.id !== id));
  }
}
