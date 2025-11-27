import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PublicNavbarComponent } from '../../../components/navbar/public-navbar';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';
import { AuthService } from '../../../services/auth.service';
import { CampagnesService } from '../../../services/campagnes.service';
import { ApplicationsService } from '../../../services/applications.service';

interface ChecklistItem {
  id?: number;
  label: string;
  obligatoire: boolean;
}

interface Campagne {
  id?: number;
  nom: string;
  type: 'INSCRIPTION' | 'REINSCRIPTION' | 'SOUTENANCE';
  anneeUniversitaire: string;
  description: string;
  dateOuverture: string;
  dateFermeture: string;
  active: boolean;
  visibilite: 'PUBLIC' | 'INTERNE';
  
  // INSCRIPTION specific
  etablissement?: string;
  ecoleDoctorale?: string;
  logoEcole?: string;
  photoCouverture?: string;
  piecesObligatoires?: string[];
  reglesEligibilite?: string;
  
  // RÉINSCRIPTION specific
  anneeConcernee?: string;
  documentsARenouveler?: string[];
  derogationTroisiemeAnnee?: boolean;
  messageInformatif?: string;
  
  // SOUTENANCE specific
  checklistObligatoire?: ChecklistItem[];
  documentsObligatoires?: string[];
  modeleAutorisation?: string;
  
  // Notifications
  emailOuverture?: string;
  emailRappel?: string;
  emailFermeture?: string;
  
  nombreDossiers?: number;
}

