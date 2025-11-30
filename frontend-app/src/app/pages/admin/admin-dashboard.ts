import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminNavbarComponent } from '../../components/navbar/admin-navbar';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './admin-dashboard.html',
  styles: [
    `
    .wrap { max-width:1400px; margin:1.5rem auto; padding:1rem; display:flex; gap:1.5rem }
    .sidebar { width:280px; flex-shrink:0 }
    .main-content { flex:1; min-width:0 }
    .header { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1.5rem }
    .filter-card { background:#fff; border-radius:12px; padding:1.25rem; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1px solid #f3f4f6; margin-bottom:1rem }
    .filter-title { font-weight:700; font-size:0.95rem; color:#0f172a; margin-bottom:1rem }
    .search-box { width:100%; padding:0.65rem; border:1px solid #e6eef8; border-radius:8px; font-size:0.9rem; margin-bottom:0; box-sizing:border-box; display:block }
    .search-box:focus { outline:none; border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1) }
    .filter-group { margin-bottom:1.25rem }
    .filter-group:last-child { margin-bottom:0 }
    .filter-label { font-size:0.875rem; font-weight:600; color:#374151; margin-bottom:0.5rem; display:block }
    .filter-option { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 0.75rem; border-radius:6px; cursor:pointer; transition:all 0.15s; margin-bottom:0.25rem }
    .filter-option:hover { background:#f8fafc }
    .filter-option.active { background:#eff6ff; color:#1e40af; font-weight:600 }
    .filter-option input[type="radio"] { margin:0; cursor:pointer }
    .horizontal-filters { background:#fff; border-radius:12px; padding:1rem; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1px solid #f3f4f6; margin-bottom:1rem; display:flex; gap:1rem; align-items:center; flex-wrap:wrap }
    .h-filter-group { display:flex; gap:0.5rem; align-items:center }
    .h-filter-label { font-size:0.875rem; font-weight:600; color:#374151; white-space:nowrap }
    .h-search-box { padding:0.5rem 0.75rem; border:1px solid #e6eef8; border-radius:8px; font-size:0.875rem; min-width:250px; box-sizing:border-box }
    .h-search-box:focus { outline:none; border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1) }
    .h-filter-btn { padding:0.5rem 1rem; border-radius:8px; border:1px solid #e6eef8; background:#fff; cursor:pointer; font-size:0.875rem; font-weight:500; color:#475569; transition:all 0.2s }
    .h-filter-btn:hover { background:#f8fafc; border-color:#cbd5e1 }
    .h-filter-btn.active { background:#0f172a; color:#fff; border-color:#0f172a }
    .pagination { display:flex; gap:0.5rem; align-items:center; justify-content:center; margin-top:1.5rem; padding:1rem }
    .page-btn { padding:0.5rem 0.75rem; border-radius:8px; border:1px solid #e6eef8; background:#fff; cursor:pointer; font-size:0.875rem; font-weight:500; color:#475569; transition:all 0.2s; min-width:40px; text-align:center }
    .page-btn:hover:not(:disabled) { background:#f8fafc; border-color:#cbd5e1 }
    .page-btn.active { background:#0f172a; color:#fff; border-color:#0f172a }
    .page-btn:disabled { opacity:0.4; cursor:not-allowed }
    .page-info { font-size:0.875rem; color:#6b7280; padding:0 0.5rem }
    .center-search { flex:1; display:flex; justify-content:center; padding:0 1rem }
    .center-search .search-box { max-width:540px; width:100%; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem; margin-top:1rem }
    .user-card { background:#fff; border-radius:12px; padding:1.25rem; box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1px solid #f3f4f6; display:flex; flex-direction:column; gap:0.75rem; transition:all 0.2s }
    .user-card:hover{ box-shadow:0 8px 24px rgba(2,6,23,0.08); border-color:#e6eef8 }
    .user-card{ position:relative }
    .avatar { width:52px; height:52px; border-radius:50%; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem; flex-shrink:0; overflow:hidden; position:relative; }
    .avatar img { width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; }
    .avatar span { position:relative; z-index:1; }
    .meta { display:flex; gap:0.875rem; align-items:flex-start }
    .role { font-size:0.875rem; color:#6b7280; margin-top:0.2rem }
    .actions { margin-top:auto; display:flex; gap:0.5rem; padding-top:0.5rem; border-top:1px solid #f3f4f6 }
    .btn { padding:0.5rem 0.85rem; border-radius:8px; border:0; cursor:pointer; font-size:0.875rem; font-weight:600; transition:all 0.2s }
    .btn:hover{ transform:translateY(-1px) }
    .btn.outline{ background:transparent; border:1px solid #e6eef8; color:#475569 }
    .btn.outline:hover{ background:#f8fafc; border-color:#cbd5e1 }
    .btn:not(.outline){ background:#0f172a; color:#fff }
    .btn:not(.outline):hover{ background:#1e293b }
  .requests { margin-top:1rem; background:#fff; padding:1rem; border-radius:12px; border:1px solid #f3f4f6; box-shadow:0 2px 8px rgba(0,0,0,0.04) }
  .requests h3{ font-size:1.125rem; font-weight:700; color:#0f172a; margin:0 0 1rem 0 }
  .requests-grid { display:flex; flex-direction:column; gap:1rem }
  .req-card { display:flex; gap:1.25rem; align-items:flex-start; padding:1.25rem; border-radius:12px; background:#fafbfc; border:1px solid #eef2f7; transition:all 0.2s; position:relative }
  .req-card:hover{ background:#fff; border-color:#d1d5db; box-shadow:0 4px 12px rgba(0,0,0,0.06) }
  .req-media { display:flex; flex-direction:column; gap:0.625rem; width:130px; flex-shrink:0 }
  .thumb { width:130px; height:90px; border-radius:10px; overflow:hidden; background:#fff; border:1px solid #e6eef8; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.04); font-size:0.85rem; color:#9ca3af }
  .thumb img{ width:100%; height:100%; object-fit:cover; display:block; cursor:pointer; transition:transform 0.2s }
  .thumb img:hover{ transform:scale(1.05) }
  .req-body { flex:1; min-width:0 }
  .req-title { font-weight:700; color:#0f172a; margin-bottom:0.3rem; font-size:1.05rem }
  .req-meta { color:#6b7280; font-size:0.9rem; margin-bottom:0.5rem }
  .req-meta strong{ color:#374151 }
  .req-actions { display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap }
  .req-note { font-size:0.9rem; color:#475569; line-height:1.5; background:#fff; padding:0.75rem; border-radius:8px; margin-top:0.5rem }
  .req-note > div{ margin-bottom:0.25rem }
  .req-note strong{ color:#0f172a }
    @media (max-width:900px){ .wrap{ flex-direction:column } .sidebar{ width:100% } .header{ flex-direction:column; align-items:flex-start } .req-card{ flex-direction:column } .req-media{ width:100% } .thumb{ width:100%; max-width:200px } }
    .req-footer{ position:absolute; right:16px; bottom:16px; display:flex; gap:0.5rem }
    .req-footer .icon-btn{ width:40px; height:40px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid #e6eef8; cursor:pointer; color:#0f172a }
    .req-footer .icon-btn:hover{ background:#f8fafc; transform:translateY(-2px) }
    .icon-approved { color: #065f46 !important }
    .icon-rejected { color: #991b1b !important }
    .icon-tooltip{ position:absolute; bottom:calc(100% + 6px); right:0; background:#111827; color:#fff; padding:6px 8px; border-radius:6px; font-size:12px; white-space:nowrap; opacity:0; transform:translateY(6px); transition:all 0.12s ease }
    .req-footer .icon-btn{ position:relative }
    .req-footer .icon-btn:hover .icon-tooltip{ opacity:1; transform:translateY(0) }
    /* User card eye and print styles */
    .user-eye{ position:absolute; right:12px; top:12px; width:36px; height:36px; border-radius:8px; border:1px solid #e6eef8; background:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; color:#0f172a }
    .user-eye:hover{ background:#f8fafc; transform:translateY(-2px) }
    .actions .icon-btn{ width:40px; height:40px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid #e6eef8; cursor:pointer; color:#0f172a; margin-left:8px }
    .actions .icon-btn:hover{ background:#f8fafc; transform:translateY(-2px) }
    .actions .icon-btn .icon-tooltip{ right:0; bottom:calc(100% + 6px) }
    /* Modern modal styles */
    .modal-backdrop{ position:fixed; inset:0; background:rgba(2,6,23,0.45); display:flex; align-items:center; justify-content:center; z-index:2000 }
    .modal-card{ width:760px; max-width:94%; background:#ffffff; border-radius:12px; box-shadow:0 20px 50px rgba(2,6,23,0.3); padding:18px; color:#0f172a }
    .modal-header{ display:flex; justify-content:space-between; align-items:center; gap:12px }
    .modal-title{ font-size:1.125rem; font-weight:700 }
    .modal-sub{ color:#6b7280; font-size:0.95rem }
    .modal-body{ display:flex; gap:18px; margin-top:12px }
    .modal-avatar{ width:88px; height:88px; border-radius:12px; background:#0f172a; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.25rem; overflow:hidden; position:relative; }
    .modal-avatar img { width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; }
    .modal-avatar span { position:relative; z-index:1; }
    .info-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px 16px }
    .info-row{ display:flex; gap:8px; align-items:center }
    .info-label{ color:#374151; font-weight:700; min-width:110px }
    .info-value{ color:#475569 }
    .modal-input{ width:100%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef8; font-size:0.95rem; box-sizing:border-box }
    .modal-input:focus{ outline:none; border-color:#3b82f6; box-shadow:0 0 0 4px rgba(59,130,246,0.06) }
    .cv-action-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:#16a34a; color:#fff; border-radius:6px; font-size:0.85rem; font-weight:600; text-decoration:none; transition:all 0.2s }
    .cv-action-btn:hover { background:#15803d; transform:translateY(-1px) }
    .social-badge { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:6px; font-size:0.85rem; font-weight:600; text-decoration:none; transition:all 0.2s }
    .social-badge:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.15) }
    .social-badge.linkedin { background:#0ea5e9; color:#fff }
    .social-badge.portfolio { background:#8b5cf6; color:#fff }
    .social-badge.github { background:#1f2937; color:#fff }
    .social-badge.twitter { background:#3b82f6; color:#fff }
    .modal-actions{ display:flex; gap:8px; align-items:center }
    .field-error{ color:#b91c1c; font-size:0.88rem; margin-top:6px }
    .form-error{ color:#b91c1c; font-weight:700; margin-top:8px }
    .requests-list{ margin-top:12px; border-top:1px solid #eef2f7; padding-top:12px; max-height:320px; overflow:auto }
    .request-item{ padding:10px; border-radius:10px; background:#fbfdff; border:1px solid #eef6ff; margin-bottom:8px }
    .request-item .r-meta{ display:flex; justify-content:space-between; align-items:center }
    .small-badge{ font-weight:700; padding:6px 8px; border-radius:999px; font-size:0.8rem }
    .badge-approved{ background:#d1fae5; color:#065f46 }
    .badge-rejected{ background:#fee2e2; color:#991b1b }
    .badge-pending{ background:#f3f4f6; color:#475569 }
  `]
})
export class AdminDashboard {
  users = signal<Array<any>>([]);
  loading = signal(false);
  requests = signal<Array<any>>([]);
  requestsError = signal<string | null>(null);
  requestCounts = signal<Record<string, number>>({} as any);
  expandedUsers = signal<Record<number, boolean>>({} as any);
  // view: 'users' | 'requests'
  view = signal<'users'|'requests'>('users');

