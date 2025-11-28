import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'dashboard-page',
  standalone: true,
  imports: [CommonModule, CandidatNavbarComponent, RouterModule],
  templateUrl: './dashboard.html',
  styles: [`
    /* ========== CSS Variables (Theme) ========== */
    :host {
      display: block;
      min-height: 100vh;
      background: #f8fafc;
      --color-primary: #1e40af;
      --color-bg: #f8fafc;
      --color-card: #ffffff;
      --color-border: #e2e8f0;
      --color-text: #0f172a;
      --color-text-secondary: #64748b;
      --color-text-muted: #94a3b8;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.05);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --transition: all 0.2s ease;
    }

    /* ========== Page Layout ========== */
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem 2rem;
    }

    /* ========== Hero Section with Background ========== */
    .hero-section {
      position: relative;
      margin: 0 -1.5rem 2rem;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.9) 100%), 
                  url('/assets/candidat-banner.png');
      background-size: cover;
      background-position: center;
      color: #fff;
      overflow: hidden;
    }

    .hero-content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      position: relative;
      z-index: 2;
    }

    .hero-text {
      flex: 1;
    }

    .hero-greeting {
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: 0.8;
      margin-bottom: 0.5rem;
    }

    .hero-name {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1rem;
      opacity: 0.85;
      margin-bottom: 1.25rem;
    }

    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .hero-meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .hero-meta-item svg {
      width: 16px;
      height: 16px;
      opacity: 0.8;
    }

    /* ========== Progress Ring ========== */
    .progress-ring-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .progress-ring {
      position: relative;
      width: 130px;
      height: 130px;
    }

    .progress-ring svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-ring-bg {
      fill: none;
      stroke: rgba(255,255,255,0.2);
      stroke-width: 10;
    }

    .progress-ring-fill {
      fill: none;
      stroke: #fff;
      stroke-width: 10;
      stroke-linecap: round;
      stroke-dasharray: 346;
      transition: stroke-dashoffset 0.8s ease;
    }

    .progress-ring-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
    }

    .progress-ring-value {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
    }

    .progress-ring-label {
      font-size: 0.7rem;
      opacity: 0.8;
      margin-top: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ========== Stats Overview Cards ========== */
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-overview-card {
      background: var(--color-card);
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      transition: var(--transition);
    }

    .stat-overview-card:hover {
      box-shadow: var(--shadow-md);
    }

    .stat-overview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .stat-overview-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-overview-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .stat-progress-bar {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }

    .stat-progress-fill {
      height: 100%;
      border-radius: 999px;
      background: var(--color-text);
      transition: width 0.6s ease;
    }

    /* ========== Quick Actions ========== */
    .quick-actions-section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0 0 1rem 0;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .quick-action-card {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem 1.25rem;
      background: var(--color-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      text-decoration: none;
      color: var(--color-text);
      transition: var(--transition);
      cursor: pointer;
    }

    .quick-action-card:hover {
      box-shadow: var(--shadow-md);
      border-color: #cbd5e1;
    }

    .quick-action-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #f1f5f9;
      color: var(--color-text);
    }

    .quick-action-content {
      flex: 1;
      min-width: 0;
    }

    .quick-action-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .quick-action-desc {
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-top: 0.125rem;
    }

    /* ========== Main Content Grid ========== */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .content-card {
      background: var(--color-card);
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .card-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-title svg {
      width: 18px;
      height: 18px;
      color: var(--color-text-secondary);
    }

    .view-all-btn {
      background: none;
      border: none;
      padding: 0;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: var(--transition);
    }

    .view-all-btn:hover {
      color: var(--color-text);
    }

    /* ========== Status Card ========== */
    .status-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #f1f5f9;
      color: var(--color-text);
    }

    .status-details {
      flex: 1;
    }

    .status-label {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.25rem;
    }

    .status-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .status-progress {
      margin-top: 0.75rem;
    }

    .status-progress-bar {
      height: 4px;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 0.375rem;
    }

    .status-progress-fill {
      height: 100%;
      background: var(--color-text);
      border-radius: 999px;
    }

    .status-progress-text {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    /* ========== Prerequisites Grid ========== */
    .prereq-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .prereq-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-sm);
      padding: 0.875rem;
      text-align: center;
    }

    .prereq-label {
      font-size: 0.65rem;
      color: var(--color-text-secondary);
      margin-bottom: 0.375rem;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .prereq-value {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-text);
    }

    /* ========== Deadlines ========== */
    .deadline-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .deadline-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.875rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .deadline-item:hover {
      background: #f1f5f9;
    }

    .deadline-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #e2e8f0;
      color: var(--color-text);
    }

    .deadline-content {
      flex: 1;
      min-width: 0;
    }

    .deadline-title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text);
    }

    .deadline-date {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
      margin-top: 0.125rem;
    }

    .deadline-badge {
      padding: 0.3rem 0.65rem;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 600;
      white-space: nowrap;
      background: var(--color-text);
      color: #fff;
    }

    /* ========== Activity Timeline ========== */
    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      gap: 0.875rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .activity-item:first-child {
      padding-top: 0;
    }

    .activity-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20px;
      flex-shrink: 0;
    }

    .activity-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-text);
      flex-shrink: 0;
    }

    .activity-line {
      width: 1px;
      flex: 1;
      background: #e2e8f0;
      margin-top: 0.5rem;
    }

    .activity-item:last-child .activity-line {
      display: none;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text);
      margin-bottom: 0.125rem;
    }

    .activity-time {
      font-size: 0.7rem;
      color: var(--color-text-secondary);
    }

    .activity-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }

    /* ========== Responsive ========== */
    @media (max-width: 1024px) {
      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
      }

      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 0 1rem 1.5rem;
      }

      .hero-section {
        margin: 0 -1rem 1.5rem;
        padding: 2rem 1.25rem;
      }

      .hero-content-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.5rem;
      }

      .hero-name {
        font-size: 1.75rem;
      }

      .progress-ring {
        width: 100px;
        height: 100px;
      }

      .progress-ring-value {
        font-size: 1.25rem;
      }

      .stats-overview {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .prereq-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .hero-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class DashboardPage implements OnInit {
  name = signal('');
  year = signal('Année 2 de votre doctorat');
  director = signal('Non assigné');
  startDate = signal('');
  progress = signal(67);

  recent = signal<Array<{ title: string; when: string; icon: string }>>([
    { title: 'Rapport de thèse soumis', when: 'Il y a 2 jours', icon: 'document' },
    { title: 'Réunion avec directeur de thèse', when: 'Il y a 1 semaine', icon: 'calendar' },
    { title: 'Formation complétée: Méthodologie de recherche', when: 'Il y a 2 semaines', icon: 'check' },
    { title: 'Article accepté - Journal of AI Research', when: 'Il y a 1 mois', icon: 'star' }
  ]);

  stats = signal<Array<{ label: string; current: number; required: number }>>([
    { label: 'Publications', current: 2, required: 4 },
    { label: 'Formations (h)', current: 120, required: 200 },
    { label: 'Conférences', current: 1, required: 2 }
  ]);

  deadlines = signal<Array<{ title: string; date: string; type: 'urgent' | 'soon' | 'normal' }>>([
    { title: 'Réinscription 2025-2026', date: '15 Sept 2025', type: 'urgent' },
    { title: 'Rapport d\'avancement annuel', date: '30 Oct 2025', type: 'soon' },
    { title: 'Séminaire doctoral', date: '15 Déc 2025', type: 'normal' }
  ]);

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    try {
      this.auth.getProfile().subscribe({
        next: (profile: any) => {
          const firstName = profile?.firstName || profile?.name || '';
          const lastName = profile?.lastName || '';
          this.name.set(firstName + (lastName ? ' ' + lastName : ''));
          if (profile?.thesisDirector) {
            this.director.set(profile.thesisDirector);
          }
          if (profile?.enrollmentDate) {
            const date = new Date(profile.enrollmentDate);
            this.startDate.set(date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
          }
        },
        error: () => {
          this.name.set('Candidat');
        }
      });
    } catch (e) {
      this.name.set('Candidat');
    }
  }

  getProgressOffset(): number {
    const circumference = 346; // 2 * PI * 55
    return circumference - (circumference * this.progress() / 100);
  }

  getStatProgress(current: number, required: number): number {
    return Math.min((current / required) * 100, 100);
  }

  getProgressClass(current: number, required: number): string {
    const percent = (current / required) * 100;
    if (percent >= 100) return 'success';
    if (percent >= 50) return 'warning';
    return 'danger';
  }

  getProgressTextClass(current: number, required: number): string {
    const percent = (current / required) * 100;
    if (percent >= 100) return 'text-success';
    if (percent >= 50) return 'text-warning';
    return 'text-danger';
  }

  getPrereqClass(current: number, required: number): string {
    const percent = (current / required) * 100;
    if (percent >= 100) return 'complete';
    if (percent >= 50) return 'partial';
    return 'low';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