@Component({
  selector: 'campaigns-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PublicNavbarComponent, CandidatNavbarComponent],
  templateUrl: './campaigns.html',
  styles: [`
    :host { display:block; background:#f8fafc; color:#0f172a; min-height:100vh; font-family:'Inter', sans-serif; }
    :host-context(.dark) { background:#0f172a; color:#f1f5f9; }

    .campaigns-shell { max-width:1440px; margin:0 auto; padding:0 1.5rem 3rem; }

    /* Controls */
    /* slightly tighter controls bar to reduce visual height */
    .campaigns-controls { position:sticky; top:0; z-index:30; background:rgba(248,250,252,0.8); backdrop-filter:blur(16px); padding:0.5rem 0; border-bottom:1px solid rgba(226,232,240,0.6); margin-bottom:1rem; }
    :host-context(.dark) .campaigns-controls { background:rgba(15,23,42,0.8); border-color:rgba(51,65,85,0.6); }
    .controls-row { display:flex; gap:1rem; flex-wrap:wrap; align-items:center; justify-content:space-between; }
    .control { display:flex; align-items:center; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:0 1rem; height:48px; font-size:.9rem; transition:.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
    .control:focus-within { border-color:#2563eb; ring:2px solid rgba(37,99,235,0.1); }
    :host-context(.dark) .control { background:#1e293b; border-color:#334155; }
    .control.search { flex:1; min-width:300px; }
    .control.search input { width:100%; border:none; background:transparent; outline:none; margin-left:.75rem; font-size:.95rem; color:#0f172a; }
    :host-context(.dark) .control.search input { color:#f1f5f9; }
    .control.select select { border:none; background:transparent; outline:none; font-weight:600; color:#334155; cursor:pointer; }
    :host-context(.dark) .control.select select { color:#e2e8f0; }

    /* Multi select */
    .control.multi { position:relative; cursor:pointer; }
    .multi-trigger { display:flex; align-items:center; gap:.75rem; background:transparent; border:none; font-weight:600; color:#334155; font-size:.9rem; }
    :host-context(.dark) .multi-trigger { color:#e2e8f0; }
    .multi-panel { position:absolute; top:56px; left:0; width:280px; background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:1rem; box-shadow:0 20px 40px -5px rgba(0,0,0,0.1); z-index:40; }
    :host-context(.dark) .multi-panel { background:#1e293b; border-color:#334155; }
    .multi-options { max-height:200px; overflow-y:auto; display:grid; gap:.5rem; margin-bottom:1rem; }
    .chk { display:flex; align-items:center; gap:.5rem; padding:.25rem; border-radius:6px; cursor:pointer; transition:.1s; }
    .chk:hover { background:#f1f5f9; }
    :host-context(.dark) .chk:hover { background:#334155; }
    .multi-actions { display:flex; justify-content:flex-end; gap:.5rem; }

    /* Stats Strip */
    .stats-strip { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin-bottom:3rem; }
    .stat-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:1.25rem; display:flex; align-items:center; gap:1rem; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); transition:.3s; }
    .stat-card:hover { transform:translateY(-2px); box-shadow:0 10px 15px -3px rgba(0,0,0,0.08); }
    :host-context(.dark) .stat-card { background:#1e293b; border-color:#334155; }
    .stat-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .stat-icon.total { background:#eff6ff; color:#2563eb; }
    .stat-icon.visible { background:#f0fdf4; color:#16a34a; }
    .stat-icon.fav { background:#fff1f2; color:#e11d48; }
    .stat-icon.applied { background:#f5f3ff; color:#7c3aed; }
    :host-context(.dark) .stat-icon.total { background:rgba(37,99,235,0.2); }
    :host-context(.dark) .stat-icon.visible { background:rgba(22,163,74,0.2); }
    :host-context(.dark) .stat-icon.fav { background:rgba(225,29,72,0.2); }
    :host-context(.dark) .stat-icon.applied { background:rgba(124,58,237,0.2); }
    .stat-val { font-size:1.5rem; font-weight:800; line-height:1; margin-bottom:.25rem; }
    .stat-label { font-size:.75rem; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em; }

    /* Grid */
    .campaign-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:2rem; }
    .campaign-card { background:#fff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; transition:all .3s cubic-bezier(0.4, 0, 0.2, 1); display:flex; flex-direction:column; position:relative; }
    .campaign-card:hover { transform:translateY(-6px); box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border-color:#cbd5e1; }
    :host-context(.dark) .campaign-card { background:#1e293b; border-color:#334155; }

    .card-header { position:relative; height:180px; }
    .banner-wrapper { height:100%; width:100%; position:relative; overflow:hidden; }
    .banner { width:100%; height:100%; object-fit:cover; transition:transform .7s ease; }
    .campaign-card:hover .banner { transform:scale(1.08); }
    .overlay-gradient { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); opacity:0.6; }
    
    .status-badge { position:absolute; top:12px; right:12px; padding:.35rem .75rem; border-radius:100px; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#fff; backdrop-filter:blur(4px); box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:2; }
    .st-open { background:rgba(22,163,74,0.9); }
    .st-closing-soon { background:rgba(234,88,12,0.9); }
    .st-closed { background:rgba(100,116,139,0.9); }

    .fav-btn { position:absolute; top:12px; left:12px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.9); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:.2s; z-index:2; color:#94a3b8; box-shadow:0 2px 4px rgba(0,0,0,0.1); }
    .fav-btn:hover { transform:scale(1.1); }
    .fav-btn.active { color:#e11d48; background:#fff; }
    :host-context(.dark) .fav-btn { background:rgba(30,41,59,0.9); }

    .logo-box { position:absolute; bottom:-24px; left:1.5rem; width:64px; height:64px; background:#fff; border-radius:16px; padding:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); z-index:10; display:flex; align-items:center; justify-content:center; border:2px solid #fff; }
    :host-context(.dark) .logo-box { background:#1e293b; border-color:#1e293b; }
    .logo-box img { max-width:100%; max-height:100%; object-fit:contain; border-radius:12px; }

    .card-body { padding:2rem 1.5rem 1.5rem; flex:1; display:flex; flex-direction:column; }
    .uni-name { display:flex; align-items:center; gap:.5rem; font-size:.8rem; font-weight:600; color:#64748b; margin-bottom:.5rem; }
    .card-title { font-size:1.25rem; font-weight:700; line-height:1.4; margin:0 0 1rem; color:#0f172a; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; height:2.8em; }
    :host-context(.dark) .card-title { color:#f8fafc; }

    .card-tags { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1.5rem; }
    .tag { background:#f1f5f9; color:#475569; padding:.25rem .6rem; border-radius:6px; font-size:.7rem; font-weight:600; }
    .tag.more { background:#e2e8f0; color:#64748b; }
    :host-context(.dark) .tag { background:#334155; color:#cbd5e1; }

    .meta-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; padding-top:1rem; border-top:1px solid #e2e8f0; margin-top:auto; }
    :host-context(.dark) .meta-grid { border-color:#334155; }
    .meta-item { display:flex; flex-direction:column; gap:.25rem; }
    .meta-item .label { font-size:.65rem; text-transform:uppercase; color:#94a3b8; font-weight:600; letter-spacing:.05em; }
    .meta-item .value { font-size:.85rem; font-weight:600; color:#334155; }
    .meta-item .value.urgent { color:#dc2626; }
    .meta-item .value.highlight { color:#2563eb; }
    :host-context(.dark) .meta-item .value { color:#e2e8f0; }

    .card-footer { padding:1rem 1.5rem 1.5rem; display:flex; gap:1rem; }
    .btn-apply { flex:1; background:#2563eb; color:#fff; border:none; padding:.75rem; border-radius:10px; font-weight:600; font-size:.9rem; cursor:pointer; transition:.2s; box-shadow:0 4px 6px -1px rgba(37,99,235,0.2); }
    .btn-apply:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); box-shadow:0 6px 8px -1px rgba(37,99,235,0.3); }
    .btn-apply:disabled { background:#94a3b8; cursor:not-allowed; box-shadow:none; }
    
    .btn-details { flex:1; background:#fff; color:#334155; border:1px solid #cbd5e1; padding:.75rem; border-radius:10px; font-weight:600; font-size:.9rem; cursor:pointer; transition:.2s; }
    .btn-details:hover { border-color:#94a3b8; background:#f8fafc; }
    :host-context(.dark) .btn-details { background:#0f172a; border-color:#334155; color:#e2e8f0; }
    :host-context(.dark) .btn-details:hover { background:#1e293b; }

    /* Buttons General */
    .btn-primary { background:#2563eb; color:#fff; border:none; padding:.75rem 1.5rem; border-radius:10px; font-weight:600; cursor:pointer; transition:.2s; }
    .btn-primary:hover { background:#1d4ed8; }
    .btn-outline { background:transparent; border:1px solid #cbd5e1; color:#334155; padding:.75rem 1.5rem; border-radius:10px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:.5rem; transition:.2s; }
    .btn-outline:hover { border-color:#94a3b8; background:#f8fafc; }

    .load-more { text-align:center; margin-top:3rem; }
    .btn-load { background:#fff; border:1px solid #e2e8f0; padding:1rem 2.5rem; border-radius:12px; font-weight:600; color:#334155; cursor:pointer; transition:.2s; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
    .btn-load:hover { border-color:#cbd5e1; transform:translateY(-1px); box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); }

    /* About Section */
    .about-section { padding:5rem 2rem; background:#ffffff; position:relative; overflow:hidden }
    :host-context(.dark) .about-section { background:#0f172a }
    .about-bg { position:absolute; inset:0; background:linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05)); }
    .about-overlay { position:absolute; inset:0; background:radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1), transparent 50%); }
    .about-pattern { position:absolute; inset:0; background-image:radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px); background-size:20px 20px; }
    :host-context(.dark) .about-pattern { background-image:radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px); }
    .about-container { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:start; position:relative; z-index:1 }
    .about-content { max-width:540px; padding-right:1rem; }
    .about-intro { margin-bottom:2rem }
    .section-badge { display:inline-block; padding:0.5rem 1rem; background:rgba(37,99,235,0.1); color:#2563eb; border-radius:100px; font-size:0.875rem; font-weight:600; margin-bottom:1rem; }
    :host-context(.dark) .section-badge { background:rgba(59,130,246,0.1); color:#60a5fa; }
    .section-title { font-size:2.5rem; font-weight:800; letter-spacing:-0.02em; line-height:1.1; margin:0 0 1rem; color:#0f172a; }
    :host-context(.dark) .section-title { color:#f8fafc; }
    .about-text { font-size:1rem; line-height:1.7; color:#475569; margin:0 }
    :host-context(.dark) .about-text { color:#94a3b8 }
    .about-stats { display:flex; gap:2rem; margin:2rem 0; border-top:1px solid #e2e8f0; padding-top:1.5rem; flex-wrap:wrap }
    :host-context(.dark) .about-stats { border-color:rgba(255,255,255,0.1) }
    .stat-item { display:flex; flex-direction:column; text-align:center; flex:1; min-width:100px }
    .stat-number { font-size:2rem; font-weight:800; color:#2563eb; line-height:1; margin-bottom:0.25rem }
    :host-context(.dark) .stat-number { color:#60a5fa }
    .stat-label { font-size:0.75rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.5px }
    :host-context(.dark) .stat-label { color:#94a3b8 }
    .stat-divider { width:1px; height:50px; background:#e2e8f0; align-self:center }
    :host-context(.dark) .stat-divider { background:rgba(255,255,255,0.1) }
    .about-features { display:grid; gap:1rem; margin-bottom:2rem }
    .feature-card { padding:1.25rem; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; transition:all 0.3s ease; display:flex; flex-direction:column; gap:0.5rem }
    .feature-card:hover { transform:translateY(-2px); box-shadow:0 8px 16px rgba(0,0,0,0.08); border-color:#cbd5e1 }
    :host-context(.dark) .feature-card { background:#1e293b; border-color:#334155 }
    :host-context(.dark) .feature-card:hover { box-shadow:0 8px 16px rgba(0,0,0,0.3) }
    .feature-icon { width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:white; display:flex; align-items:center; justify-content:center; margin-bottom:0.5rem }
    .feature-card h4 { font-size:1.125rem; font-weight:700; margin:0 0 0.25rem; color:#0f172a }
    :host-context(.dark) .feature-card h4 { color:#f1f5f9 }
    .feature-card p { font-size:0.875rem; color:#64748b; margin:0; line-height:1.5 }
    :host-context(.dark) .feature-card p { color:#94a3b8 }
    .about-cta { display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1rem }
    .error-message { margin-top:2rem; padding:1rem; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; color:#dc2626; font-weight:600 }
    :host-context(.dark) .error-message { background:#451a1a; border-color:#7f1d1d; color:#fca5a5 }

    .about-visual { position:relative; height:550px; width:100%; display:flex; align-items:center; justify-content:center }
    .visual-mockup { position:relative; height:100%; width:100%; max-width:500px }
    .mockup-screen { position:absolute; top:0; left:0; right:60px; bottom:60px; background:#fff; border-radius:16px; box-shadow:0 20px 40px -10px rgba(0,0,0,0.2); border:1px solid #e2e8f0; overflow:hidden; display:flex; flex-direction:column }
    :host-context(.dark) .mockup-screen { background:#1e293b; border-color:#334155; box-shadow:0 20px 40px -10px rgba(0,0,0,0.5) }
    .screen-header { padding:1rem 1.5rem; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; gap:0.75rem }
    :host-context(.dark) .screen-header { border-color:#334155 }
    .dots { display:flex; gap:6px }
    .dot { width:10px; height:10px; border-radius:50% }
    .dot.red { background:#ef4444 }
    .dot.yellow { background:#f59e0b }
    .dot.green { background:#22c55e }
    .screen-title { font-size:1rem; font-weight:700; color:#0f172a }
    :host-context(.dark) .screen-title { color:#f1f5f9 }
    .screen-content { flex:1; padding:1rem 1.5rem; display:flex; flex-direction:column; gap:0.75rem; overflow-y:auto }
    .mock-card { background:#f8fafc; border-radius:10px; padding:0.875rem; border:1px solid #e2e8f0; display:flex; gap:0.875rem; transition:transform 0.2s ease }
    .mock-card:hover { transform:translateY(-1px) }
    :host-context(.dark) .mock-card { background:#334155; border-color:#475569 }
    .mock-banner { width:70px; height:52px; border-radius:8px; background-size:cover; background-position:center; flex-shrink:0 }
    .mock-info { flex:1; display:flex; flex-direction:column; gap:0.25rem }
    .mock-info h5 { font-size:0.9rem; font-weight:700; margin:0; color:#0f172a }
    :host-context(.dark) .mock-info h5 { color:#f1f5f9 }
    .mock-info p { font-size:0.8rem; color:#64748b; margin:0 }
    :host-context(.dark) .mock-info p { color:#94a3b8 }
    .mock-status { align-self:flex-start; padding:0.2rem 0.6rem; border-radius:20px; font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:0.02em }
    .mock-status.open { background:#dcfce7; color:#166534 }
    .mock-status.closing { background:#fef3c7; color:#92400e }
    .mock-status.upcoming { background:#dbeafe; color:#1e40af }
    :host-context(.dark) .mock-status.open { background:rgba(34,197,94,0.2); color:#bbf7d0 }
    :host-context(.dark) .mock-status.closing { background:rgba(245,158,11,0.2); color:#fcd34d }
    :host-context(.dark) .mock-status.upcoming { background:rgba(59,130,246,0.2); color:#93c5fd }
    .mock-row { display:flex; align-items:center; gap:0.75rem; padding:0.6rem; border-radius:10px; background:linear-gradient(180deg, rgba(248,250,252,0.9), rgba(248,250,252,0.85)); border:1px solid #e6edf7; }
    :host-context(.dark) .mock-row { background:linear-gradient(180deg, rgba(30,41,59,0.95), rgba(30,41,59,0.9)); border:1px solid #334155 }
    .mock-banner { width:56px; height:44px; border-radius:8px; background-size:cover; background-position:center; flex-shrink:0; box-shadow:0 4px 8px rgba(2,6,23,0.04); }
    .mock-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px }
    .mock-main h5 { margin:0; font-size:0.95rem; font-weight:700; color:#0f172a }
    :host-context(.dark) .mock-main h5 { color:#f8fafc }
    .mock-main .muted { margin:0; font-size:0.78rem; color:#64748b }
    :host-context(.dark) .mock-main .muted { color:#94a3b8 }
    .mock-actions { display:flex; align-items:center; justify-content:flex-end; min-width:80px }
    .mock-status { display:inline-block; padding:0.25rem 0.6rem; border-radius:999px; font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.03em }
    .mock-status.open { background:#dcfce7; color:#166534 }
    .mock-status.closing { background:#fef3c7; color:#92400e }
    .mock-status.upcoming { background:#dbeafe; color:#1e40af }
    :host-context(.dark) .mock-status.open { background:rgba(34,197,94,0.12); color:#bbf7d0 }
    :host-context(.dark) .mock-status.closing { background:rgba(245,158,11,0.12); color:#fcd34d }
    :host-context(.dark) .mock-status.upcoming { background:rgba(59,130,246,0.12); color:#93c5fd }

    .screen-header { display:flex; align-items:center; gap:0.75rem; padding:0.8rem 1rem; }
    .spacer { flex:1 }
    .mini-actions { display:flex; gap:0.5rem }
    .mini-btn { background:transparent; border:1px solid #e6edf7; color:#2563eb; padding:0.35rem 0.6rem; border-radius:8px; font-weight:700; font-size:0.85rem; cursor:pointer }
    :host-context(.dark) .mini-btn { border-color:#334155; color:#93c5fd }

    /* Floating counters redesigned as compact pills with icon */
    .floating-stats { position:absolute; bottom:16px; right:16px; display:flex; gap:0.75rem; z-index:20 }
    .float-stat { background:linear-gradient(180deg,#ffffff,#f8fafc); color:#0f172a; padding:0.5rem 0.9rem; border-radius:999px; box-shadow:0 8px 24px rgba(2,6,23,0.08); display:flex; align-items:center; gap:0.6rem; min-width:120px; border:1px solid rgba(15,23,42,0.04) }
    .float-stat .icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:#eef2ff; color:#3730a3; flex-shrink:0; }
    .float-stat strong { font-size:1.25rem; font-weight:800; line-height:1 }
    .float-stat span { font-size:0.75rem; color:#64748b; display:block; margin-top:-2px }
    :host-context(.dark) .float-stat { background:linear-gradient(180deg,#0f172a,#0b1220); border-color:rgba(255,255,255,0.04); box-shadow:0 8px 24px rgba(2,6,23,0.4); color:#e6eefb }
    :host-context(.dark) .float-stat .icon { background:rgba(99,102,241,0.12); color:#c7d2fe }

    /* Responsive: stack on small screens */
    @media (max-width: 640px) {
      .floating-stats { right:12px; bottom:12px; gap:0.5rem; flex-direction:column-reverse; align-items:flex-end }
      .float-stat { min-width:100px; padding:0.45rem 0.75rem }
      .float-stat .icon { width:32px; height:32px }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .campaign-grid { grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); }
      .about-container { grid-template-columns:1fr; gap:2rem; }
      .about-content { max-width:100%; padding-right:0; }
      .about-visual { height:450px; margin-top:2rem; }
      .visual-mockup { max-width:100%; }
    }
    @media (max-width: 768px) {
      .hero-title { font-size:2.5rem; }
      .controls-row { flex-direction:column; align-items:stretch; }
      .control.search { min-width:auto; }
      .stats-strip { grid-template-columns:1fr 1fr; }
    }

    /* Modal (application form) */
    .modal-overlay { position: fixed; inset: 0; background: rgba(2,6,23,0.45); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1.25rem; }
    .modal-container { background: #fff; width:100%; max-width:980px; max-height:90vh; overflow:auto; border-radius:12px; box-shadow:0 20px 50px rgba(2,6,23,0.4); border:1px solid rgba(226,232,240,0.6); }
    :host-context(.dark) .modal-container { background:#071127; color:#e6eefb; border-color:rgba(51,65,85,0.6); }
    .modal-header { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(230,237,247,0.8); }
    :host-context(.dark) .modal-header { border-bottom-color:rgba(51,65,85,0.6); }
    .modal-body { padding:16px; }
    .modal-close { background:transparent; border:1px solid #e6edf7; padding:6px 8px; border-radius:6px; cursor:pointer; }
    :host-context(.dark) .modal-close { border-color:#334155; }

    .application-form .form-section { margin-bottom:1rem; }
    .application-form .form-row { display:flex; gap:1rem; flex-wrap:wrap; }
    .application-form .form-group { flex:1; min-width:180px; display:flex; flex-direction:column; gap:6px; }
    .application-form .form-group input,
    .application-form .form-group select,
    .application-form .form-group textarea { padding:0.5rem; border:1px solid #e2e8f0; border-radius:6px; background:transparent; }
    :host-context(.dark) .application-form .form-group input,
    :host-context(.dark) .application-form .form-group select,
    :host-context(.dark) .application-form .form-group textarea { background:transparent; border-color:#334155; color:#e6eefb; }

    .form-actions { display:flex; justify-content:flex-end; gap:0.75rem; padding:12px 0; }
    .btn-cancel { background:transparent; border:1px solid #cbd5e1; padding:.6rem 1rem; border-radius:8px; cursor:pointer; }
    .btn-submit { background:#2563eb; color:#fff; border:none; padding:.6rem 1rem; border-radius:8px; cursor:pointer; }

    .submit-error { margin-top:0.75rem; color:#b91c1c; background:#fee2e2; padding:.6rem; border-radius:6px; }
    .submit-success { margin-top:0.75rem; color:#065f46; background:#ecfdf5; padding:.6rem; border-radius:6px; }

    /* Wizard Styles */
    .wizard-progress { display:flex; justify-content:space-between; margin-bottom:2rem; position:relative; }
    .wizard-progress::before { content:''; position:absolute; top:14px; left:0; right:0; height:2px; background:#e2e8f0; z-index:0; }
    :host-context(.dark) .wizard-progress::before { background:#334155; }
    .step-indicator { position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; gap:0.5rem; cursor:pointer; }
    .step-num { width:30px; height:30px; border-radius:50%; background:#fff; border:2px solid #e2e8f0; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem; color:#64748b; transition:.2s; }
    :host-context(.dark) .step-num { background:#1e293b; border-color:#334155; color:#94a3b8; }
    .step-indicator.active .step-num { border-color:#2563eb; background:#2563eb; color:#fff; box-shadow:0 0 0 4px rgba(37,99,235,0.1); }
    .step-indicator.completed .step-num { border-color:#2563eb; background:#2563eb; color:#fff; }
    .step-label { font-size:0.75rem; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; }
    .step-indicator.active .step-label { color:#2563eb; }
    
    .wizard-step { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    
    .file-upload-box { border:2px dashed #cbd5e1; border-radius:8px; padding:1.5rem; text-align:center; transition:.2s; cursor:pointer; position:relative; }
    .file-upload-box:hover { border-color:#2563eb; background:#f8fafc; }
    :host-context(.dark) .file-upload-box { border-color:#475569; }
    :host-context(.dark) .file-upload-box:hover { background:#1e293b; border-color:#60a5fa; }
    .file-input { position:absolute; inset:0; opacity:0; cursor:pointer; }
    .file-info { display:flex; flex-direction:column; align-items:center; gap:0.5rem; pointer-events:none; }
    .file-name { font-size:0.9rem; font-weight:600; color:#2563eb; }
  `]
})
export class CampaignsPage implements OnInit {
  campaigns = signal<Campagne[]>([]);
  filteredCampaigns = signal<Campagne[]>([]);
  visibleCampaigns = signal<Campagne[]>([]);

