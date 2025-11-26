import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="modal-container" [ngClass]="type">
        <div class="modal-icon">
          <svg *ngIf="type === 'success'" width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg *ngIf="type === 'error'" width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg *ngIf="type === 'warning'" width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 20h20L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg *ngIf="type === 'confirm'" width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        
        <div class="modal-content">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
        </div>
        
        <div class="modal-actions">
          <button *ngIf="type === 'confirm'" class="modal-btn modal-btn-cancel" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button class="modal-btn modal-btn-confirm" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-container {
      background: #fff;
      border-radius: 20px;
      padding: 2rem;
      max-width: 440px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
    }
    
    .modal-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .modal-container.success .modal-icon {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #16a34a;
    }
    
    .modal-container.error .modal-icon {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
    }
    
    .modal-container.warning .modal-icon {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #f59e0b;
    }
    
    .modal-container.confirm .modal-icon {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #2563eb;
    }
    
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.3;
    }
    
    .modal-message {
      font-size: 1rem;
      color: #475569;
      margin: 0;
      line-height: 1.6;
    }
    
    .modal-actions {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      margin-top: 0.5rem;
    }
    
    .modal-btn {
      flex: 1;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    
    .modal-btn-confirm {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #fff;
    }
    
    .modal-btn-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
    }
    
    .modal-btn-cancel {
      background: #f1f5f9;
      color: #475569;
    }
    
    .modal-btn-cancel:hover {
      background: #e2e8f0;
    }
    
    .modal-container.success .modal-btn-confirm {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    }
    
    .modal-container.success .modal-btn-confirm:hover {
      box-shadow: 0 8px 20px rgba(22, 163, 74, 0.3);
    }
    
    .modal-container.error .modal-btn-confirm {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }
    
    .modal-container.error .modal-btn-confirm:hover {
      box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
    }
    
    @media (max-width: 480px) {
      .modal-container {
        padding: 1.5rem;
        max-width: 95%;
      }
      
      .modal-icon {
        width: 60px;
        height: 60px;
      }
      
      .modal-icon svg {
        width: 36px;
        height: 36px;
      }
      
      .modal-title {
        font-size: 1.25rem;
      }
      
      .modal-message {
        font-size: 0.9375rem;
      }
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() type: 'success' | 'error' | 'warning' | 'confirm' = 'confirm';
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Annuler';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  
  onConfirm() {
    this.confirmed.emit();
    this.isOpen = false;
    this.closed.emit();
  }
  
  onCancel() {
    this.cancelled.emit();
    this.isOpen = false;
    this.closed.emit();
  }
  
  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      if (this.type !== 'confirm') {
        this.onConfirm();
      }
    }
  }
}
