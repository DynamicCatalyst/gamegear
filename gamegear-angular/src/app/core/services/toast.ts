import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Lightweight toast state.
 * A single ToastContainer component renders the `toasts` signal.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly toastsSig = signal<Toast[]>([]);
  readonly toasts = this.toastsSig.asReadonly();

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toastsSig.update((list) => list.filter((t) => t.id !== id));
  }

  private show(message: string, type: ToastType): void {
    const id = this.nextId++;
    this.toastsSig.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
