import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  type: 'success' | 'error' | 'warning' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<ModalConfig | null>();
  modal$ = this.modalSubject.asObservable();
  
  show(config: ModalConfig) {
    this.modalSubject.next(config);
  }
  
  success(title: string, message: string, confirmText = 'OK') {
    this.show({
      type: 'success',
      title,
      message,
      confirmText
    });
  }
  
  error(title: string, message: string, confirmText = 'OK') {
    this.show({
      type: 'error',
      title,
      message,
      confirmText
    });
  }
  
  warning(title: string, message: string, confirmText = 'OK') {
    this.show({
      type: 'warning',
      title,
      message,
      confirmText
    });
  }
  
  confirm(title: string, message: string, onConfirm?: () => void, onCancel?: () => void): Promise<boolean> {
    return new Promise((resolve) => {
      this.show({
        type: 'confirm',
        title,
        message,
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
        onConfirm: () => {
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          resolve(false);
        }
      });
    });
  }
  
  close() {
    this.modalSubject.next(null);
  }
}
