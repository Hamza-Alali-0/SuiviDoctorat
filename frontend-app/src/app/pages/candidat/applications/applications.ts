import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';
import { ApplicationsService } from '../../../services/applications.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'candidat-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CandidatNavbarComponent],
  templateUrl: './applications.html',
  styles: [`
    :host { display:block; min-height:100vh; background:#f8fafc; }
    .container { max-width:1200px; margin:0 auto; padding:2rem; }
    .header { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1rem; }
    .title { font-size:1.5rem; font-weight:800; }
    .controls { display:flex; gap:0.75rem; align-items:center; margin-bottom:1rem; flex-wrap:wrap }
    .control { padding:0.5rem 0.75rem; border-radius:8px; background:#fff; border:1px solid #e6eef8; box-shadow:0 4px 12px rgba(2,6,23,0.04); cursor:pointer; }
    .control:hover:not(:disabled) { border-color:#2563eb; }
    .control:disabled { opacity:0.5; cursor:not-allowed; }
    .btn-refresh { display:flex; align-items:center; justify-content:center; padding:0.5rem 0.75rem; }
    .btn-refresh svg { transition:transform 0.3s ease; }
    .btn-refresh:not(:disabled):hover svg { transform:rotate(180deg); }
    .list { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1rem; }
    .campaign-card { background:#fff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; transition:all .3s cubic-bezier(0.4, 0, 0.2, 1); display:flex; flex-direction:column; position:relative; box-shadow:0 4px 12px rgba(0,0,0,0.04) }
    .campaign-card:hover { transform:translateY(-6px); box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border-color:#cbd5e1 }
    :host-context(.dark) .campaign-card { background:#1e293b; border-color:#334155 }

    .card-header { position:relative; height:180px; }
    .banner-wrapper { height:100%; width:100%; position:relative; overflow:hidden; }
    .banner { width:100%; height:100%; object-fit:cover; transition:transform .7s ease; }
    .campaign-card:hover .banner { transform:scale(1.08); }
    .overlay-gradient { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.36) 0%, transparent 60%); opacity:0.6; }
    .status-badge { position:absolute; top:12px; right:12px; padding:.35rem .75rem; border-radius:100px; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#fff; backdrop-filter:blur(4px); box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:2; }
    .st-open { background:rgba(22,163,74,0.9); }
    .st-closing-soon { background:rgba(234,88,12,0.9); }
    .st-closed { background:rgba(100,116,139,0.9); }
    .app-status { position:absolute; bottom:12px; left:12px; padding:.25rem .5rem; border-radius:6px; font-size:.7rem; font-weight:600; background:#fff; color:#0f172a; box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:2; }

    .logo-box { position:absolute; bottom:-24px; left:1.5rem; width:64px; height:64px; background:#fff; border-radius:16px; padding:4px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); z-index:10; display:flex; align-items:center; justify-content:center; border:2px solid #fff; }
    :host-context(.dark) .logo-box { background:#1e293b; border-color:#1e293b; }
    .logo-box img { max-width:100%; max-height:100%; object-fit:contain; border-radius:12px; }

    .card-body { padding:2rem 1.5rem 1.5rem; flex:1; display:flex; flex-direction:column; }
    .uni-name { display:flex; align-items:center; gap:.5rem; font-size:.8rem; font-weight:600; color:#64748b; margin-bottom:.5rem; }
    .card-title { font-size:1.25rem; font-weight:700; line-height:1.4; margin:0 0 1rem; color:#0f172a; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden }
    :host-context(.dark) .card-title { color:#f8fafc; }

    .card-desc { font-size:.85rem; color:#475569; line-height:1.5; margin:0 0 1rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden }
    :host-context(.dark) .card-desc { color:#a1a1a6 }
    .card-meta { display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem; }
    .btn-ghost { background:transparent; border:none; color:#2563eb; cursor:pointer; font-weight:700; }
    .empty { text-align:center; padding:3rem; color:#64748b; }
    @media (max-width:800px){ .list{ grid-template-columns:1fr } }
  `]
})
export class ApplicationsPage implements OnInit {
  campaigns: any[] = [];
  allCampaigns: any[] = [];
  loading = false;

  // filters
  searchQuery = '';
  selectedTypes: string[] = [];
  allTypes = ['INSCRIPTION','REINSCRIPTION','SOUTENANCE'];
  filterStatus: 'all'|'active'|'upcoming'|'ended' = 'all';
  sortKey: 'relevance'|'deadline'|'recent' = 'relevance';

  constructor(
    private applicationsService: ApplicationsService,
    private authService: AuthService
  ) {
    // Listen for updates from the campaigns page (when user submits an application)
    this.applicationsService.getApplicationsUpdated().subscribe(() => {
      console.log('[ApplicationsPage] ✓ Detected application update notification, refreshing...');
      this.fetchApplications();
    });
  }

  ngOnInit(): void {
    console.log('[ApplicationsPage] Component initialized, loading applications...');
    this.fetchApplications();
  }
  
  refresh(): void {
    console.log('[ApplicationsPage] Manual refresh triggered by user');
    this.fetchApplications();
  }

