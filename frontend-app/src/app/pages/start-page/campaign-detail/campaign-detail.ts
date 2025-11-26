import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../../components/navbar/public-navbar';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';
import { AuthService } from '../../../services/auth.service';
import { CampagnesService } from '../../../services/campagnes.service';

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
  
  etablissement?: string;
  ecoleDoctorale?: string;
  logoEcole?: string;
  photoCouverture?: string;
  piecesObligatoires?: string[];
  reglesEligibilite?: string;
  
  anneeConcernee?: string;
  documentsARenouveler?: string[];
  derogationTroisiemeAnnee?: boolean;
  messageInformatif?: string;
  
  checklistObligatoire?: ChecklistItem[];
  documentsObligatoires?: string[];
  modeleAutorisation?: string;
  
  emailOuverture?: string;
  emailRappel?: string;
  emailFermeture?: string;
  
  nombreDossiers?: number;
}

@Component({
  selector: 'campaign-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PublicNavbarComponent, CandidatNavbarComponent],
  templateUrl: './campaign-detail.html',
  styleUrls: ['./campaign-detail.scss']
})
export class CampaignDetailComponent implements OnInit {
  campaign = signal<Campagne | null>(null);
  loading = signal(true);
  error = signal('');
  isFavorite = signal(false);
  hasApplied = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campagnesService: CampagnesService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  

