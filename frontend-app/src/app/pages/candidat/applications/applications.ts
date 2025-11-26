import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';
import { CampagnesService } from '../../../services/campagnes.service';

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
    .control { padding:0.5rem 0.75rem; border-radius:8px; background:#fff; border:1px solid #e6eef8; box-shadow:0 4px 12px rgba(2,6,23,0.04); }
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
  applied = new Set<number>();
  loading = false;

  // filters
  searchQuery = '';
  selectedTypes: string[] = [];
  allTypes = ['INSCRIPTION','REINSCRIPTION','SOUTENANCE'];
  filterStatus: 'all'|'active'|'upcoming'|'ended' = 'all';
  sortKey: 'relevance'|'deadline'|'recent' = 'relevance';

  constructor(private campagnesService: CampagnesService) {}

  ngOnInit(): void {
    this.loadApplied();
    this.fetchCampaigns();
  }

  loadApplied(): void {
    try {
      const raw = localStorage.getItem('campaign_applied');
      if (raw) this.applied = new Set(JSON.parse(raw));
      else {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || '';
          if (k && k.startsWith('campaign_applied_')) {
            const v = localStorage.getItem(k);
            if (v) { this.applied = new Set(JSON.parse(v)); break; }
          }
        }
      }
    } catch (e) { this.applied = new Set(); }
  }

  fetchCampaigns(): void {
    this.loading = true;
    this.campagnesService.getActiveCampaigns().subscribe({ next: (data:any) => {
      const list = Array.isArray(data) ? data : [];
      this.allCampaigns = list;
      this.applyFilters();
      this.loading = false;
    }, error: (err:any) => { this.loading = false; this.allCampaigns = []; this.campaigns = []; } });
  }

  applyFilters(): void {
    let list = this.allCampaigns.slice();
    // only applied
    list = list.filter(c => c.id && this.applied.has(c.id));
    // search
    if (this.searchQuery && this.searchQuery.trim()){
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c => (c.nom||'').toLowerCase().includes(q) || (c.description||'').toLowerCase().includes(q));
    }
    // types
    if (this.selectedTypes.length){ list = list.filter(c => this.selectedTypes.includes(c.type)); }
    // status
    if (this.filterStatus !== 'all'){
      const now = new Date();
      list = list.filter(c=>{
        const ouverture = new Date(c.dateOuverture||0);
        const fermeture = new Date(c.dateFermeture||0);
        if (this.filterStatus==='active') return c.active && now>=ouverture && now<=fermeture;
        if (this.filterStatus==='upcoming') return now < ouverture;
        if (this.filterStatus==='ended') return now > fermeture;
        return true;
      });
    }
    // sort
    if (this.sortKey === 'deadline') list.sort((a,b)=> new Date(a.dateFermeture).getTime() - new Date(b.dateFermeture).getTime());
    if (this.sortKey === 'recent') list.sort((a,b)=> new Date(b.dateOuverture).getTime() - new Date(a.dateOuverture).getTime());

    this.campaigns = list;
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