  // Filters & state
  searchQuery = signal('');
  selectedTypes = signal<string[]>([]);
  allTypes = ['INSCRIPTION', 'REINSCRIPTION', 'SOUTENANCE'];
  showTypes = signal(false);
  filterStatus = signal<'all' | 'active' | 'upcoming' | 'ended'>('all');
  sortKey = signal<'relevance' | 'deadline' | 'recent'>('relevance');
  showFavorites = signal(false);
  showApplied = signal(false);

  favorites = signal(new Set<number>());
  appliedCampaignIds = signal(new Set<number>());

  totalCampaigns = signal(0);
  pageSize = 9;
  fetchError = signal('');

  // Application modal + form state
  showApplicationModal = signal(false);
  selectedCampaign = signal<Campagne | null>(null);
  
  // Wizard state
  currentStep = signal(1);
  totalSteps = 4;
  
  // Form model matching InscriptionFormDTO
  applicationForm: any = {
    // Step 1: Personal
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    lieuNaissance: '',
    nationalite: '',
    cin: '',
    adresse: '',
    sexe: 'M',
    
    // Step 2: Academic
    highestDegree: '', // mapped to diplomesPrecedents or handled separately
    etablissementOrigine: '',
    diplomesPrecedents: '', // description
    
    // Step 3: Research
    sujetThese: '',
    directeurThese: '',
    laboratoire: '',
    
    // Terms
    acceptTerms: false
  };