  // filters for requests
  searchQuery = signal('');
  selectedRole = signal<string>('all');
  selectedStatus = signal<string>('all');
  
  // filters for users
  userSearchQuery = signal('');
  userRoleFilter = signal<string>('all');
  userDemandesFilter = signal<string>('all');
  
  // pagination
  usersPage = signal(1);
  usersPerPage = signal(12);
  requestsPage = signal(1);
  requestsPerPage = signal(10);
  
  // modal state for approve/reject confirmation
  modalVisible = signal(false);
  modalAction: 'approve'|'reject'|null = null;
  modalRequest: any = null;
  // modalMessage used by template via ngModel, keep as plain property
  modalMessage: string = '';
  modalLoading = signal(false);
  modalNotify: boolean = false;

  // modal state for viewing a user's full info
  userModalVisible = signal(false);
  userModalData: any = null;
  // editing state
  isEditingUser = signal(false);
  editingUser: any = null;
  saveLoading = signal(false);
  // Inline form errors
  fieldErrors = signal<Record<string,string>>({} as any);
  formError = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  fetchUsers(){
    this.loading.set(true);
    // ensure backend can read JWT from cookie if Authorization header is missing
    try { const t = localStorage.getItem('auth_token'); if (t) { document.cookie = 'JWT=' + t + ';path=/'; } } catch(e) {}

    this.http.get('/gestion-auth-service/api/admin/users').subscribe({
      next: (res:any) => { 
        const allUsers = Array.isArray(res) ? res : (res?.data || []);
        // Filter out admin@local user
        const filteredUsers = allUsers.filter((u: any) => u.email !== 'admin@local');
        this.users.set(filteredUsers); 
        this.loading.set(false); 
      },
      error: () => {
        // fallback mock data
        this.users.set([
          { id:1, firstName:'Marie', lastName:'Dubois', email:'marie@example.com', role:'candidat' },
          { id:2, firstName:'Jean', lastName:'Martin', email:'jean@example.com', role:'directeur' },
          { id:3, firstName:'Alice', lastName:'Durand', email:'alice@example.com', role:'candidat' }
        ]);
        this.loading.set(false);
      }
    });

  // fetch pending role requests
  // ensure cookie fallback so TokenFilter can authenticate if Authorization header was not attached
  try { const t2 = localStorage.getItem('auth_token'); if (t2) { document.cookie = 'JWT=' + t2 + ';path=/'; } } catch(e) {}

  this.http.get('/gestion-auth-service/api/auth/role-requests', { observe: 'response' as any }).subscribe({ next: (resp:any) => {
      const res = resp.body;
      const arr = Array.isArray(res) ? res : (res?.data || []);
      this.requests.set(arr);
      this.requestsError.set(null);
      // compute counts per user (exclude CANCELLED/CANCELED requests)
      // Only count requests that are still PENDING (we show 'demandes en attente')
      const counts: Record<string, number> = {};
      for (const r of arr) {
        try {
          if (!r || !r.status) continue;
          const st = (r.status || '').toString().toUpperCase();
          if (st !== 'PENDING') continue; // only pending count
          const id = r.user?.id || r.userId || 'unknown';
          counts[id] = (counts[id] || 0) + 1;
        } catch (e) { continue; }
      }
      this.requestCounts.set(counts);
    }, error: (err:any) => {
      console.error('[AdminDashboard] failed to fetch role-requests', err);
      const msg = err?.status ? (`${err.status} ${err.statusText || ''}`) : 'Network error';
      this.requestsError.set(msg + (err?.error && typeof err.error === 'string' ? (': ' + err.error) : ''));
      this.requests.set([]);
      this.requestCounts.set({} as any);
    } });
  }

