import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { EncadrantNavbarComponent } from '../../../components/navbar/encadrant-navbar';
import { ModalComponent } from '../../../components/modal/modal';

@Component({
  selector: 'app-encadrant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, EncadrantNavbarComponent, ModalComponent],
  templateUrl: './profile.html',
  styles: [
    `
    /* Page layout helpers */
    :host { display: block; min-height: 100vh; background: #fafafa; }
    :root{ --zinc-50:#fafafa; --zinc-100:#f3f4f6; --zinc-200:#e6e9ee; --zinc-300:#d1d5db; --zinc-500:#6b7280; --zinc-600:#4b5563; --zinc-700:#374151; --zinc-900:#0f172a; --blue-50:#eff6ff; --blue-100:#dbeafe; --blue-600:#2563eb; --blue-700:#1d4ed8; --green-50:#f0fdf4; --green-600:#16a34a; --orange-50:#fff7ed; --orange-600:#ea580c; --red-50:#fef2f2; --red-600:#dc2626; }

    .min-h-screen { min-height: 100vh; }
    .max-w-7xl { max-width: 1100px; }
    .mx-auto { margin-left:auto; margin-right:auto; }
    .px-6 { padding-left:1.5rem; padding-right:1.5rem; }
    .py-8 { padding-top:2rem; padding-bottom:2rem; }
    .bg-zinc-50 { background-color: var(--zinc-50); }

    /* Profile Layout */
    .profile-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
      align-items: start;
      width:100%;
      min-width:0;
    }

    /* Sidebar Profile Card */
    .profile-sidebar {
      position: sticky;
      top: 2rem;
      min-width:0;
    }

    .profile-card {
      background:#fff;
      border-radius:18px;
      padding:1.5rem;
      box-shadow:0 6px 24px rgba(2,6,23,0.05);
      text-align:center;
      display:flex;
      flex-direction:column;
      gap:1rem;
      min-width:0;
    }

    .avatar-block {
      position:relative;
      width:120px;
      height:120px;
      margin:0 auto;
    }

    .avatar-initial {
      width:120px;
      height:120px;
      border-radius:50%;
      background:#000;
      color:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:3rem;
      font-weight:700;
      text-transform:uppercase;
    }

    .avatar-img {
      width:120px;
      height:120px;
      border-radius:50%;
      object-fit:cover;
      border:4px solid #fff;
      box-shadow:0 8px 24px rgba(2,6,23,0.12);
    }

    .avatar-edit {
      position:absolute;
      right:0;
      bottom:0;
      width:36px;
      height:36px;
      border-radius:999px;
      background:rgba(0,0,0,0.6);
      color:#fff;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      font-size:1.1rem;
      transition:all .2s;
    }

    .avatar-edit:hover {
      background:rgba(0,0,0,0.8);
      transform:scale(1.05);
    }

    .avatar-edit input {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      opacity:0;
      cursor:pointer;
    }

    .name {
      font-size:1.3rem;
      font-weight:700;
      color:var(--zinc-900);
      margin:0;
      line-height:1.3;
    }

    .role-pill {
      display:inline-block;
      padding:0.4rem 1rem;
      background:linear-gradient(135deg, var(--blue-600), var(--blue-700));
      color:#fff;
      border-radius:999px;
      font-size:0.75rem;
      font-weight:600;
      letter-spacing:0.5px;
      margin:0;
    }

    .bio-section {
      width:100%;
      margin-top:1rem;
      padding-top:1rem;
      border-top:1px solid #e2e8f0;
    }

    .bio-text {
      font-size:0.85rem;
      line-height:1.6;
      color:#475569;
      text-align:left;
      margin:0;
    }

    .bio-text.empty {
      color:#94a3b8;
      font-style:italic;
    }

    /* Smart CV Section - Sidebar */
    .cv-section-sidebar {
      width:100%;
      margin-top:1rem;
      padding:1rem;
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:12px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .cv-header-row {
      display:flex;
      align-items:flex-start;
      gap:0.75rem;
      margin-bottom:0.85rem;
      /* allow flex children to shrink properly to avoid overflow */
      min-width: 0;
    }

    .cv-icon-circle {
      width:48px;
      height:48px;
      min-width:48px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#fff;
      border:1px solid #e6eef8;
      border-radius:10px;
      box-shadow:0 2px 6px rgba(2,6,23,0.04);
      color:var(--blue-700);
      flex-shrink:0;
    }

    .cv-file-blob {
      width:36px;
      height:36px;
      border-radius:8px;
      background:linear-gradient(180deg,#eef2ff 0%, #e0f2fe 100%);
      color:var(--blue-700);
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size:0.78rem;
      letter-spacing:0.6px;
      box-shadow: inset 0 -1px 0 rgba(0,0,0,0.03);
    }

    .cv-info {
      flex:1;
      min-width:0;
      display:flex;
      flex-direction:column;
      gap:0.25rem;
      overflow: hidden; /* ensure long filenames don't push layout */
    }

    .cv-label {
      font-size:0.75rem;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:0.5px;
      color:#334155;
    }

    .cv-status {
      display:flex;
      flex-direction:column;
      gap:0.15rem;
    }

    .cv-filename {
      font-size:0.85rem;
      font-weight:600;
      color:#0f172a;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      display:block;
      min-width:0;
    }

    .cv-badge {
      font-size:0.7rem;
      color:#64748b;
    }

    .cv-status-empty {
      font-size:0.8rem;
      color:#94a3b8;
      font-style:italic;
    }

    .cv-actions-row {
      display:flex;
      gap:0.5rem;
      flex-wrap:wrap;
    }

    .cv-icon-btn {
      width:36px;
      height:36px;
      border:1px solid #E5E7EB;
      border-radius:8px;
      background:#F9FAFB;
      color:#6B7280;
      cursor:pointer;
      transition:all 0.2s ease;
      display:flex;
      align-items:center;
      justify-content:center;
      text-decoration:none;
    }

    .cv-icon-btn:hover {
      background:#F3F4F6;
      border-color:#D1D5DB;
      color:#374151;
      transform:translateY(-1px);
    }

    .cv-icon-btn:active {
      transform:translateY(0);
    }

    .cv-icon-btn svg {
      flex-shrink:0;
    }

    /* Social Links */
    .social-links {
      width:100%;
      display:flex;
      flex-direction:column;
      gap:.5rem;
      margin-top:.75rem;
    }

    .social-link {
      display:flex;
      align-items:center;
      gap:.75rem;
      padding:.65rem .85rem;
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:10px;
      color:#475569;
      text-decoration:none;
      font-size:.8rem;
      font-weight:500;
      transition:.15s;
    }

    .social-link:hover {
      background:#eef2ff;
      color:#1d4ed8;
      border-color:#bfdbfe;
      transform:translateX(2px);
    }

    .social-link svg {
      flex-shrink:0;
    }

    /* Main Content */
    .profile-main {
      display:flex;
      flex-direction:column;
      gap:1.5rem;
      min-width:0;
    }

    /* Main Stats Row */
    .stats-row {
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
      gap:1rem;
      width:100%;
      min-width:0;
    }

    .stat-card {
      background:#fff;
      border-radius:14px;
      padding:1rem;
      box-shadow:0 4px 16px rgba(2,6,23,0.05);
      display:flex;
      flex-direction:column;
      gap:.6rem;
      min-width:0;
    }

    .stat-header {
      display:flex;
      justify-content:space-between;
      align-items:center;
    }

    .stat-label {
      font-size:.7rem;
      font-weight:600;
      letter-spacing:.5px;
      text-transform:uppercase;
      color:var(--zinc-600);
    }

    .stat-value {
      font-size:.8rem;
      font-weight:700;
      color:var(--zinc-900);
    }

    .stat-bar {
      width:100%;
      height:6px;
      background:#e2e8f0;
      border-radius:4px;
      overflow:hidden;
    }

    .stat-fill {
      height:100%;
      background:var(--blue-600);
      transition:width .4s ease;
    }

    /* Cards in main area */
    .content-grid {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:1.5rem;
      width:100%;
      min-width:0;
    }

    .content-grid.single {
      grid-template-columns:1fr;
    }

    .card {
      background:#fff;
      border-radius:16px;
      padding:1.5rem;
      box-shadow:0 4px 20px rgba(2,6,23,0.06);
      display:flex;
      flex-direction:column;
      gap:1rem;
      min-width:0;
    }

    .details-card {
      grid-column:1 / -1;
    }

    .card-header {
      display:flex;
      align-items:center;
      justify-content:space-between;
      min-width:0;
    }

    .card-header h2 {
      margin:0;
      font-size:.95rem;
      font-weight:700;
      color:var(--zinc-900);
    }

    .edit-controls {
      display:flex;
      align-items:center;
      gap:.5rem;
    }

    .icon-btn {
      background:#fff;
      border:1px solid #e2e8f0;
      width:36px;
      height:36px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      border-radius:10px;
      cursor:pointer;
      color:var(--zinc-600);
      transition:.15s;
      padding:0;
    }

    .icon-btn:hover {
      background:#f1f5f9;
      color:var(--blue-700);
    }

    .btn {
      padding:0.65rem 1.25rem;
      border-radius:10px;
      font-size:0.85rem;
      font-weight:600;
      cursor:pointer;
      transition:all 0.2s ease;
      border:none;
    }

    .btn-secondary {
      background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color:#fff;
    }

    .btn-secondary:hover {
      transform:translateY(-2px);
      box-shadow:0 6px 20px rgba(37, 99, 235, 0.3);
    }

    .cancel-btn {
      padding:0.65rem 1.25rem;
      background:#f1f5f9;
      color:#475569;
      border:none;
      border-radius:10px;
      font-size:0.85rem;
      font-weight:600;
      cursor:pointer;
      transition:all 0.2s;
    }

    .cancel-btn:hover {
      background:#e2e8f0;
    }

    /* Edit Form */
    .edit-form {
      display:flex;
      flex-direction:column;
      gap:1.25rem;
      width:100%;
      min-width:0;
    }

    .form-row {
      display:grid;
      grid-template-columns:repeat(2, 1fr);
      gap:1rem;
      width:100%;
      min-width:0;
    }

    .form-group {
      display:flex;
      flex-direction:column;
      gap:0.5rem;
      min-width:0;
    }

    .form-group.full {
      grid-column:1 / -1;
    }

    .form-group label {
      font-size:0.8rem;
      font-weight:600;
      color:#334155;
      letter-spacing:0.3px;
    }

    .form-grid {
      display:grid;
      grid-template-columns:repeat(2, 1fr);
      gap:1.5rem;
      width:100%;
      min-width:0;
    }

    .col-span-2 {
      grid-column:span 2;
    }

    .input {
      width:100%;
      max-width:100%;
      padding:0.65rem 0.75rem;
      border-radius:8px;
      border:1px solid var(--zinc-200);
      background:#fff;
      box-shadow: 0 1px 2px rgba(16,24,40,0.02);
      font-size:0.9375rem;
      box-sizing:border-box;
      color:var(--zinc-900);
    }

    .input.textarea {
      resize:vertical;
      min-height:80px;
      font-family:inherit;
      line-height:1.5;
    }

    .input:focus {
      outline:none;
      border-color:var(--blue-600);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }

    .textarea {
      padding:0.65rem 0.75rem;
      border-radius:8px;
      border:1px solid var(--zinc-200);
      background:#fff;
      box-shadow: 0 1px 2px rgba(16,24,40,0.02);
      font-size:0.9375rem;
      box-sizing:border-box;
      color:var(--zinc-900);
      resize:vertical;
      min-height:80px;
      font-family:inherit;
      line-height:1.5;
      width:100%;
    }

    .textarea:focus {
      outline:none;
      border-color:var(--blue-600);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }

    /* Info Grid View */
    .info-grid {
      display:grid;
      grid-template-columns:repeat(2, 1fr);
      gap:1.5rem;
      padding:0.5rem 0;
      width:100%;
      min-width:0;
    }

    .info-item {
      display:flex;
      align-items:center;
      gap:1rem;
      padding:0;
      background:transparent;
      border:none;
      border-radius:0;
      min-width:0;
    }

    .info-item:hover {
      background:transparent;
      transform:none;
    }

    .info-icon {
      width:42px;
      height:42px;
      min-width:42px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:12px;
      color:#64748b;
    }

    .info-content {
      flex:1;
      min-width:0;
      display:flex;
      flex-direction:column;
      gap:0.15rem;
      overflow:hidden;
    }

    .info-label {
      font-size:0.7rem;
      font-weight:600;
      text-transform:uppercase;
      letter-spacing:0.5px;
      color:#64748b;
    }

    .info-value {
      font-size:0.95rem;
      font-weight:500;
      color:#0f172a;
      word-break:break-word;
      line-height:1.4;
      overflow-wrap:anywhere;
    }

    .info-value a {
      color:#2563eb;
      text-decoration:none;
      font-weight:600;
    }

    .info-value a:hover {
      text-decoration:underline;
    }

    .link {
      color:#2563eb;
      text-decoration:none;
      font-weight:600;
    }

    .link:hover {
      text-decoration:underline;
    }

    .readonly-value {
      padding:0.65rem 0.75rem;
      background:#f8fafc;
      border-radius:8px;
      font-size:0.95rem;
      color:#475569;
      min-height:44px;
      display:flex;
      align-items:center;
    }

    /* Responsive */
    @media (max-width:1200px){ .profile-layout { grid-template-columns:280px 1fr; gap:1.5rem; } }
    @media (max-width:900px){ .profile-layout { grid-template-columns:1fr; } .profile-sidebar { position:static; } .content-grid { grid-template-columns:1fr; } }
    @media (max-width:600px){ .stats-row { grid-template-columns:1fr; } .info-grid,.form-row,.form-grid { grid-template-columns:1fr; } .col-span-2 { grid-column:span 1 !important; } .avatar-img,.avatar-initial{ width:90px; height:90px; } .name { font-size:1.1rem; } }
    `
  ]
})
export class EncadrantProfileComponent implements OnInit {
  profile: any = null;
  editMode = false;
  editData: any = {};
  profileImage: string | null = null;
  stats = { doctorants: 0, soutenances: 0, publications: 0 };
  