  get isLoggedIn(): boolean { 
    return this.auth.isLoggedIn ? this.auth.isLoggedIn() : false; 
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCampaign(+id);
      this.loadFavoriteStatus(+id);
      this.loadApplicationStatus(+id);
    } else {
      this.error.set('ID de campagne invalide');
      this.loading.set(false);
    }
  }

  loadCampaign(id: number): void {
    // Use public endpoint and filter by ID
    this.campagnesService.getActiveCampaigns().subscribe({
      next: (dataArray: any[]) => {
        console.log('[CampaignDetail] active list length=', dataArray && dataArray.length);
        const data = (dataArray || []).find((c: any) => Number(c.id) === Number(id));
        if (!data) {
          // If not found in public actives, and user is logged in, try admin list as fallback
          if (this.isLoggedIn) {
            console.log('[CampaignDetail] not found in public actives, trying admin fallback');
            this.campagnesService.getAll().subscribe({
              next: (all: any[]) => {
                const found = (all || []).find((x: any) => Number(x.id) === Number(id));
                if (!found) {
                  this.error.set('Campagne introuvable');
                  this.loading.set(false);
                  try { this.cdr.detectChanges(); } catch(e) {}
                  return;
                }
                this.setCampaignFromRaw(found);
              },
              error: (e) => {
                console.error('[CampaignDetail] admin fallback error', e);
                this.error.set('Campagne introuvable');
                this.loading.set(false);
              }
            });
            return;
          }
          this.error.set('Campagne introuvable');
          this.loading.set(false);
          return;
        }
        const mapped: Campagne = {
          id: data.id,
          nom: data.nom,
          type: (data.type as any) || 'INSCRIPTION',
          anneeUniversitaire: data.anneeUniversitaire || '',
          description: data.description || '',
          dateOuverture: data.dateOuverture,
          dateFermeture: data.dateFermeture,
          active: data.active,
          visibilite: (data.visibilite as any) || 'PUBLIC',
          etablissement: data.etablissement,
          ecoleDoctorale: data.ecoleDoctorale,
          logoEcole: data.logoEcole,
          photoCouverture: data.photoCouverture,
          piecesObligatoires: data.piecesObligatoires || [],
          reglesEligibilite: data.reglesEligibilite,
          anneeConcernee: data.anneeConcernee,
          documentsARenouveler: data.documentsARenouveler || [],
          derogationTroisiemeAnnee: data.derogationTroisiemeAnnee,
          messageInformatif: data.messageInformatif,
          checklistObligatoire: data.checklistObligatoire || [],
          documentsObligatoires: data.documentsObligatoires || [],
          modeleAutorisation: data.modeleAutorisation,
          emailOuverture: data.emailOuverture,
          emailRappel: data.emailRappel,
          emailFermeture: data.emailFermeture,
          nombreDossiers: data.nombreDossiers || 0
        };
        this.campaign.set(mapped);
        this.loading.set(false);
        try { this.cdr.detectChanges(); } catch(e) {}
      },
      error: (_err: any) => {
        console.error('Error loading campaign:', _err);
        this.error.set('Erreur lors du chargement de la campagne');
        this.loading.set(false);
      }
    });
  }

  private setCampaignFromRaw(data: any) {
    const mapped: Campagne = {
      id: data.id,
      nom: data.nom,
      type: (data.type as any) || 'INSCRIPTION',
      anneeUniversitaire: data.anneeUniversitaire || '',
      description: data.description || '',
      dateOuverture: data.dateOuverture,
      dateFermeture: data.dateFermeture,
      active: data.active,
      visibilite: (data.visibilite as any) || 'PUBLIC',
      etablissement: data.etablissement,
      ecoleDoctorale: data.ecoleDoctorale,
      logoEcole: data.logoEcole,
      photoCouverture: data.photoCouverture,
      piecesObligatoires: data.piecesObligatoires || [],
      reglesEligibilite: data.reglesEligibilite,
      anneeConcernee: data.anneeConcernee,
      documentsARenouveler: data.documentsARenouveler || [],
      derogationTroisiemeAnnee: data.derogationTroisiemeAnnee,
      messageInformatif: data.messageInformatif,
      checklistObligatoire: data.checklistObligatoire || [],
      documentsObligatoires: data.documentsObligatoires || [],
      modeleAutorisation: data.modeleAutorisation,
      emailOuverture: data.emailOuverture,
      emailRappel: data.emailRappel,
      emailFermeture: data.emailFermeture,
      nombreDossiers: data.nombreDossiers || 0
    };
    this.campaign.set(mapped);
    this.loading.set(false);
    try { this.cdr.detectChanges(); } catch(e) {}
  }

  loadFavoriteStatus(id: number): void {
    try {
      // prefer namespaced key when available (per-user), fall back to legacy global key
      const key = this.getFavoritesKey();
      let raw = localStorage.getItem(key);
      if (!raw) raw = localStorage.getItem('campaign_favorites');
      if (raw) {
        const favs = new Set<number>(JSON.parse(raw));
        this.isFavorite.set(favs.has(id));
      } else {
        this.isFavorite.set(false);
      }
    } catch {}
  }

  loadApplicationStatus(id: number): void {
    // Check if user has applied (would normally come from backend)
    // For now just check localStorage
    try {
      const raw = localStorage.getItem('applied_campaigns');
      if (raw) {
        const applied = new Set<number>(JSON.parse(raw));
        this.hasApplied.set(applied.has(id));
      }
    } catch {}
  }

  toggleFavorite(): void {
    const c = this.campaign();
    if (!c || !c.id) return;

    try {
      // Use the namespaced key when possible, and keep the legacy key in sync for compatibility
      const key = this.getFavoritesKey();
      let raw = localStorage.getItem(key);
      if (!raw) raw = localStorage.getItem('campaign_favorites');
      const favs = new Set<number>(raw ? JSON.parse(raw) : []);

      if (favs.has(c.id)) {
        favs.delete(c.id);
        this.isFavorite.set(false);
      } else {
        favs.add(c.id);
        this.isFavorite.set(true);
      }

      // persist to both keys: namespaced and global (for older clients)
      try { localStorage.setItem(key, JSON.stringify(Array.from(favs))); } catch (e) {}
      try { localStorage.setItem('campaign_favorites', JSON.stringify(Array.from(favs))); } catch (e) {}
    } catch {}
  }

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

  applyCampaign(): void {
    const c = this.campaign();
    if (!c || !c.id || this.hasApplied()) return;
    
    const status = this.getCampagneStatus();
    if (status === 'ended' || !c.active) return;

    // In real app, would submit application to backend
    // For now just mark as applied locally
    try {
      const raw = localStorage.getItem('applied_campaigns');
      const applied = new Set<number>(raw ? JSON.parse(raw) : []);
      applied.add(c.id);
      localStorage.setItem('applied_campaigns', JSON.stringify(Array.from(applied)));
      this.hasApplied.set(true);
      alert('Candidature soumise avec succès!');
    } catch {}
  }

  getCampagneStatus(): 'active' | 'upcoming' | 'ended' {
    const c = this.campaign();
    if (!c) return 'ended';
    
    const now = new Date();
    const ouverture = new Date(c.dateOuverture);
    const fermeture = new Date(c.dateFermeture);
    
    if (!c.active) return 'ended';
    if (now < ouverture) return 'upcoming';
    if (now > fermeture) return 'ended';
    return 'active';
  }

  getStatusLabel(): string {
    const status = this.getCampagneStatus();
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

  daysLeft(): number {
    const c = this.campaign();
    if (!c) return 0;
    const fermeture = new Date(c.dateFermeture);
    const d = Math.ceil((fermeture.getTime() - Date.now()) / 86400000);
    return d < 0 ? 0 : d;
  }

  daysUntilStart(): number {
    const c = this.campaign();
    if (!c) return 0;
    const ouverture = new Date(c.dateOuverture);
    const d = Math.ceil((ouverture.getTime() - Date.now()) / 86400000);
    return d < 0 ? 0 : d;
  }

  goBack(): void {
    this.router.navigate(['/campaigns']);
  }

  onImgError(e: any): void {
    try { e.target.style.visibility = 'hidden'; } catch {}
  }
}