  initials(u:any){ return ((u.firstName||'')[0] || '') + ((u.lastName||'')[0] || '') }

  toggleUserRequests(u:any){
    const map = { ...(this.expandedUsers() || {}) };
    map[u.id] = !map[u.id];
    this.expandedUsers.set(map);
  }

  // View full user info in a modal
  viewUser(u: any){
    if(!u) return;
    this.userModalData = u;
    this.userModalVisible.set(true);
  }

  // Start editing a user (opens modal in edit mode)
  startEditUser(u: any){
    if(!u) return;
    // shallow copy to avoid mutating original until saved
    this.editingUser = JSON.parse(JSON.stringify(u));
    this.userModalData = u;
    this.isEditingUser.set(true);
    this.userModalVisible.set(true);
  }

  // Cancel editing
  cancelEditUser(){
    this.isEditingUser.set(false);
    this.editingUser = null;
    this.fieldErrors.set({} as any);
    this.formError.set(null);
  }

  // Save edited user (calls backend and updates local list)
  saveUser(){
    if(!this.editingUser) return;
    this.saveLoading.set(true);
    this.fieldErrors.set({} as any);
    this.formError.set(null);
    // cookie fallback for auth
    try { const t = localStorage.getItem('auth_token'); if (t) { document.cookie = 'JWT=' + t + ';path=/'; } } catch(e) {}
    const id = this.editingUser.id;
    // Send only profile fields to avoid overwriting unrelated data
    const payload: any = {
      firstName: this.editingUser.firstName,
      lastName: this.editingUser.lastName,
      email: this.editingUser.email,
      phone: this.editingUser.phone || this.editingUser.phoneNumber || this.editingUser.telephone,
      address: this.editingUser.address
    };

    this.http.put(`/gestion-auth-service/api/admin/users/${id}`, payload).subscribe({ next: (res:any) => {
        // update local users list
        const arr = (this.users() || []).map(u => u.id === id ? { ...(u || {}), ...(this.editingUser || {}) } : u);
        this.users.set(arr);
        this.saveLoading.set(false);
        this.isEditingUser.set(false);
        this.editingUser = null;
        // refresh requests counts in case role changed
        this.fetchUsers();
      }, error: (err:any) => {
        console.error('saveUser failed', err);
        // Try to parse validation errors defensively
        try {
          const body = err?.error;
          const map: Record<string,string> = {} as any;
          if (body) {
            if (body.fieldErrors && typeof body.fieldErrors === 'object') {
              for (const k of Object.keys(body.fieldErrors)) { map[k] = body.fieldErrors[k]; }
            } else if (body.errors && Array.isArray(body.errors)) {
              for (const e of body.errors) { if (e.field && e.message) map[e.field] = e.message; }
            } else if (typeof body === 'object') {
              for (const k of Object.keys(body)) { if (typeof body[k] === 'string') map[k] = body[k]; }
            }
          }
          if (Object.keys(map).length > 0) {
            this.fieldErrors.set(map);
          } else {
            this.formError.set(err?.message || (err?.status ? `${err.status} ${err.statusText || ''}` : 'Erreur serveur'));
          }
        } catch(e){
          this.formError.set('Erreur lors de la sauvegarde');
        }
        this.saveLoading.set(false);
      }
    });
  }

