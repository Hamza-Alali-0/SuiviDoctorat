import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'reset-password-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="reset-page">
      <div class="reset-container">
        <h2>{{ tx.translations().reset.title }}</h2>
        <p *ngIf="token">{{ tx.translations().reset.descToken }}</p>
        <p *ngIf="!token">{{ tx.translations().reset.descNoToken }}</p>

        <div class="form-group" *ngIf="!token">
          <label for="email">{{ tx.translations().reset.email }}</label>
          <input id="email" type="email" [value]="email" (input)="email = $any($event.target).value" />
        </div>

        <div class="form-group">
          <label for="token">{{ tx.translations().reset.token }}</label>
          <input id="token" type="text" [value]="token" (input)="token = $any($event.target).value" />
        </div>

        <div class="form-group" *ngIf="!token">
          <label for="code">{{ tx.translations().reset.code }}</label>
          <input id="code" type="text" maxlength="6" [value]="code" (input)="code = $any($event.target).value" />
        </div>

        <div class="form-group">
          <label for="password">{{ tx.translations().reset.password }}</label>
          <input id="password" type="password" [value]="password" (input)="password = $any($event.target).value" />
        </div>

        <div class="form-group">
          <label for="confirm">{{ tx.translations().reset.confirm }}</label>
          <input id="confirm" type="password" [value]="confirm" (input)="confirm = $any($event.target).value" />
        </div>

        <div *ngIf="error()" class="alert alert-error">{{ error() }}</div>
        <div *ngIf="success()" class="alert alert-success">{{ success() }}</div>

        <div style="display:flex; gap:1rem; margin-top:2rem;">
          <button class="btn-secondary" (click)="cancel()">{{ tx.translations().reset.cancel }}</button>
          <button class="btn-primary" (click)="submit()">{{ tx.translations().reset.submit }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --color-primary: #1e40af;
      --color-primary-hover: #1e3a8a;
      --color-bg-primary: #ffffff;
      --color-bg-secondary: #f8fafc;
      --color-text-primary: #0f172a;
      --color-text-secondary: #475569;
      --color-border: #e2e8f0;
      --radius-md: 8px;
      --transition: all 0.2s ease;
    }
    :host-context(.dark) {
      --color-primary: #3b82f6;
      --color-primary-hover: #60a5fa;
      --color-bg-primary: #1e293b;
      --color-bg-secondary: #0f172a;
      --color-text-primary: #f8fafc;
      --color-text-secondary: #cbd5e1;
      --color-border: #334155;
    }
    .reset-page { 
      min-height: 100vh;
      display: flex; 
      align-items: center;
      justify-content: center; 
      padding: 2rem; 
      background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-border) 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .reset-container { 
      width: 100%; 
      max-width: 480px; 
      background: var(--color-bg-primary); 
      padding: 2.5rem; 
      border-radius: 16px; 
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
    }
    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 1rem 0;
      text-align: center;
    }
    p {
      color: var(--color-text-secondary);
      text-align: center;
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    .form-group { 
      margin-bottom: 1.25rem; 
      display: flex; 
      flex-direction: column; 
      gap: 0.5rem;
    }
    label { 
      font-size: 0.875rem;
      font-weight: 600; 
      color: var(--color-text-primary);
    }
    input { 
      padding: 0.75rem 1rem; 
      border: 1.5px solid var(--color-border); 
      border-radius: var(--radius-md); 
      font-size: 0.9375rem;
      transition: var(--transition);
      width: 100%;
      box-sizing: border-box;
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
    }
    input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .btn-primary { 
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 999px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
    }
    .btn-primary:hover {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
    }
    .btn-secondary { 
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: transparent;
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      border-radius: 999px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }
    .btn-secondary:hover {
      background: var(--color-bg-secondary);
      border-color: var(--color-text-secondary);
    }
    .alert { 
      padding: 0.875rem 1rem; 
      border-radius: var(--radius-md); 
      margin-bottom: 1.5rem; 
      font-size: 0.875rem;
    }
    .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
    .alert-success { background: #f0fdf4; color: #059669; border: 1px solid #dcfce7; }
  `]
})
export class ResetPasswordPage {
  token: string | null = null;
  email: string | null = null;
  code: string | null = null;
  password: string | null = null;
  confirm: string | null = null;

  error = signal<string | null>(null);
  success = signal<string | null>(null);
  submitting = signal<boolean>(false);

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, protected tx: TranslationService) {
    this.route.queryParams.subscribe(q => {
      if (q['token']) this.token = q['token'];
      if (q['email']) this.email = q['email'];
    });
  }

  submit() {
    this.error.set(null);
    this.success.set(null);
    if (!this.password || !this.confirm) { this.error.set(this.tx.translations().reset.errors.passRequired); return; }
    if (this.password !== this.confirm) { this.error.set(this.tx.translations().reset.errors.passMismatch); return; }
    this.submitting.set(true);

    if (this.token && this.token.trim() !== '') {
      this.auth.confirmPasswordReset(this.token, this.password, this.confirm).subscribe({
        next: () => { this.success.set(this.tx.translations().reset.errors.success); this.submitting.set(false); setTimeout(() => this.router.navigate(['/auth']), 1400); },
        error: (err: any) => { this.error.set(err?.error?.message || this.tx.translations().reset.errors.failed); this.submitting.set(false); }
      });
      return;
    }

    // fallback: try code + email
    if (!this.email || !this.code) { this.error.set(this.tx.translations().reset.errors.tokenRequired); this.submitting.set(false); return; }
    this.auth.confirmPasswordResetWithCode(this.email, this.code, this.password, this.confirm).subscribe({
      next: () => { this.success.set(this.tx.translations().reset.errors.success); this.submitting.set(false); setTimeout(() => this.router.navigate(['/auth']), 1400); },
      error: (err: any) => { this.error.set(err?.error?.message || this.tx.translations().reset.errors.failed); this.submitting.set(false); }
    });
  }

  cancel() { this.router.navigate(['/auth']); }
}