  fetchApplications(): void {
    console.log('[ApplicationsPage] Starting fetchApplications()');
    this.loading = true;

    // We rely on the 'me' endpoint which uses the token from the interceptor
    // This avoids complex and fragile token parsing in the component
    this.applicationsService.getMyApplications().subscribe({
      next: (data) => {
        console.log('[ApplicationsPage] ✓ Received raw data from getMyApplications:', data);
        console.log('[ApplicationsPage] Number of dossiers received:', Array.isArray(data) ? data.length : 0);
        
        // Map dossiers to campaign view model
        this.allCampaigns = (Array.isArray(data) ? data : []).map(d => {
          const status = (d.statut || d.status || d.applicationStatus || d.state || 'EN_ATTENTE');
          const created = d.dateCreation || d.dateSoumission || d.createdAt;
          const camp = d.campagne || {};
          
          // Calculate campaign status (active/ended/upcoming)
          const campStatus = this.getCampagneStatus(camp);

          console.log('[ApplicationsPage]   Processing dossier:', {
            dossierId: d.id,
            campaignId: camp.id,
            campaignName: camp.nom,
            status,
            created,
            campStatus
          });

          return {
            ...camp,
            // Ensure we have fallback for critical fields if they are missing in 'camp'
            nom: camp.nom || 'Campagne sans nom',
            description: camp.description || '',
            status: campStatus, // Campaign status (OPEN/CLOSED)
            applicationStatus: status, // Application status (SUBMITTED/APPROVED)
            applicationDate: created,
            dossierId: d.id
          };
        });

        console.log('[ApplicationsPage] ✓ Mapped to allCampaigns, total:', this.allCampaigns.length);

        // Persist applied campaign ids so campaigns page can read them from localStorage
        try {
          const ids = this.allCampaigns.map(c => c.id).filter(Boolean) as number[];
          const key = (this.authService && typeof this.authService.getAppliedKeyForUser === 'function')
            ? this.authService.getAppliedKeyForUser()
            : 'campaign_applied';
          console.log('[ApplicationsPage] Saving applied campaign IDs to localStorage:', { key, ids });
          if (key) localStorage.setItem(key, JSON.stringify(ids));
        } catch (e) { console.error('[ApplicationsPage] Error saving to localStorage:', e); }

        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('[ApplicationsPage] ✗ Failed to fetch applications from backend:', err);
        this.loading = false;
        this.allCampaigns = [];
        this.campaigns = [];
      }
    });
  }

  getCampagneStatus(c: any): string {
    if (!c || !c.dateOuverture || !c.dateFermeture) return '';
    const now = new Date();
    const ouverture = new Date(c.dateOuverture);
    const fermeture = new Date(c.dateFermeture);

    if (c.active === false) return 'closed'; // Explicitly inactive
    if (now < ouverture) return 'upcoming';
    if (now > fermeture) return 'closed';
    return 'open';
  }

  // Note: key generation delegated to AuthService.getAppliedKeyForUser()

  applyFilters(): void {
    console.log('[ApplicationsPage] applyFilters() called. allCampaigns count:', this.allCampaigns.length);
    let list = this.allCampaigns.slice();
    
    // search
    if (this.searchQuery && this.searchQuery.trim()){
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c => (c.nom||'').toLowerCase().includes(q) || (c.description||'').toLowerCase().includes(q));
    }
    // types
    if (this.selectedTypes.length){ 
      list = list.filter(c => this.selectedTypes.includes(c.type));
    }
    // status
    if (this.filterStatus !== 'all'){
      const now = new Date();
      list = list.filter(c=>{
        if (!c.dateOuverture || !c.dateFermeture) return true; // Keep if dates are missing
        const ouverture = new Date(c.dateOuverture);
        const fermeture = new Date(c.dateFermeture);
        if (this.filterStatus==='active') return c.active && now>=ouverture && now<=fermeture;
        if (this.filterStatus==='upcoming') return now < ouverture;
        if (this.filterStatus==='ended') return now > fermeture;
        return true;
      });
    }
    // sort
    if (this.sortKey === 'deadline') {
      list.sort((a,b)=> {
        if (!a.dateFermeture) return 1;
        if (!b.dateFermeture) return -1;
        return new Date(a.dateFermeture).getTime() - new Date(b.dateFermeture).getTime();
      });
    }
    if (this.sortKey === 'recent') {
      list.sort((a,b)=> {
        if (!a.dateOuverture) return 1;
        if (!b.dateOuverture) return -1;
        return new Date(b.dateOuverture).getTime() - new Date(a.dateOuverture).getTime();
      });
    }

    this.campaigns = list;
    console.log('[ApplicationsPage] ✓ applyFilters() complete. Final campaigns count:', this.campaigns.length);
  }

  formatDateRange(start?: string, end?: string): string {
    if (!start && !end) return '';
    try {
      const s = start ? new Date(start) : null;
      const e = end ? new Date(end) : null;
      const opts: any = { day: '2-digit', month: 'short', year: 'numeric' };
      if (s && e) return `${s.toLocaleDateString(undefined, opts)} — ${e.toLocaleDateString(undefined, opts)}`;
      if (s) return `Ouvre ${s.toLocaleDateString(undefined, opts)}`;
      if (e) return `Clôture ${e.toLocaleDateString(undefined, opts)}`;
    } catch (e) {}
    return '';
  }
}