  // Print user full info (open print window)
  printUser(u: any){
    try {
      const html = this.buildUserPrintHtml(u);
      const w = window.open('', '_blank', 'width=900,height=900');
      if (!w) { alert('Unable to open print window (blocked).'); return; }
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){ console.warn('printUser failed', e);} }, 700);
    } catch(e){ console.error('printUser error', e); alert('Print failed'); }
  }

  closeUserModal(){ this.userModalVisible.set(false); this.userModalData = null; }

  // Helpers to extract front/back image URLs from a request object.
  getFrontUrl(r: any): string | null {
    if (!r) return null;
    // Try multiple possible field names and structures
    if (r.frontIdUrl) return r.frontIdUrl;
    if (r.frontUrl) return r.frontUrl;
    if (r.frontIdPhotoUrl) return r.frontIdPhotoUrl;
    if (r.front_id_url) return r.front_id_url;
    // Check files array
    if (r.files && Array.isArray(r.files)) {
      const frontFile = r.files.find((f: any) => 
        f.field === 'frontId' || f.field === 'front_id' || f.type === 'frontId'
      );
      if (frontFile?.url) return frontFile.url;
      if (frontFile?.path) return frontFile.path;
    }
    // Check direct properties
    if (r.frontIdPhoto) return r.frontIdPhoto;
    console.log('[getFrontUrl] No front URL found for request:', r);
    return null;
  }

  getBackUrl(r: any): string | null {
    if (!r) return null;
    // Try multiple possible field names and structures
    if (r.backIdUrl) return r.backIdUrl;
    if (r.backUrl) return r.backUrl;
    if (r.backIdPhotoUrl) return r.backIdPhotoUrl;
    if (r.back_id_url) return r.back_id_url;
    // Check files array
    if (r.files && Array.isArray(r.files)) {
      const backFile = r.files.find((f: any) => 
        f.field === 'backId' || f.field === 'back_id' || f.type === 'backId'
      );
      if (backFile?.url) return backFile.url;
      if (backFile?.path) return backFile.path;
    }
    // Check direct properties
    if (r.backIdPhoto) return r.backIdPhoto;
    console.log('[getBackUrl] No back URL found for request:', r);
    return null;
  }

  // Open a file/url in a new tab (used by image thumbnails)
  openFile(url: string | null | undefined){
    if (!url) return;
    try { window.open(url, '_blank'); } catch(e){ console.warn('openFile failed', e); }
  }

  // Print a nicely formatted view of the request (opens print dialog)
  printRequest(r: any){
    try {
      const html = this.buildRequestPrintHtml(r);
      const w = window.open('', '_blank', 'width=900,height=900');
      if (!w) { alert('Unable to open print window (blocked).'); return; }
      w.document.open();
      w.document.write(html);
      w.document.close();
      // wait for images to load before printing
      const tryPrint = () => {
        try {
          w.focus();
          w.print();
        } catch(e){ console.warn('print failed', e); }
      };
      // Give time for images to load
      setTimeout(tryPrint, 700);
    } catch(e){ console.error('printRequest error', e); alert('Print failed'); }
  }

  // Save to PDF: uses the browser print dialog; user can choose 'Save as PDF'
  saveRequestAsPdf(r: any){
    // This is identical to printRequest because the browser print dialog provides Save as PDF
    this.printRequest(r);
  }

  // Build the HTML used for printing/saving PDF
  private buildRequestPrintHtml(r: any): string {
    const front = this.getFrontUrl(r) || '';
    const back = this.getBackUrl(r) || '';
    const name = (r.user?.firstName || '') + ' ' + (r.user?.lastName || '');
    const email = r.user?.email || '';
    const role = r.requestedRole || '';
    const status = r.status || '';
    const created = r.createdAt || '';
    const aff = r.affiliation || '';
    const just = r.justification || '';

    const statusColor = status === 'APPROVED' ? '#16a34a' : status === 'REJECTED' ? '#dc2626' : '#f59e0b';
    const statusBg = status === 'APPROVED' ? '#f0fdf4' : status === 'REJECTED' ? '#fef2f2' : '#fef3c7';
    const statusLabel = status === 'APPROVED' ? '✓ Approuvée' : status === 'REJECTED' ? '✗ Rejetée' : '⏳ En attente';

    const styles = `
      @page { margin: 2cm; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #fff; padding: 20px; line-height: 1.6; }
      .print-container { max-width: 800px; margin: 0 auto; }
      .print-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
      .logo-section { display: flex; align-items: center; gap: 12px; }
      .logo { height: 50px; width: auto; }
      .system-title { font-size: 16px; font-weight: 700; color: #0f172a; }
      .system-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
      .print-date { text-align: right; font-size: 12px; color: #64748b; }
      .request-banner { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
      .request-banner h1 { font-size: 24px; margin-bottom: 8px; }
      .request-meta { font-size: 14px; opacity: 0.9; }
      .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 12px; background: ${statusBg}; color: ${statusColor}; }
      .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 16px; page-break-inside: avoid; }
      .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #cbd5e1; }
      .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .info-item { display: flex; flex-direction: column; }
      .info-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
      .info-value { font-size: 14px; color: #0f172a; font-weight: 500; }
      .full-width { grid-column: 1 / -1; }
      .images-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .image-card { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff; }
      .image-label { background: #0f172a; color: #fff; padding: 8px 12px; font-size: 12px; font-weight: 600; text-align: center; }
      .image-wrapper { padding: 12px; display: flex; align-items: center; justify-content: center; min-height: 200px; background: #f8fafc; }
      .image-wrapper img { max-width: 100%; height: auto; border-radius: 4px; }
      .image-placeholder { color: #94a3b8; font-size: 14px; text-align: center; }
      .justification-box { background: #fff; border-left: 3px solid #3b82f6; padding: 12px; border-radius: 4px; font-size: 13px; color: #475569; line-height: 1.8; }
      .print-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
      @media print { body { padding: 0; } .print-container { max-width: 100%; } }
    `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Demande de Rôle - ${name}</title>
          <meta charset="utf-8" />
          <style>${styles}</style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header with Logo -->
            <div class="print-header">
              <div class="logo-section">
                <img src="/assets/logo_white.png" alt="Logo" class="logo" />
                <div>
                  <div class="system-title">Système de Suivi Doctoral</div>
                  <div class="system-subtitle">Demande de Changement de Rôle</div>
                </div>
              </div>
              <div class="print-date">
                Imprimé le: ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <!-- Request Banner -->
            <div class="request-banner">
              <h1>Demande de Rôle: ${role}</h1>
              <div class="request-meta">${name} • ${email}</div>
              ${created ? `<div class="request-meta" style="margin-top:4px">Soumise le: ${created}</div>` : ''}
              <span class="status-badge">${statusLabel}</span>
            </div>

            <!-- User Information -->
            <div class="section">
              <div class="section-title">👤 Informations du Demandeur</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Nom complet</div>
                  <div class="info-value">${name}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Rôle demandé</div>
                  <div class="info-value">${role}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Statut</div>
                  <div class="info-value">${status}</div>
                </div>
                ${aff ? `
                <div class="info-item full-width">
                  <div class="info-label">Affiliation</div>
                  <div class="info-value">${aff}</div>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Justification -->
            ${just ? `
            <div class="section">
              <div class="section-title">📝 Justification</div>
              <div class="justification-box">${just}</div>
            </div>
            ` : ''}

            <!-- ID Documents -->
            <div class="section">
              <div class="section-title">🆔 Pièces d'Identité</div>
              <div class="images-section">
                <div class="image-card">
                  <div class="image-label">Recto de la CIN</div>
                  <div class="image-wrapper">
                    ${front ? `<img src="${front}" alt="Recto" />` : `<div class="image-placeholder">Aucune image fournie</div>`}
                  </div>
                </div>
                <div class="image-card">
                  <div class="image-label">Verso de la CIN</div>
                  <div class="image-wrapper">
                    ${back ? `<img src="${back}" alt="Verso" />` : `<div class="image-placeholder">Aucune image fournie</div>`}
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="print-footer">
              Document généré automatiquement par le Système de Suivi Doctoral<br/>
              Ce document est confidentiel et destiné uniquement à un usage administratif interne
            </div>
          </div>
        </body>
      </html>
    `;
    return html;
  }

  // Build print HTML for a single user (includes basic profile + pending requests)
  private buildUserPrintHtml(u: any): string {
    if (!u) u = {};
    const name = ((u.firstName || '') + ' ' + (u.lastName || '')).trim();
    const email = u.email || '';
    const role = u.role || '';
    const created = u.createdAt || '';
    const avatar = u.avatar || u.avatarUrl || u.profileImage || '';
    const initials = ((u.firstName?.[0] || '') + (u.lastName?.[0] || '')).toUpperCase();

    const styles = `
      @page { margin: 2cm; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #fff; padding: 20px; line-height: 1.6; }
      .print-container { max-width: 800px; margin: 0 auto; }
      .print-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
      .logo-section { display: flex; align-items: center; gap: 12px; }
      .logo { height: 50px; width: auto; }
      .system-title { font-size: 16px; font-weight: 700; color: #0f172a; }
      .system-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
      .print-date { text-align: right; font-size: 12px; color: #64748b; }
      .profile-banner { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 24px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; gap: 20px; }
      .profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: #0f172a; overflow: hidden; flex-shrink: 0; border: 3px solid #fff; }
      .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .profile-info h1 { font-size: 24px; margin-bottom: 4px; }
      .profile-meta { font-size: 14px; opacity: 0.9; }
      .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 16px; page-break-inside: avoid; }
      .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #cbd5e1; }
      .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .info-item { display: flex; flex-direction: column; }
      .info-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
      .info-value { font-size: 14px; color: #0f172a; font-weight: 500; }
      .full-width { grid-column: 1 / -1; }
      .bio-content { font-size: 13px; color: #475569; line-height: 1.8; padding: 12px; background: #fff; border-left: 3px solid #3b82f6; border-radius: 4px; }
      .cv-section { background: #f0fdf4; border: 1px solid #86efac; }
      .cv-info { display: flex; align-items: center; gap: 12px; }
      .cv-icon { width: 48px; height: 48px; background: #dcfce7; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .cv-details { flex: 1; }
      .cv-title { font-weight: 700; color: #166534; font-size: 14px; }
      .cv-meta { font-size: 12px; color: #15803d; margin-top: 2px; }
      .thesis-section { background: #fef3c7; border: 1px solid #fbbf24; }
      .social-links { display: flex; flex-wrap: wrap; gap: 8px; }
      .social-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #fff; }
      .social-badge.linkedin { background: #0ea5e9; }
      .social-badge.portfolio { background: #8b5cf6; }
      .social-badge.github { background: #1f2937; }
      .social-badge.twitter { background: #3b82f6; }
      .print-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
      @media print { body { padding: 0; } .print-container { max-width: 100%; } }
    `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Profil Utilisateur - ${name}</title>
          <meta charset="utf-8" />
          <style>${styles}</style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header with Logo -->
            <div class="print-header">
              <div class="logo-section">
                <img src="/assets/logo_white.png" alt="Logo" class="logo" />
                <div>
                  <div class="system-title">Système de Suivi Doctoral</div>
                  <div class="system-subtitle">Profil Utilisateur</div>
                </div>
              </div>
              <div class="print-date">
                Imprimé le: ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <!-- Profile Banner -->
            <div class="profile-banner">
              <div class="profile-avatar">
                ${avatar ? `<img src="${avatar}" alt="${name}" />` : `<span>${initials}</span>`}
              </div>
              <div class="profile-info">
                <h1>${name}</h1>
                <div class="profile-meta">${email} • ${role}</div>
                ${created ? `<div class="profile-meta" style="margin-top:4px">Membre depuis: ${created}</div>` : ''}
              </div>
            </div>

            <!-- Bio Section -->
            ${u.bio ? `
            <div class="section">
              <div class="section-title">📝 Biographie</div>
              <div class="bio-content">${u.bio}</div>
            </div>
            ` : ''}

            <!-- Personal Information -->
            <div class="section">
              <div class="section-title"> Informations Personnelles</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Prénom</div>
                  <div class="info-value">${u.firstName || '—'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Nom</div>
                  <div class="info-value">${u.lastName || '—'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${email || '—'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Rôle</div>
                  <div class="info-value">${role || '—'}</div>
                </div>
                ${!((u.role||'').toString().toLowerCase().includes('encadrant')) ? `
                <div class="info-item">
                  <div class="info-label">Identifiant</div>
                  <div class="info-value">${u.id || '—'}</div>
                </div>
                ` : ''}
                <div class="info-item">
                  <div class="info-label">Téléphone</div>
                  <div class="info-value">${u.phone || u.phoneNumber || u.telephone || '—'}</div>
                </div>
                <div class="info-item full-width">
                  <div class="info-label">Adresse</div>
                  <div class="info-value">${u.address || '—'}</div>
                </div>
                ${u.dateNaissance || u.birthDate ? `
                <div class="info-item">
                  <div class="info-label">Date de naissance</div>
                  <div class="info-value">${u.dateNaissance || u.birthDate}</div>
                </div>
                ` : ''}
                ${u.lieuNaissance || u.birthPlace ? `
                <div class="info-item">
                  <div class="info-label">Lieu de naissance</div>
                  <div class="info-value">${u.lieuNaissance || u.birthPlace}</div>
                </div>
                ` : ''}
                ${u.nationalite || u.nationality ? `
                <div class="info-item">
                  <div class="info-label">Nationalité</div>
                  <div class="info-value">${u.nationalite || u.nationality}</div>
                </div>
                ` : ''}
                ${u.cin || u.idCard ? `
                <div class="info-item">
                  <div class="info-label">CIN</div>
                  <div class="info-value">${u.cin || u.idCard}</div>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- CV Section -->
            ${u.cvUrl || u.cv ? `
            <div class="section cv-section">
              <div class="section-title" style="color:#166534;border-color:#86efac"> Curriculum Vitae</div>
              <div class="cv-info">
                <div class="cv-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#16a34a" stroke-width="2"/>
                    <polyline points="14 2 14 8 20 8" stroke="#16a34a" stroke-width="2"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="#16a34a" stroke-width="2"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="#16a34a" stroke-width="2"/>
                  </svg>
                </div>
                <div class="cv-details">
                  <div class="cv-title">Curriculum Vitae</div>
                  <div class="cv-meta">Document disponible • Format PDF</div>
                  <div style="margin-top:6px;font-size:11px;color:#15803d;word-break:break-all">${u.cvUrl || u.cv}</div>
                </div>
              </div>
            </div>
            ` : ''}

            <!-- Social Links -->
            ${(u.linkedinUrl || u.portfolioUrl || u.githubUrl || u.twitterUrl) ? `
            <div class="section">
              <div class="section-title">🔗 Liens Professionnels & Réseaux Sociaux</div>
              <div class="social-links">
                ${u.linkedinUrl ? `<span class="social-badge linkedin">LinkedIn: ${u.linkedinUrl}</span>` : ''}
                ${u.portfolioUrl ? `<span class="social-badge portfolio">Portfolio: ${u.portfolioUrl}</span>` : ''}
                ${u.githubUrl ? `<span class="social-badge github">GitHub: ${u.githubUrl}</span>` : ''}
                ${u.twitterUrl ? `<span class="social-badge twitter">Twitter: ${u.twitterUrl}</span>` : ''}
              </div>
            </div>
            ` : ''}

            <!-- Thesis Information -->
            ${(u.sujetThese || u.directeurThese || u.laboratoire || u.etablissementOrigine) ? `
            <div class="section thesis-section">
              <div class="section-title" style="color:#78350f;border-color:#fbbf24">🎓 Informations de Thèse</div>
              <div class="info-grid">
                ${u.sujetThese ? `
                <div class="info-item full-width">
                  <div class="info-label">Sujet de thèse</div>
                  <div class="info-value">${u.sujetThese}</div>
                </div>
                ` : ''}
                ${u.directeurThese ? `
                <div class="info-item">
                  <div class="info-label">Directeur de thèse</div>
                  <div class="info-value">${u.directeurThese}</div>
                </div>
                ` : ''}
                ${u.laboratoire ? `
                <div class="info-item">
                  <div class="info-label">Laboratoire</div>
                  <div class="info-value">${u.laboratoire}</div>
                </div>
                ` : ''}
                ${u.etablissementOrigine ? `
                <div class="info-item full-width">
                  <div class="info-label">Établissement d'origine</div>
                  <div class="info-value">${u.etablissementOrigine}</div>
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}

            <!-- Footer -->
            <div class="print-footer">
              Document généré automatiquement par le Système de Suivi Doctoral<br/>
              Ce document est confidentiel et destiné uniquement à un usage administratif interne
            </div>
          </div>
        </body>
      </html>
    `;
    return html;
  }

  // Return requests for a given user id
  getRequestsForUser(userId: number){
    const all = this.requests() || [];
    // Only show pending requests per user in the expanded view (hide approved/rejected/cancelled)
    return all.filter(r => {
      try {
        const rid = (r.user && r.user.id) ? r.user.id : (r.userId || null);
        if (rid !== userId) return false;
        const st = (r.status || '').toString().toUpperCase();
        return st === 'PENDING';
      } catch (e) { return false; }
    });
  }

  // Return all requests for a given user id (used in modal to show full history)
  getAllRequestsForUser(userId: number){
    const all = this.requests() || [];
    return all.filter(r => {
      try {
        const rid = (r.user && r.user.id) ? r.user.id : (r.userId || null);
        if (rid !== userId) return false;
        const st = (r.status || '').toString().toUpperCase();
        // exclude cancelled requests
        if (st === 'CANCELLED' || st === 'CANCELED') return false;
        return true;
      } catch(e){ return false; }
    });
  }

  // Get filtered requests (exclude cancelled, apply search and role filter)
  filteredRequests() {
    let filtered = this.requests().filter(r => 
      r.status && r.status.toUpperCase() !== 'CANCELLED' && r.status.toUpperCase() !== 'CANCELED'
    );
    
    // Apply role filter
    if (this.selectedRole() !== 'all') {
      filtered = filtered.filter(r => 
        r.requestedRole && r.requestedRole.toLowerCase().includes(this.selectedRole().toLowerCase())
      );
    }
    
    // Apply status filter
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(r => 
        r.status && r.status.toUpperCase() === this.selectedStatus().toUpperCase()
      );
    }
    
    // Apply search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(r => {
        const name = `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.toLowerCase();
        const email = (r.user?.email || '').toLowerCase();
        const role = (r.requestedRole || '').toLowerCase();
        const affiliation = (r.affiliation || '').toLowerCase();
        return name.includes(query) || email.includes(query) || role.includes(query) || affiliation.includes(query);
      });
    }
    
    return filtered;
  }

  // Get filtered users
  filteredUsers() {
    let filtered = this.users();
    
    // Apply role filter
    if (this.userRoleFilter() !== 'all') {
      filtered = filtered.filter(u => 
        u.role && u.role.toLowerCase() === this.userRoleFilter().toLowerCase()
      );
    }
    
    // Apply demandes filter (exclude cancelled requests in count)
    if (this.userDemandesFilter() === 'with') {
      filtered = filtered.filter(u => this.requestCounts()[u.id] > 0);
    } else if (this.userDemandesFilter() === 'without') {
      filtered = filtered.filter(u => !this.requestCounts()[u.id]);
    }
    
    // Apply search query
    const query = this.userSearchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(u => {
        const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        const email = (u.email || '').toLowerCase();
        const role = (u.role || '').toLowerCase();
        return name.includes(query) || email.includes(query) || role.includes(query);
      });
    }
    
    return filtered;
  }

  // Get paginated users
  paginatedUsers() {
    const filtered = this.filteredUsers();
    const start = (this.usersPage() - 1) * this.usersPerPage();
    const end = start + this.usersPerPage();
    return filtered.slice(start, end);
  }

  // Get total pages for users
  usersTotalPages() {
    return Math.ceil(this.filteredUsers().length / this.usersPerPage());
  }

  // Change users page
  setUsersPage(page: number) {
    if (page >= 1 && page <= this.usersTotalPages()) {
      this.usersPage.set(page);
    }
  }
  
  // Reset users page when filters change
  resetUsersPage() {
    this.usersPage.set(1);
  }
  
  // Reset requests page when filters change
  resetRequestsPage() {
    this.requestsPage.set(1);
  }

  // Get unique roles from requests
  availableRoles() {
    const roles = new Set<string>();
    this.requests().forEach(r => {
      if (r.requestedRole) roles.add(r.requestedRole);
    });
    return Array.from(roles).sort();
  }

  // Get unique roles from users
  availableUserRoles() {
    const roles = new Set<string>();
    this.users().forEach(u => {
      if (u.role) roles.add(u.role);
    });
    return Array.from(roles).sort();
  }

  // Get paginated requests
  paginatedRequests() {
    const filtered = this.filteredRequests();
    const start = (this.requestsPage() - 1) * this.requestsPerPage();
    const end = start + this.requestsPerPage();
    return filtered.slice(start, end);
  }

  // Get total pages for requests
  requestsTotalPages() {
    return Math.ceil(this.filteredRequests().length / this.requestsPerPage());
  }

  // Change requests page
  setRequestsPage(page: number) {
    if (page >= 1 && page <= this.requestsTotalPages()) {
      this.requestsPage.set(page);
    }
  }

  // open confirmation modal for approve/reject
  openConfirm(r: any, action: 'approve'|'reject'){
    this.modalRequest = r;
    this.modalAction = action;
    this.modalMessage = '';
    this.modalNotify = false;
    this.modalVisible.set(true);
  }

  // confirm modal action
  confirmModal(){
    if (!this.modalRequest || !this.modalAction) return;
    const id = this.modalRequest.id;
    this.modalLoading.set(true);
  const payload = { reason: this.modalMessage, notifyByEmail: this.modalNotify };
  // set cookie fallback before calling approve/reject so backend TokenFilter can authenticate
  try { const t3 = localStorage.getItem('auth_token'); if (t3) { document.cookie = 'JWT=' + t3 + ';path=/'; } } catch(e) {}
  const call = this.http.post(`/gestion-auth-service/api/auth/role-requests/${id}/${this.modalAction}`, payload);
    call.subscribe({ next: () => {
      // optional message
      const msg = this.modalMessage;
      if (msg && msg.trim().length > 0){
        this.http.post(`/gestion-auth-service/api/auth/role-requests/${id}/message`, { message: msg }).subscribe({ next: () => {}, error: () => {} });
      }
      this.modalLoading.set(false);
      this.modalVisible.set(false);
      this.modalAction = null;
      this.modalRequest = null;
      this.fetchUsers();
    }, error: () => { this.modalLoading.set(false); alert('Operation failed'); } });
  }

  cancelModal(){ this.modalVisible.set(false); this.modalAction = null; this.modalRequest = null; this.modalMessage = ''; }

  // compatibility methods used in template
  approveRequest(r: any){ this.openConfirm(r, 'approve'); }
  rejectRequest(r: any){ this.openConfirm(r, 'reject'); }

  sendMessage(r: any){
    const m = prompt('Message to ' + (r.user?.email || 'user') + ':');
    if (!m) return;
    this.http.post(`/gestion-auth-service/api/auth/role-requests/${r.id}/message`, { message: m }).subscribe({ next: () => { alert('Message sent'); }, error: () => { alert('Failed to send message'); } });
  }
}