  // Uploaded files map: key -> File | File[]
  uploadedFiles = signal<Record<string, File | File[]>>({});

  submitting = signal(false);
  submitError = signal('');
  submitSuccess = signal('');
  
  currentUserId: number | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    public auth: AuthService,
    private campagnesService: CampagnesService,
    private applicationsService: ApplicationsService
  ) {}

  get isLoggedIn(): boolean { return this.auth.isLoggedIn ? this.auth.isLoggedIn() : false; }

  ngOnInit(): void {
    this.loadFavorites();
    
    if (this.isLoggedIn) {
      this.auth.getProfile().subscribe({
        next: (user: any) => {
          if (user && user.id) {
            this.currentUserId = user.id;
            // Pre-fill form
            this.applicationForm.prenom = user.prenom || this.applicationForm.prenom;
            this.applicationForm.nom = user.nom || this.applicationForm.nom;
            this.applicationForm.email = user.email || this.applicationForm.email;
          }
        },
        error: () => console.log('[CampaignsPage] Failed to load user profile')
      });
    }

    try {
      this.route.queryParams.subscribe(params => {
        const f = params['favorites'];
        const a = params['applied'];
        this.showFavorites.set(f === '1' || f === 'true' || f === true);
        this.showApplied.set(a === '1' || a === 'true' || a === true);
        // if applied filter is active, disable favorites filter
        if (this.showApplied()) this.showFavorites.set(false);
        this.applyFilters();
      });
    } catch (e) { /* ignore */ }
    this.loadCampaigns();
    document.addEventListener('click', () => this.showTypes.set(false));
  }
  
  loadCampaigns(): void {
    this.fetchError.set('');
    console.log('[CampaignsPage] Requesting public active campagnes from', this.campagnesService);
    this.campagnesService.getActiveCampaigns().subscribe({
      next: (data: any) => {
        console.log('[CampaignsPage] public active response:', data && data.length ? data.length : 0, data);
        const mapped: Campagne[] = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: c.id,
          nom: c.nom,
          type: (c.type as any) || 'INSCRIPTION',
          anneeUniversitaire: c.anneeUniversitaire || '',
          description: c.description || '',
          dateOuverture: c.dateOuverture,
          dateFermeture: c.dateFermeture,
          active: c.active,
          visibilite: (c.visibilite as any) || 'PUBLIC',
          etablissement: c.etablissement,
          ecoleDoctorale: c.ecoleDoctorale,
          logoEcole: c.logoEcole,
          photoCouverture: c.photoCouverture,
          piecesObligatoires: c.piecesObligatoires || [],
          reglesEligibilite: c.reglesEligibilite,
          anneeConcernee: c.anneeConcernee,
          documentsARenouveler: c.documentsARenouveler || [],
          derogationTroisiemeAnnee: c.derogationTroisiemeAnnee,
          messageInformatif: c.messageInformatif,
          checklistObligatoire: c.checklistObligatoire || [],
          documentsObligatoires: c.documentsObligatoires || [],
          modeleAutorisation: c.modeleAutorisation,
          emailOuverture: c.emailOuverture,
          emailRappel: c.emailRappel,
          emailFermeture: c.emailFermeture,
          nombreDossiers: c.nombreDossiers || 0
        }));
        this.campaigns.set(mapped);
        this.totalCampaigns.set(mapped.length);
        this.applyFilters();
      },
      error: (err) => {
        console.error('[CampaignsPage] Error loading campaigns:', err);
        this.fetchError.set('Impossible de charger les campagnes publiques. Vérifiez que le service d\'inscription tourne sur le port 8092 et que le proxy est configuré.');
        this.campaigns.set([]);
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let list = this.campaigns().slice();

    // Only show PUBLIC campaigns
    list = list.filter(c => c.visibilite === 'PUBLIC');

    // Search
    const query = this.searchQuery();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => 
        c.nom.toLowerCase().includes(q) || 
        (c.etablissement && c.etablissement.toLowerCase().includes(q)) || 
        (c.ecoleDoctorale && c.ecoleDoctorale.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }

    // Types multi-select
    const types = this.selectedTypes();
    if (types.length) {
      list = list.filter(c => types.includes(c.type));
    }

    // Status
    const status = this.filterStatus();
    if (status !== 'all') {
      const now = new Date();
      list = list.filter(c => {
        const ouverture = new Date(c.dateOuverture);
        const fermeture = new Date(c.dateFermeture);
        
        if (status === 'active') return c.active && now >= ouverture && now <= fermeture;
        if (status === 'upcoming') return now < ouverture;
        if (status === 'ended') return now > fermeture;
        return true;
      });
    }

    // Favorites
    if (this.showFavorites()) {
      const favs = this.favorites();
      list = list.filter(c => c.id && favs.has(c.id));
    }

    // Applied / Candidatures: show only campaigns the user has applied to
    if (this.showApplied()) {
      const applied = this.appliedCampaignIds();
      list = list.filter(c => c.id && applied.has(c.id));
    }

    this.filteredCampaigns.set(list);
    this.sortCampaigns(false);
  }

  sortCampaigns(apply = true): void {
    const key = this.sortKey();
    const arr = this.filteredCampaigns();
    arr.sort((a,b) => {
      switch (key) {
        case 'deadline': 
          return new Date(a.dateFermeture).getTime() - new Date(b.dateFermeture).getTime();
        case 'recent': 
          return new Date(b.dateOuverture).getTime() - new Date(a.dateOuverture).getTime();
        default: 
          return a.nom.localeCompare(b.nom);
      }
    });
    this.filteredCampaigns.set([...arr]);
    this.resetPagination();
  }

  resetPagination(): void {
    const filtered = this.filteredCampaigns();
    this.visibleCampaigns.set(filtered.slice(0, this.pageSize));
  }

  loadMore(): void {
    const current = this.visibleCampaigns();
    const filtered = this.filteredCampaigns();
    const next = current.length + this.pageSize;
    this.visibleCampaigns.set(filtered.slice(0, next));
  }

  toggleTypes(): void { 
    this.showTypes.set(!this.showTypes()); 
  }
  
  toggleType(type: string, checked: boolean): void {
    const types = this.selectedTypes();
    if (checked) { 
      if (!types.includes(type)) this.selectedTypes.set([...types, type]); 
    } else { 
      this.selectedTypes.set(types.filter(t => t !== type)); 
    }
  }
  
  clearTypes(): void { 
    this.selectedTypes.set([]); 
  }

  toggleFavorite(id: number): void {
    const favs = new Set(this.favorites());
    if (favs.has(id)) favs.delete(id); 
    else favs.add(id);
    this.favorites.set(favs);
    this.saveFavorites();
    if (this.showFavorites()) this.applyFilters();
  }
  
  isFavorite(id: number): boolean { 
    return this.favorites().has(id); 
  }

  saveFavorites(): void { 
    try {
      const key = this.getFavoritesKey();
      const arr = JSON.stringify(Array.from(this.favorites()));
      localStorage.setItem(key, arr);
      // also keep legacy global key in sync for older pages
      try { localStorage.setItem('campaign_favorites', arr); } catch (e) {}
    } catch {}
  }
  
  loadFavorites(): void {
    try {
      const key = this.getFavoritesKey();
      const raw = localStorage.getItem(key);
      if (raw) this.favorites.set(new Set(JSON.parse(raw)));
      else {
        // fallback to global key for older saved data
        const old = localStorage.getItem('campaign_favorites');
        if (old) this.favorites.set(new Set(JSON.parse(old)));
      }
    } catch {}
  }

  saveApplied(): void {
    try {
      const key = this.getAppliedKey();
      localStorage.setItem(key, JSON.stringify(Array.from(this.appliedCampaignIds())));
    } catch (e) { /* ignore */ }
  }

  loadApplied(): void {
    try {
      const key = this.getAppliedKey();
      const raw = localStorage.getItem(key);
      if (raw) this.appliedCampaignIds.set(new Set(JSON.parse(raw)));
      else {
        const old = localStorage.getItem('campaign_applied');
        if (old) this.appliedCampaignIds.set(new Set(JSON.parse(old)));
      }
    } catch (e) { /* ignore */ }
  }

  private getAppliedKey(): string {
    try {
      const token = this.auth.getToken ? this.auth.getToken() : null;
      if (!token) return 'campaign_applied';
      const parts = token.split('.');
      if (parts.length < 2) return 'campaign_applied';
      const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
      const id = payload.email || payload.sub || payload.username || payload.user || payload.name || payload.id;
      if (id) return `campaign_applied_${String(id).toLowerCase().replace(/[^a-z0-9@.\-]/g,'_')}`;
    } catch (e) { /* ignore */ }
    return 'campaign_applied';
  }

  // Build a storage key for favorites. If user is logged in, use token payload (email or sub) to namespace
  private getFavoritesKey(): string {
    try {
      const token = this.auth.getToken ? this.auth.getToken() : null;
      if (!token) return 'campaign_favorites';
      const parts = token.split('.');
      if (parts.length < 2) return 'campaign_favorites';
      const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
      const id = payload.email || payload.sub || payload.username || payload.user || payload.name || payload.id;
      if (id) return `campaign_favorites_${String(id).toLowerCase().replace(/[^a-z0-9@.\-]/g,'_')}`;
    } catch (e) { /* ignore */ }
    return 'campaign_favorites';
  }

  applyToCampaign(c: Campagne): void {
    if (!c.id) return;
    const status = this.getCampagneStatus(c);
    if (status === 'ended' || !c.active || this.hasApplied(c.id)) return;

    // Require authentication and candidate role
    if (!this.isLoggedIn) {
      // not logged in -> redirect to sign-in with returnUrl
      this.router.navigate(['/auth'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // normalize role string (handle ROLE_CANDIDAT / CANDIDAT / candidat)
    let role = '';
    try { role = (this.auth.role && typeof this.auth.role === 'function') ? (this.auth.role() || '') : (this.auth.role || ''); } catch (e) { role = '' }
    const normalized = String(role).toLowerCase().replace(/^role_/, '');
    if (normalized !== 'candidat') {
      // not a candidate -> redirect to sign-in (or role request flow)
      this.router.navigate(['/auth'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Open application modal and set selected campaign
    this.selectedCampaign.set(c);
    this.showApplicationModal.set(true);
  }
  
  hasApplied(id: number): boolean { 
    return this.appliedCampaignIds().has(id); 
  }

  viewDetails(c: Campagne): void {
    if (c.id) {
      this.router.navigate(['/campaigns', c.id]);
    }
  }

  getCampagneStatus(c: Campagne): 'active' | 'upcoming' | 'ended' {
    const now = new Date();
    const ouverture = new Date(c.dateOuverture);
    const fermeture = new Date(c.dateFermeture);
    
    if (!c.active) return 'ended';
    if (now < ouverture) return 'upcoming';
    if (now > fermeture) return 'ended';
    return 'active';
  }

  getStatusLabel(c: Campagne): string {
    const status = this.getCampagneStatus(c);
    return ({ 'active':'Ouverte','upcoming':'À venir','ended':'Fermée' } as any)[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels = {
      INSCRIPTION: 'Inscription',
      REINSCRIPTION: 'Réinscription',
      SOUTENANCE: 'Soutenance'
    };
    return labels[type as keyof typeof labels] || type;
  }

  isClosingSoon(c: Campagne): boolean {
    const fermeture = new Date(c.dateFermeture);
    const diff = fermeture.getTime() - Date.now();
    const days = diff / 86400000;
    return days <= 7 && days > 0;
  }

  daysLeft(c: Campagne): number {
    const fermeture = new Date(c.dateFermeture);
    const d = Math.ceil((fermeture.getTime() - Date.now()) / 86400000);
    return d < 0 ? 0 : d;
  }

  trackById(_: number, c: Campagne) { 
    return c.id; 
  }

  refresh(): void { 
    this.loadCampaigns(); 
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedTypes.set([]);
    this.filterStatus.set('all');
    this.sortKey.set('relevance');
    this.showFavorites.set(false);
    this.applyFilters();
  }

  onImgError(e: any): void { 
    try { e.target.style.visibility = 'hidden'; } catch {} 
  }

  closeApplicationModal(): void {
    this.showApplicationModal.set(false);
    this.selectedCampaign.set(null);
    this.submitError.set('');
    this.submitSuccess.set('');
    this.submitting.set(false);
    this.currentStep.set(1);
    this.applicationForm = {
      prenom: '', nom: '', email: '', telephone: '', dateNaissance: '', lieuNaissance: '', nationalite: '', cin: '', adresse: '', sexe: 'M',
      highestDegree: '', etablissementOrigine: '', diplomesPrecedents: '',
      sujetThese: '', directeurThese: '', laboratoire: '',
      acceptTerms: false
    };
    this.uploadedFiles.set({});
  }

  // Handle file input changes from template
  onFileChange(e: any, key: string, multiple = false): void {
    const target = e.target as HTMLInputElement;
    if (!target || !target.files) return;
    if (multiple) {
      const arr = Array.from(target.files);
      this.uploadedFiles.update(m => ({ ...m, [key]: arr }));
    } else {
      const f = target.files[0];
      this.uploadedFiles.update(m => ({ ...m, [key]: f }));
    }
  }

  getFileName(key: string): string {
    const fileOrFiles = this.uploadedFiles()[key];
    if (!fileOrFiles) return '';
    if (Array.isArray(fileOrFiles)) {
      return fileOrFiles.length > 0 ? `${fileOrFiles.length} fichiers` : '';
    }
    return (fileOrFiles as File).name;
  }
  
  nextStep(): void {
    const step = this.currentStep();
    if (this.validateStep(step)) {
      this.currentStep.set(step + 1);
    }
  }
  
  prevStep(): void {
    const step = this.currentStep();
    if (step > 1) this.currentStep.set(step - 1);
  }
  
  goToStep(step: number): void {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  validateStep(step: number): boolean {
    this.submitError.set('');
    const f = this.applicationForm;
    
    if (step === 1) {
      if (!f.prenom || !f.nom || !f.email || !f.telephone || !f.dateNaissance || !f.cin) {
        this.submitError.set('Veuillez remplir tous les champs obligatoires.');
        return false;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) {
        this.submitError.set('Email invalide.');
        return false;
      }
    }
    
    if (step === 2) {
      if (!f.highestDegree || !f.etablissementOrigine) {
        this.submitError.set('Veuillez renseigner votre parcours académique.');
        return false;
      }
    }
    
    if (step === 3) {
      if (!f.sujetThese) {
        this.submitError.set('Le sujet de thèse est obligatoire.');
        return false;
      }
    }
    
    return true;
  }

  // Validate required fields and files before submit
  validateApplication(): string | null {
    // Final validation (files)
    const files = this.uploadedFiles();
    if (!files['cv']) return 'Le CV (PDF) est requis.';
    if (!files['diplomas']) return 'Les diplômes (PDF) sont requis.';
    if (!this.applicationForm.acceptTerms) return 'Vous devez accepter les termes et conditions.';
    return null;
  }

  submitApplication(e?: Event): void {
    if (e) e.preventDefault();
    this.submitError.set('');
    this.submitSuccess.set('');

    const validation = this.validateApplication();
    if (validation) { this.submitError.set(validation); return; }

    const campaign = this.selectedCampaign();
    if (!campaign || !campaign.id) { this.submitError.set('Campagne invalide.'); return; }

    this.submitting.set(true);

    const form = { ...this.applicationForm };
    if (this.currentUserId) {
      form.doctorantId = this.currentUserId;
    }

    const files = this.uploadedFiles();

    this.applicationsService.submitApplication(campaign.id, form, files).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.submitSuccess.set('Votre candidature a été envoyée avec succès. Nous vous enverrons un email de confirmation.');
        const ids = new Set(this.appliedCampaignIds());
        ids.add(campaign.id!);
        this.appliedCampaignIds.set(ids);
        // persist applied ids for the logged in user
        try { this.saveApplied(); } catch (e) { /* ignore */ }
        // keep modal open briefly to show success
        setTimeout(() => this.closeApplicationModal(), 2500);
      },
      error: (err) => {
        console.error('[CampaignsPage] submitApplication error', err);
        this.submitting.set(false);
        this.submitError.set('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      }
    });
  }
}
