import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModalComponent } from '../../../components/modal/modal';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CandidatNavbarComponent, ModalComponent],
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
    .py-6 { padding-top:1.5rem; padding-bottom:1.5rem; }
    .py-4 { padding-top:1rem; padding-bottom:1rem; }
    .py-3 { padding-top:0.75rem; padding-bottom:0.75rem; }
    .py-2 { padding-top:0.5rem; padding-bottom:0.5rem; }
    .py-1 { padding-top:0.25rem; padding-bottom:0.25rem; }
    .px-4 { padding-left:1rem; padding-right:1rem; }
    .px-3 { padding-left:0.75rem; padding-right:0.75rem; }
    .px-2 { padding-left:0.5rem; padding-right:0.5rem; }
    .p-8 { padding:2rem; }
    .p-6 { padding:1.5rem; }
    .p-4 { padding:1rem; }
    .p-3 { padding:0.75rem; }
    .p-2 { padding:0.5rem; }
    .mb-6 { margin-bottom:1.5rem; }
    .mb-4 { margin-bottom:1rem; }
    .mb-3 { margin-bottom:0.75rem; }
    .mb-2 { margin-bottom:0.5rem; }
    .mb-1 { margin-bottom:0.25rem; }

    /* simple flex / grid helpers */
    .flex { display:flex; }
    .inline-flex { display:inline-flex; }
    .items-start { align-items:flex-start; }
    .items-center { align-items:center; }
    .justify-between { justify-content:space-between; }
    .justify-center { justify-content:center; }
    .flex-1 { flex:1 1 0%; }
    .gap-6 { gap:1.5rem; }
    .gap-4 { gap:1rem; }
    .gap-3 { gap:0.75rem; }
    .gap-2 { gap:0.5rem; }
    .space-y-6 > * + * { margin-top:1.5rem; }
    .space-y-4 > * + * { margin-top:1rem; }
    .space-y-3 > * + * { margin-top:0.75rem; }

    .grid { display:grid; }
    .grid-cols-1 { grid-template-columns: 1fr; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .col-span-2 { grid-column: span 2 / span 2; }
    .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .lg\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0,1fr)); }
    .lg\:col-span-1 { grid-column: span 1 / span 1; }
    .lg\:col-span-2 { grid-column: span 2 / span 2; }
    .lg\:col-span-4 { grid-column: span 4 / span 4; }
    .lg\:col-span-8 { grid-column: span 8 / span 8; }

    /* sticky positioning */
    .sticky { position: sticky; }
    .top-8 { top: 2rem; }

    /* spacing helpers for buttons/blocks */
    .w-full { width:100%; }
    .w-32 { width:8rem; }
    .h-32 { height:8rem; }
    .w-10 { width:2.5rem; }
    .h-10 { height:2.5rem; }
    .h-2 { height:0.5rem; }

    /* borders / rounding / shadows */
    .border-4 { border-width:4px; }
    .border { border-width:1px; }
    .border-zinc-100 { border-color:var(--zinc-100); }
    .border-zinc-300 { border-color:var(--zinc-300); }
    .border-b { border-bottom-width:1px; }
    .rounded-full { border-radius:9999px; }
    .rounded-lg { border-radius:12px; }
    .rounded { border-radius:8px; }
    .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06); }
    .shadow { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
    .hover\:shadow-md:hover { box-shadow: 0 4px 12px rgba(15,23,42,0.1); }

    /* background and text colors */
    .bg-white { background-color: #ffffff; }
    .bg-zinc-50 { background-color: var(--zinc-50); }
    .bg-zinc-100 { background-color: var(--zinc-100); }
    .bg-zinc-200 { background-color: var(--zinc-200); }
    .bg-blue-50 { background-color: var(--blue-50); }
    .bg-blue-100 { background-color: var(--blue-100); }
    .bg-blue-600 { background-color: var(--blue-600); }
    .bg-blue-700 { background-color: var(--blue-700); }
    .bg-green-100 { background-color:#d1fae5; }
    .bg-orange-100 { background-color:#ffedd5; }
    .bg-red-100 { background-color:#fee2e2; }
    .hover\:bg-zinc-50:hover { background-color: var(--zinc-50); }
    .hover\:bg-blue-700:hover { background-color: var(--blue-700); }

    .text-zinc-900 { color: var(--zinc-900); }
    .text-zinc-700 { color: var(--zinc-700); }
    .text-zinc-600 { color: var(--zinc-600); }
    .text-zinc-500 { color: var(--zinc-500); }
    .text-blue-600 { color: var(--blue-600); }
    .text-blue-700 { color:#1d4ed8; }
    .text-green-600 { color:#16a34a; }
    .text-orange-600 { color:#ea580c; }
    .text-red-600 { color:#dc2626; }
    .text-white { color:#fff; }
    .hover\:text-blue-700:hover { color:var(--blue-700); }
    .text-sm { font-size:0.875rem; }
    .text-xs { font-size:0.75rem; }
    .text-base { font-size:1rem; line-height:1.5rem; }
    .text-lg { font-size:1.125rem; line-height:1.75rem; }
    .text-xl { font-size:1.25rem; line-height:1.75rem; }
    .text-2xl { font-size:1.5rem; line-height:2rem; }
    .text-3xl { font-size:1.875rem; line-height:2.25rem; }
    .text-4xl { font-size:2.25rem; line-height:2.5rem; }

    .font-medium { font-weight:500; }
    .font-semibold { font-weight:600; }

    .object-cover { object-fit: cover; }

    /* avatar edit button */
    .avatar-edit { position:absolute; right:0; bottom:0; width:36px; height:36px; border-radius:999px; background:rgba(0,0,0,0.6); color:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer }
    .avatar-edit input{ position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer }

    /* Avatar initials - navbar and profile */
    .profile-initials, .dropdown-avatar-initials { display:flex; align-items:center; justify-content:center; border-radius:50%; color:#fff; font-weight:700; }
    .profile-initials { width:36px; height:36px; font-size:0.875rem; background: #000; }
    .dropdown-avatar-initials { width:72px; height:72px; font-size:1.75rem; background: #000; }

    /* Form labels and inputs follow theme */
    .label{ display:block; font-size:12px; color:var(--zinc-700); margin-bottom:6px; font-weight:600 }
    .input{ width:100%; max-width:100%; padding:0.65rem 0.75rem; border-radius:8px; border:1px solid var(--zinc-200); background:#fff; box-shadow: 0 1px 2px rgba(16,24,40,0.02); font-size:0.9375rem; box-sizing:border-box; }
    .input.textarea { resize:vertical; min-height:80px; font-family:inherit; line-height:1.5; }
    .input:focus { outline:none; border-color:var(--blue-600); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

    /* buttons */
    button { border:none; cursor:pointer; font-family:inherit; }
    .btn { display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.625rem 1.25rem; font-size:0.9375rem; font-weight:500; border-radius:8px; transition:all 0.15s ease; }
    .btn-primary { background:var(--blue-600); color:#fff; }
    .btn-primary:hover { background:var(--blue-700); transform:translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
    .btn-secondary { background:#fff; color:var(--zinc-700); border:1px solid var(--zinc-300); }
    .btn-secondary:hover { background:var(--zinc-50); }
    /* stronger specificity to override external/global styles that may set buttons white */
    .btn.btn-primary { background: var(--blue-600) !important; color: #fff !important; }
    .btn.btn-primary:hover { background: var(--blue-700) !important; }
    .btn.btn-secondary { background: #fff !important; color: var(--zinc-700) !important; border:1px solid var(--zinc-300) !important; }

    /* Save button specific override: change text color */
    .btn-save { color: #000 !important; }

    /* small helpers */
    .inline { display:inline-block; }
    .relative { position:relative; }
    .text-left { text-align:left; }
    .transition-colors { transition: background-color .15s ease, color .15s ease; }
    .cursor-pointer { cursor:pointer; }

    /* dropdown/profile panel */
    .dropdown-content { min-width: 240px; max-width:320px; background:#fff; border-radius:10px; box-shadow: 0 10px 30px rgba(2,6,23,0.12); overflow:hidden; }
    .dropdown-header { display:flex; flex-direction:column; align-items:center; gap:0.75rem; padding:1.25rem; text-align:center }
    .dropdown-email{ font-size:0.95rem; color:var(--zinc-900); }

    /* make profile image crisp */
    img.rounded-full, .dropdown-avatar, .profile-image { border-radius:999px; display:block }

    /* responsive adjustments */
    @media (max-width:800px){ .grid-cols-2{ grid-template-columns:1fr !important } .flex-1 { width:100%; } }
    @media (max-width:480px){ .avatar-edit{ width:32px; height:32px } }
    /* New Layout Aesthetic */
    .profile-layout { display:grid; grid-template-columns: 300px 1fr; gap:2rem; align-items:start; }
    .profile-sidebar { display:flex; flex-direction:column; gap:1.25rem; position:sticky; top:2rem; }
    .profile-main { display:flex; flex-direction:column; gap:1.75rem; min-width:0; }
    /* Profile Card */
    .profile-card { background:#fff; border-radius:16px; padding:2rem 1.5rem 1.75rem; box-shadow:0 4px 20px rgba(2,6,23,0.08); display:flex; flex-direction:column; align-items:center; gap:1rem; position:relative; }
    .avatar-block { position:relative; }
    .avatar-img, .avatar-initial { width:100px; height:100px; border-radius:50%; object-fit:cover; display:block; box-shadow:0 4px 16px rgba(2,6,23,0.12); border:4px solid #fff; }
    .avatar-initial { background:#111827; color:#fff; font-size:1.75rem; font-weight:700; display:flex; align-items:center; justify-content:center; }
    .avatar-edit { right:4px; bottom:4px; background:rgba(0,0,0,.65); width:32px; height:32px; }
    .name { font-size:1.25rem; font-weight:700; margin:0; text-align:center; color:var(--zinc-900); line-height:1.3; }
    .role-pill { background:var(--blue-100); color:var(--blue-700); padding:.35rem .75rem; font-size:.65rem; font-weight:600; border-radius:999px; letter-spacing:.5px; text-transform:uppercase; }
    .bio-section { width:100%; margin-top:.5rem; }
    .bio-text { margin:0; font-size:.8rem; line-height:1.5; color:var(--zinc-600); text-align:center; padding:0 .5rem; word-wrap:break-word; overflow-wrap:break-word; hyphens:auto; }
    .bio-text.empty { color:var(--zinc-400); font-style:italic; }
    
    /* Smart CV Section - Sidebar */
    .cv-section-sidebar { width:100%; margin-top:1rem; padding:1rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; }
    .cv-header-row { display:flex; align-items:flex-start; gap:0.75rem; margin-bottom:0.85rem; }
    .cv-icon-circle { width:48px; height:48px; min-width:48px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #e6eef8; border-radius:10px; box-shadow:0 2px 6px rgba(2,6,23,0.04); color:var(--blue-700); flex-shrink:0; }
    .cv-file-blob { width:36px; height:36px; border-radius:8px; background:linear-gradient(180deg,#eef2ff 0%, #e0f2fe 100%); color:var(--blue-700); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.78rem; letter-spacing:0.6px; box-shadow: inset 0 -1px 0 rgba(0,0,0,0.03); }
    .cv-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:0.25rem; }
    .cv-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#334155; }
    .cv-status { display:flex; flex-direction:column; gap:0.15rem; }
    .cv-filename { font-size:0.85rem; font-weight:600; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .cv-badge { font-size:0.7rem; color:#64748b; }
    .cv-status-empty { font-size:0.8rem; color:#94a3b8; font-style:italic; }
    .cv-actions-row { display:flex; gap:0.5rem; flex-wrap:wrap; }
    .cv-icon-btn { width:36px; height:36px; border:1px solid #E5E7EB; border-radius:8px; background:#F9FAFB; color:#6B7280; cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; justify-content:center; text-decoration:none; }
    .cv-icon-btn:hover { background:#F3F4F6; border-color:#D1D5DB; color:#374151; transform:translateY(-1px); }
    .cv-icon-btn:active { transform:translateY(0); }
    .cv-icon-btn svg { flex-shrink:0; }
    
    .actions { width:100%; display:flex; flex-direction:column; gap:.5rem; }
    .info-pills { width:100%; display:flex; flex-direction:column; gap:.5rem; margin-top:.5rem; }
    .social-links { width:100%; display:flex; flex-direction:column; gap:.5rem; margin-top:.75rem; }
    .social-link { display:flex; align-items:center; gap:.75rem; padding:.65rem .85rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; color:#475569; text-decoration:none; font-size:.8rem; font-weight:500; transition:.15s; }
    .social-link:hover { background:#eef2ff; color:#1d4ed8; border-color:#bfdbfe; transform:translateX(2px); }
    .social-link svg { flex-shrink:0; }
    .pill { background:#f8fafc; border:1px solid var(--zinc-200); border-radius:10px; padding:.6rem .75rem; font-size:.75rem; display:flex; gap:.35rem; flex-wrap:wrap; }
    .pill a { color:var(--blue-600); text-decoration:none; }
    .pill a:hover { text-decoration:underline; }
    /* Edit Form */
    .edit-form { display:flex; flex-direction:column; gap:1.25rem; width:100%; min-width:0; }
    .form-row { display:grid; grid-template-columns:repeat(2, 1fr); gap:1rem; width:100%; min-width:0; }
    .form-group { display:flex; flex-direction:column; gap:0.5rem; min-width:0; }
    .form-group.full { grid-column:1 / -1; }
    .form-group label { font-size:0.8rem; font-weight:600; color:#334155; letter-spacing:0.3px; }
    /* Info Grid View */
    .info-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:1.5rem; padding:0.5rem 0; width:100%; min-width:0; }
    .info-item { display:flex; align-items:center; gap:1rem; padding:0; background:transparent; border:none; border-radius:0; min-width:0; }
    .info-item:hover { background:transparent; transform:none; }
    .info-icon { width:42px; height:42px; min-width:42px; display:flex; align-items:center; justify-content:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; color:#64748b; }
    .info-content { flex:1; min-width:0; display:flex; flex-direction:column; gap:0.15rem; overflow:hidden; }
    .info-label { font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; }
    .info-value { font-size:0.95rem; font-weight:500; color:#0f172a; word-break:break-word; line-height:1.4; overflow-wrap:anywhere; }
    .info-value a { color:#2563eb; text-decoration:none; font-weight:600; }
    .info-value a:hover { text-decoration:underline; }
    /* Thesis Card - Sidebar (removed) */
    /* Thesis Card - Main Content */
    .thesis-card-main { background:linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border:1px solid #bae6fd; }
    .thesis-content { display:grid; grid-template-columns:180px 1fr; gap:2rem; padding:0.5rem 0; align-items:center; }
    .thesis-illustration { width:180px; height:180px; border-radius:14px; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 10px 30px rgba(2,6,23,0.08); background:#fff; border:1px solid rgba(14,165,233,0.06); }
    .thesis-illustration-img { width:100%; height:100%; object-fit:cover; display:block; }
    .thesis-details { display:flex; flex-direction:column; gap:1.25rem; min-width:0; }
    .thesis-info-row { display:flex; align-items:flex-start; gap:1rem; }
    .thesis-info-icon { width:40px; height:40px; min-width:40px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #bae6fd; border-radius:12px; color:#0284c7; flex-shrink:0; }
    .thesis-info-content { flex:1; min-width:0; display:flex; flex-direction:column; gap:0.25rem; }
    .thesis-info-label { font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#0369a1; }
    .thesis-info-value { font-size:0.95rem; font-weight:600; color:#0c4a6e; word-break:break-word; line-height:1.4; }
    /* Quick Actions */
    .quick-card { background:#fff; border-radius:18px; padding:1.1rem .9rem 1rem; box-shadow:0 6px 24px rgba(2,6,23,0.05); }
    .quick-card h3 { margin:0 0 .75rem; font-size:.8rem; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:var(--zinc-700); }
    .quick-list { display:flex; flex-direction:column; gap:.5rem; }
    .quick-item { display:flex; align-items:center; gap:.6rem; padding:.55rem .65rem; background:#f9fafb; border:1px solid var(--zinc-200); border-radius:12px; cursor:pointer; transition:.15s; }
    .quick-item:hover { background:#f1f5f9; }
    .quick-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.15rem; }
    .quick-label { flex:1; font-size:.75rem; font-weight:600; color:var(--zinc-700); }
    .quick-count { background:#e2e8f0; color:#334155; padding:.25rem .5rem; border-radius:8px; font-size:.65rem; font-weight:600; }
    /* Main Stats Row */
    .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:1rem; width:100%; min-width:0; }
    .stat-card { background:#fff; border-radius:14px; padding:1rem; box-shadow:0 4px 16px rgba(2,6,23,0.05); display:flex; flex-direction:column; gap:.6rem; min-width:0; }
    .stat-header { display:flex; justify-content:space-between; align-items:center; }
    .stat-label { font-size:.7rem; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:var(--zinc-600); }
    .stat-value { font-size:.8rem; font-weight:700; }
    .stat-bar { width:100%; height:6px; background:#e2e8f0; border-radius:4px; overflow:hidden; }
    .stat-fill { height:100%; background:var(--blue-600); transition:width .4s ease; }
    .text-green-600.stat-value { color:#15803d; }
    .text-orange-600.stat-value { color:#c2410c; }
    .text-red-600.stat-value { color:#b91c1c; }
    /* Cards in main area */
    .content-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; width:100%; min-width:0; }
    .content-grid.single { grid-template-columns:1fr; }
    .card { background:#fff; border-radius:16px; padding:1.5rem; box-shadow:0 4px 20px rgba(2,6,23,0.06); display:flex; flex-direction:column; gap:1rem; min-width:0; }
    .details-card { grid-column:1 / -1; }
    .password-card { grid-column:1 / -1; overflow:hidden; }
    .thesis-card-main { grid-column:1 / -1; }
    .quick-card-main { grid-column: span 1; min-width:0; }

    /* Icon edit button */
    .icon-btn { background:#fff; border:1px solid #e2e8f0; width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center; border-radius:10px; cursor:pointer; color:var(--zinc-600); transition:.15s; }
    .icon-btn:hover { background:#f1f5f9; color:var(--blue-700); }
    .edit-controls { display:flex; align-items:center; gap:.5rem; }
    .card-header { display:flex; align-items:center; justify-content:space-between; min-width:0; }
    .card-header h2 { margin:0; font-size:.95rem; font-weight:700; color:var(--zinc-900); }
    .collapsible-header { cursor:pointer; user-select:none; transition:background .15s; padding:0; margin:0; border-radius:16px; }
    .collapsible-header:hover { background:#f8fafc; }
    .chevron-icon { transition:transform .25s ease; color:var(--zinc-600); flex-shrink:0; }
    .chevron-icon.rotate { transform:rotate(180deg); }
    .collapsible-content { max-height:0; overflow:hidden; transition:max-height .3s ease; }
    .collapsible-content.expanded { max-height:500px; }
    .view-all { background:none; border:none; font-size:.7rem; font-weight:600; color:var(--blue-600); cursor:pointer; }
    .view-all:hover { text-decoration:underline; }
    /* Activity list */
    .activity-list { display:flex; flex-direction:column; gap:.85rem; }
    .activity-item { display:flex; gap:.75rem; padding:.55rem .6rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; }
    .activity-icon { width:38px; height:38px; border-radius:999px; display:flex; align-items:center; justify-content:center; font-size:.9rem; }
    .activity-icon.success { background:#dcfce7; color:#166534; }
    .activity-content { flex:1; min-width:0; display:flex; flex-direction:column; gap:.25rem; }
    .activity-top { display:flex; align-items:center; justify-content:space-between; gap:.75rem; }
    .activity-top strong { font-size:.8rem; color:var(--zinc-900); }
    .activity-top .date { font-size:.6rem; color:var(--zinc-500); }
    .activity-desc { font-size:.7rem; color:var(--zinc-600); }
    .empty { font-size:.7rem; color:var(--zinc-500); text-align:center; padding:.75rem 0; }
    /* Documents */
    .documents-list { display:flex; flex-direction:column; gap:.75rem; }
    .document-item { display:flex; align-items:center; gap:.9rem; padding:.6rem .7rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; cursor:pointer; transition:.15s; }
    .document-item:hover { background:#eef2f7; }
    .doc-icon { width:40px; height:40px; background:#fee2e2; color:#dc2626; border-radius:12px; display:flex; align-items:center; justify-content:center; }
    .doc-meta { flex:1; min-width:0; }
    .doc-name { font-size:.78rem; font-weight:600; color:var(--zinc-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .doc-sub { font-size:.6rem; color:var(--zinc-500); }
    .doc-download { background:none; border:none; cursor:pointer; padding:.35rem; border-radius:8px; color:var(--zinc-600); }
    .doc-download:hover { background:#e0f2fe; color:var(--blue-700); }
    
    /* Email Input with Action Button */
    .input-with-action { display:flex; gap:0.5rem; align-items:center; }
    .input-with-action .input { flex:1; min-width:0; }
    .verify-btn { padding:0.65rem 1.25rem; background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#fff; border:none; border-radius:10px; font-size:0.85rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; white-space:nowrap; }
    .verify-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(37, 99, 235, 0.3); }
    .verify-btn:active { transform:translateY(0); }
    .input-hint { font-size:0.75rem; color:#64748b; font-style:italic; margin-top:0.25rem; }
    
    /* Verification Modal */
    .modal-overlay { position:fixed; inset:0; background:rgba(0, 0, 0, 0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999; animation:fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    .verify-modal-container { background:#fff; border-radius:20px; padding:2rem; max-width:480px; width:90%; box-shadow:0 20px 60px rgba(0, 0, 0, 0.3); animation:slideUp 0.3s ease; }
    @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    .verify-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; }
    .verify-modal-title { font-size:1.5rem; font-weight:700; color:#0f172a; margin:0; }
    .verify-modal-close { background:none; border:none; font-size:2rem; color:#94a3b8; cursor:pointer; line-height:1; padding:0; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:8px; transition:all 0.2s; }
    .verify-modal-close:hover { background:#f1f5f9; color:#475569; }
    .verify-modal-body { display:flex; flex-direction:column; gap:1rem; }
    .verify-modal-text { font-size:1rem; color:#475569; margin:0; line-height:1.6; }
    .verify-modal-text strong { color:#0f172a; font-weight:600; }
    .verify-code-input { box-sizing: border-box; width:100%; max-width:420px; padding:0.75rem 1rem; border:2px solid #e2e8f0; border-radius:12px; font-size:1.1rem; font-weight:600; text-align:center; letter-spacing:0.35rem; font-family:monospace; transition:all 0.2s; display:block; margin:0 auto; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
    .verify-code-input:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37, 99, 235, 0.1); }
    .verify-modal-hint { font-size:0.85rem; color:#94a3b8; margin:0; text-align:center; font-style:italic; }
    .verify-modal-actions { display:flex; gap:0.75rem; margin-top:1rem; }
    .verify-btn-cancel { flex:1; padding:0.875rem 1.5rem; border-radius:12px; font-size:1rem; font-weight:600; border:none; cursor:pointer; transition:all 0.2s ease; background:#f1f5f9; color:#475569; }
    .verify-btn-cancel:hover { background:#e2e8f0; }
    .verify-btn-confirm { flex:1; padding:0.875rem 1.5rem; border-radius:12px; font-size:1rem; font-weight:600; border:none; cursor:pointer; transition:all 0.2s ease; background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#fff; }
    .verify-btn-confirm:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 20px rgba(37, 99, 235, 0.3); }
    .verify-btn-confirm:disabled { opacity:0.5; cursor:not-allowed; }
    
    /* Responsive */
    @media (max-width:1200px){ .profile-layout { grid-template-columns:280px 1fr; gap:1.5rem; } }
    @media (max-width:900px){ .profile-layout { grid-template-columns:1fr; } .profile-sidebar { position:static; } .content-grid { grid-template-columns:1fr; } .thesis-content { grid-template-columns:140px 1fr; gap:1.5rem; } .thesis-illustration { width:140px; height:140px; } .thesis-illustration svg { width:60px; height:60px; } }
    @media (max-width:600px){ .stats-row { grid-template-columns:1fr; } .info-grid,.form-row { grid-template-columns:1fr; } .avatar-img,.avatar-initial{ width:90px; height:90px; } .name { font-size:1.1rem; } .thesis-content { grid-template-columns:1fr; gap:1rem; } .thesis-illustration { width:100%; height:120px; justify-content:center; } .verify-modal-container { padding:1.5rem; max-width:95%; } .verify-code-input { font-size:1.1rem; letter-spacing:0.35rem; } }
    `
  ]
})
export class ProfilePage {
  profile: any = null;
  // Change password form fields
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  changingPassword: boolean = false;
  profileImage: string | null = null;
  userInitials: string = '';
  editMode = false;
  isPasswordExpanded = false;
  stats = [] as any[];
  quickLinks = [] as any[];
  recentActivity = [] as any[];
  documents = [] as any[];
  
  // Email verification fields
  newEmail: string = '';
  showVerifyModal: boolean = false;
  verificationCode: string = '';
  
  // Modal state
  modalConfig: any = {
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Annuler'
  };

  constructor(private auth: AuthService, private http: HttpClient, private router: Router){
    this.loadProfile();
  }
  
  requestEmailChange() {
    if (!this.newEmail || this.newEmail === this.profile.email) {
      this.showModal('warning', 'Email invalide', 'Veuillez entrer une nouvelle adresse email');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newEmail)) {
      this.showModal('warning', 'Email invalide', 'Veuillez entrer une adresse email valide');
      return;
    }
    
    this.http.post('/api/auth/request-email-change', { newEmail: this.newEmail }).subscribe({
      next: (res: any) => {
        this.showVerifyModal = true;
        this.verificationCode = '';
      },
      error: (err: any) => {
        console.error('[Profile] requestEmailChange error', err);
        if (err.status === 429) {
          this.showModal('warning', 'Limite atteinte', 'Vous avez atteint la limite de demandes. Veuillez réessayer plus tard');
        } else if (err.status === 400) {
          this.showModal('error', 'Email déjà utilisé', 'Cette adresse email est déjà utilisée par un autre compte');
        } else {
          this.showModal('error', 'Erreur', err?.error?.message || 'Échec de l\'envoi du code de vérification');
        }
      }
    });
  }
  
  submitEmailVerification() {
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.showModal('warning', 'Code invalide', 'Veuillez entrer le code à 6 chiffres');
      return;
    }
    
    const trimmedCode = this.verificationCode.trim();
    console.log('[Profile] Submitting verification code:', trimmedCode, 'length:', trimmedCode.length);
    
    this.http.post('/api/auth/verify-email-change', { code: trimmedCode }).subscribe({
      next: (res: any) => {
        console.log('[Profile] Email verification successful:', res);
        this.showVerifyModal = false;
        this.verificationCode = '';
        
        // Reload profile to get updated email
        this.auth.getProfile().subscribe({
          next: (profileRes: any) => {
            this.profile = this.normalizeProfile(profileRes || {});
            this.newEmail = this.profile.email; // Sync newEmail with updated email
            this.profileImage = this.profile.avatar || null;
            this.userInitials = this.generateInitials(
              this.profile.firstName && this.profile.lastName ? `${this.profile.firstName} ${this.profile.lastName}` : null,
              this.profile.email
            );
            this.showModal('success', 'Email modifié', 'Votre adresse email a été modifiée avec succès');
          },
          error: (profileErr: any) => {
            console.error('[Profile] Failed to reload profile after email change', profileErr);
            this.showModal('success', 'Email modifié', 'Votre adresse email a été modifiée avec succès. Veuillez actualiser la page.');
          }
        });
      },
      error: (err: any) => {
        console.error('[Profile] verifyEmailChange error', err);
        console.error('[Profile] Error details - status:', err.status, 'message:', err?.error?.message, 'body:', err?.error);
        if (err.status === 400) {
          this.showModal('error', 'Code incorrect', 'Le code de vérification est incorrect ou a expiré');
        } else {
          this.showModal('error', 'Erreur', err?.error?.message || 'Échec de la vérification du code');
        }
      }
    });
  }
  
  closeVerifyModal() {
    this.showVerifyModal = false;
    this.verificationCode = '';
  }
  
  onVerifyOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeVerifyModal();
    }
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmNewPassword) {
      this.showModal('warning', 'Champs requis', 'Veuillez remplir tous les champs');
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.showModal('warning', 'Mots de passe différents', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    // basic client-side policy check
    if (this.newPassword.length < 8) {
      this.showModal('warning', 'Mot de passe trop court', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    // Confirmation dialog
    this.showConfirmModal(
      'Confirmer la modification',
      'Êtes-vous sûr de vouloir modifier votre mot de passe ?',
      () => {
        this.changingPassword = true;
        this.auth.changePassword(this.oldPassword, this.newPassword, this.confirmNewPassword).subscribe({
          next: (res:any) => {
            this.changingPassword = false;
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmNewPassword = '';
            this.isPasswordExpanded = false;
            this.showModal('success', 'Succès', 'Mot de passe modifié avec succès !');
          },
          error: (err:any) => {
            console.error('[Profile] changePassword error', err);
            this.changingPassword = false;
            const errorMsg = err?.error?.message || 'Échec de la modification du mot de passe';
            this.showModal('error', 'Erreur', errorMsg);
          }
        });
      }
    );
  }

  loadProfile(){
    // try to fetch profile from auth service
    try {
      this.auth.getProfile().subscribe({ 
        next: (res:any) => { 
          this.profile = this.normalizeProfile(res || {}); 
          this.newEmail = this.profile.email; // Initialize newEmail
          this.profileImage = this.profile.avatar || null;
          this.userInitials = this.generateInitials(
            this.profile.firstName && this.profile.lastName ? `${this.profile.firstName} ${this.profile.lastName}` : null,
            this.profile.email
          );
        }, 
        error: (err:any) => { 
          if (err && (err.status === 401 || err.status === 403)) { 
            this.auth.logout(); 
            this.showModal('warning', 'Session expirée', 'Veuillez vous reconnecter');
          } 
          this.profile = {}; 
        } 
      });
    } catch(e) {
      // fallback
      this.http.get('/api/me').subscribe({ 
        next: (res:any) => { 
          this.profile = this.normalizeProfile(res || {}); 
          this.newEmail = this.profile.email; // Initialize newEmail
          this.profileImage = this.profile.avatar || null;
          this.userInitials = this.generateInitials(
            this.profile.firstName && this.profile.lastName ? `${this.profile.firstName} ${this.profile.lastName}` : null,
            this.profile.email
          );
        }, 
        error: (err:any) => { 
          if (err && (err.status === 401 || err.status === 403)) { 
            this.auth.logout(); 
            this.showModal('warning', 'Session expirée', 'Veuillez vous reconnecter');
          } 
          this.profile = {}; 
        } 
      });
    }

    // Defaults (no mock data): stats start at 0 and will be populated later
    this.stats = [ { label: 'Publications', current: 0, required: 4 }, { label: 'Formations', current: 0, required: 200 }, { label: 'Conferences', current: 0, required: 2 } ];
    this.quickLinks = [ { icon: '📄', label: 'Mes Documents', count: null, color: '#3b82f6' }, { icon: '⬆', label: 'Soumettre Dossier', count: null, color: '#059669' } ];
    this.recentActivity = [];
    this.documents = [];

    // Load latest documents for the candidate and derive recent activity from them
    this.fetchRecentDocuments();
  }

  fetchRecentDocuments() {
    // fetch latest 5 documents for the user
    this.http.get<any>('/api/candidat/documents?page=0&size=5').subscribe({ next: (res:any) => {
      try {
        const content = res?.content || [];
        // map documents to shape used by template
        this.documents = content.map((d:any) => ({
          id: d.id,
          name: d.title || d.originalFilename || 'Document',
          date: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '',
          size: d.contentType || ''
        }));
        // derive simple recent activity from documents (most recent uploads)
        this.recentActivity = content.map((d:any) => ({ date: d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '', action: 'Document envoyé', description: d.title || d.originalFilename || '' }));
      } catch(e) { this.documents = []; this.recentActivity = []; }
    }, error: (err:any) => {
      // silently ignore; keep arrays empty
      this.documents = [];
      this.recentActivity = [];
    } });
  }

  generateInitials(name: string | null, email: string | null): string {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  onAvatar(e: any){
    const fl: FileList | null = e?.target?.files || null;
    if (!fl || fl.length === 0) return;
    const f = fl[0];
    const url = URL.createObjectURL(f);
    this.profileImage = url;
    // upload to server
    const fd = new FormData(); fd.append('avatar', f, f.name);
    this.http.post('/api/auth/me/avatar', fd).subscribe({ 
      next: (res:any) => { 
        if (res?.avatar) { 
          this.profileImage = res.avatar; 
          this.profile.avatar = res.avatar; 
          this.showModal('success', 'Succès', 'Avatar mis à jour avec succès !');
          // refresh profile from server to ensure the avatar URL and related profile fields persist
          try{ this.loadProfile(); }catch(e){}
        } 
      }, 
      error: (err) => { 
        console.error('Avatar upload failed', err); 
        this.showModal('error', 'Erreur', 'Échec du téléchargement de l\'avatar');
      } 
    });
  }

  onCvUpload(e: any){
    const fl: FileList | null = e?.target?.files || null;
    if (!fl || fl.length === 0) return;
    const f = fl[0];
    
    // Show warning that CV will be publicly accessible
    const confirmed = confirm('⚠️ AVERTISSEMENT\n\nVotre CV sera accessible publiquement par tous les utilisateurs.\n\nVoulez-vous continuer ?');
    if (!confirmed) {
      // Reset the file input
      e.target.value = '';
      return;
    }
    
    const fd = new FormData(); 
    fd.append('cv', f, f.name);
    this.http.post('/api/auth/me/cv', fd).subscribe({ 
      next: (res:any) => { 
        if (res?.cvUrl) { this.profile.cvUrl = res.cvUrl; }
        this.showModal('success', 'Succès', 'CV téléchargé avec succès !');
      }, 
      error: (err) => { 
        console.error('CV upload failed', err); 
        this.showModal('error', 'Erreur', 'Échec du téléchargement du CV');
      } 
    });
  }

  getCvFileName(){
    const url = this.profile && this.profile.cvUrl ? String(this.profile.cvUrl) : '';
    if (!url) return '';
    try {
      // try to parse as URL to get the pathname
      const u = new URL(url, window.location.origin as any);
      const parts = (u.pathname || '').split('/').filter(Boolean);
      const last = parts.length ? parts[parts.length - 1] : '';
      return decodeURIComponent(last) || last || 'CV';
    } catch (e) {
      // fallback to naive split
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1] || url) || url;
    }
  }

  getCvFileExt(){
    try{
      const name = String(this.getCvFileName() || '').trim();
      if (!name) return '';
      const parts = name.split('.').filter(Boolean);
      if (parts.length <= 1) return '';
      return parts.pop()!.toUpperCase();
    } catch(e) { return ''; }
  }

  // normalize backend shapes to common keys used by the template
  normalizeProfile(raw: any){
    // unwrap possible containers
    if (!raw) return {};
    if (raw.user) raw = raw.user;
    if (raw.data) raw = raw.data;
    const p: any = {};
    p.firstName = raw.firstName || raw.firstname || raw.givenName || raw.given_name || raw.first_name || raw.name || '';
    p.lastName = raw.lastName || raw.lastname || raw.familyName || raw.family_name || raw.last_name || '';
    p.email = raw.email || raw.mail || '';
    p.phone = raw.phone || raw.telephone || raw.phoneNumber || raw.phone_number || '';
    p.address = raw.address || raw.location || raw.adresse || '';
    p.enrollmentDate = raw.enrollmentDate || raw.enrolledAt || raw.enrollment_date || raw.enrolled_at || raw.createdAt || '';
    p.thesisTitle = raw.thesisTitle || raw.thesis_title || raw.subject || '';
    p.thesisDirector = raw.thesisDirector || raw.director || raw.supervisor || '';
    p.laboratory = raw.laboratory || raw.lab || raw.institution || '';
    p.role = raw.role || raw.roles || (raw.authorities && raw.authorities[0]) || '';
    p.affiliation = raw.affiliation || '';
    p.linkedinUrl = raw.linkedinUrl || raw.linkedin_url || raw.linkedin || '';
    p.portfolioUrl = raw.portfolioUrl || raw.portfolio_url || raw.portfolio || raw.website || '';
    p.bio = raw.bio || raw.biography || raw.description || '';
    p.cvUrl = raw.cvUrl || raw.cv_url || raw.cv || raw.resume || '';
    // Normalize role to a single, human-friendly string (strip ROLE_ prefix)
    try {
      let roleVal: any = p.role;
      if (Array.isArray(roleVal)) {
        roleVal = roleVal.length > 0 ? roleVal[0] : '';
      } else if (roleVal instanceof Set) {
        const arr = Array.from(roleVal as Set<any>);
        roleVal = arr.length > 0 ? arr[0] : '';
      } else if (typeof roleVal === 'object' && roleVal !== null) {
        // fall back to string conversion for unexpected shapes
        roleVal = String(roleVal);
      }
      if (typeof roleVal === 'string') {
        roleVal = roleVal.replace(/^ROLE_/i, '');
        roleVal = roleVal.toLowerCase();
      }
      p.role = roleVal || '';
    } catch (e) { p.role = p.role || ''; }
    p.avatar = raw.avatar || raw.avatarUrl || raw.avatar_url || null;
    return p;
  }

  saveProfile(){
    if (!this.profile) return;
    
    // Confirmation dialog
    this.showConfirmModal(
      'Enregistrer les modifications',
      'Êtes-vous sûr de vouloir enregistrer les modifications ?',
      () => {
        const payload = { 
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          phone: this.profile.phone,
          affiliation: this.profile.affiliation,
          linkedinUrl: this.profile.linkedinUrl,
          portfolioUrl: this.profile.portfolioUrl,
          bio: this.profile.bio
          // Note: email is updated separately via verification flow
        };
        this.http.put('/api/auth/me', payload).subscribe({ 
          next: (res:any) => { 
            // Update profile with response
            if (res) {
              this.profile = this.normalizeProfile(res);
              this.newEmail = this.profile.email;
            }
            this.editMode = false;
            this.showModal('success', 'Succès', 'Profil enregistré avec succès !');
          }, 
          error: (err) => { 
            console.error('Save failed', err);
            const errorMsg = err?.error?.message || 'Échec de l\'enregistrement du profil';
            this.showModal('error', 'Erreur', errorMsg);
          } 
        });
      }
    );
  }

  getProgressColor(cur:number, req:number){ const p = Math.round((cur/req) * 100); if (p >= 100) return 'text-green-600'; if (p >= 75) return 'text-orange-600'; return 'text-red-600'; }

  onAction(link:any){ if (link.label === 'Mes Documents') this.router.navigate(['/candidat/documents']); }

  viewAllDocuments() {
    try {
      this.router.navigate(['/candidat/documents']);
    } catch (e) { console.error('[Profile] viewAllDocuments navigation error', e); }
  }

  download(doc:any){
    if (!doc) return;
    // Prefer protected download endpoint which forces attachment
    const id = doc.id;
    if (id) {
      // open in same tab to trigger attachment download
      const url = `/api/candidat/documents/download/${id}`;
      // create an invisible a element to force download
      const a = document.createElement('a');
      a.href = url;
      a.target = '_self';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    // fallback: if a public url is provided use it
    if (doc.url) {
      window.open(doc.url, '_blank');
      return;
    }
    this.showModal('error', 'Téléchargement indisponible', 'Aucun fichier disponible pour téléchargement');
  }

  togglePasswordSection(){ this.isPasswordExpanded = !this.isPasswordExpanded; }
  
  // Modal helpers
  showModal(type: 'success' | 'error' | 'warning', title: string, message: string) {
    this.modalConfig = {
      isOpen: true,
      type,
      title,
      message,
      confirmText: 'OK',
      cancelText: 'Annuler'
    };
  }
  
  showConfirmModal(title: string, message: string, onConfirm: () => void) {
    this.modalConfig = {
      isOpen: true,
      type: 'confirm',
      title,
      message,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm
    };
  }
  
  onModalConfirmed() {
    if (this.modalConfig.onConfirm) {
      this.modalConfig.onConfirm();
    }
    this.modalConfig.isOpen = false;
  }
  
  onModalCancelled() {
    this.modalConfig.isOpen = false;
  }
}