  modalConfig = {
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'confirm',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Annuler'
  };

  private apiUrl = 'http://localhost:8080/api/encadrant';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadStats();
  }

  loadProfile() {
    // First try the encadrant-specific endpoint, fallback to common /api/auth/me
    this.http.get(`${this.apiUrl}/profile`).subscribe({
      next: (data: any) => {
        this.profile = data;
        this.profileImage = data.avatarUrl || data.avatar || data.profileImage || null;
        this.editData = { ...data };
      },
      error: (err) => {
        console.error('Error loading encadrant profile:', err);
        // Fallback to common endpoint
        this.http.get('/api/auth/me').subscribe({
          next: (data: any) => {
            this.profile = data;
            this.profileImage = data.avatarUrl || data.avatar || data.profileImage || null;
            this.editData = { ...data };
          },
          error: (fallbackErr) => {
            console.error('Error loading profile from fallback:', fallbackErr);
            const errorMsg = err?.error?.message || fallbackErr?.error?.message || 'Impossible de charger le profil';
            this.showModal('error', 'Erreur', errorMsg);
          }
        });
      }
    });
  }

  loadStats() {
    this.http.get(`${this.apiUrl}/stats`).subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  get userInitials(): string {
    if (!this.profile) return 'E';
    const f = this.profile.firstName?.[0] || '';
    const l = this.profile.lastName?.[0] || '';
    return (f + l).toUpperCase() || 'E';
  }

  onAvatar(event: any) {
    const file = event.target?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${this.apiUrl}/avatar`, formData).subscribe({
      next: (res: any) => {
        this.profileImage = res.avatarUrl || res.url;
        if (this.profile) {
          this.profile.avatarUrl = this.profileImage;
        }
        this.showModal('success', 'Succès', 'Avatar mis à jour');
      },
      error: (err) => {
        console.error('Error uploading avatar:', err);
        this.showModal('error', 'Erreur', "Échec de l'envoi de l'avatar");
      }
    });
  }

  onCvUpload(event: any) {
    const file = event.target?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${this.apiUrl}/cv`, formData).subscribe({
      next: (res: any) => {
        if (this.profile) {
          this.profile.cvUrl = res.cvUrl || res.url;
        }
        this.showModal('success', 'Succès', 'CV téléchargé avec succès');
      },
      error: (err) => {
        console.error('Error uploading CV:', err);
        this.showModal('error', 'Erreur', 'Échec du téléchargement du CV');
      }
    });
  }

  getCvFileName(): string {
    if (!this.profile?.cvUrl) return '';
    const parts = this.profile.cvUrl.split('/');
    return parts[parts.length - 1] || 'cv.pdf';
  }

  cancelEdit() {
    this.editMode = false;
    this.editData = { ...this.profile };
  }

  saveProfile() {
    this.http.put(`${this.apiUrl}/profile`, this.editData).subscribe({
      next: (res: any) => {
        this.profile = res;
        this.editData = { ...res };
        this.editMode = false;
        this.showModal('success', 'Succès', 'Profil mis à jour');
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        this.showModal('error', 'Erreur', 'Échec de la sauvegarde du profil');
      }
    });
  }

  showModal(type: 'success' | 'error' | 'confirm', title: string, message: string) {
    this.modalConfig = {
      isOpen: true,
      type,
      title,
      message,
      confirmText: 'OK',
      cancelText: 'Annuler'
    };
  }

  onModalConfirmed() {
    this.modalConfig.isOpen = false;
  }

  onModalCancelled() {
    this.modalConfig.isOpen = false;
  }
}
