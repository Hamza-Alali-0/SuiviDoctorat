import { Component, OnInit, signal, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../../components/navbar/public-navbar';
import { CandidatNavbarComponent } from '../../../components/navbar/candidat-navbar';
import { SiteFooterComponent } from '../../../components/footer/site-footer.component';
import { AuthService } from '../../../services/auth.service';
import { CampagnesService } from '../../../services/campagnes.service';
import { ApplicationsService } from '../../../services/applications.service';
import { TranslationService } from '../../../services/translation.service';

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
  imports: [CommonModule, FormsModule, RouterLink, PublicNavbarComponent, CandidatNavbarComponent, SiteFooterComponent],
  templateUrl: './campaign-detail.html',
  styleUrls: ['./campaign-detail.scss']
})
export class CampaignDetailComponent implements OnInit {
  campaign = signal<Campagne | null>(null);
  loading = signal(true);
  error = signal('');
  isFavorite = signal(false);
  hasApplied = signal(false);

  // Application modal + form state
  showApplicationModal = signal(false);

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
    highestDegree: '',
    etablissementOrigine: '',
    diplomesPrecedents: '',

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
    private route: ActivatedRoute,
    private router: Router,
    private campagnesService: CampagnesService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef,
    private applicationsService: ApplicationsService,
    protected tx: TranslationService
  ) { }


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

    if (this.isLoggedIn) {
      this.auth.getProfile().subscribe({
        next: (user: any) => {
          console.log('[CampaignDetail] Profile loaded:', user);
          const uid = user.id || user.userId || user.sub;
          if (uid) {
            this.currentUserId = Number(uid);
            // Pre-fill form
            this.applicationForm.prenom = user.prenom || this.applicationForm.prenom;
            this.applicationForm.nom = user.nom || this.applicationForm.nom;
            this.applicationForm.email = user.email || this.applicationForm.email;
          } else {
            console.warn('[CampaignDetail] Profile loaded but no ID found:', user);
            this.tryExtractIdFromToken();
          }
        },
        error: (err) => {
          console.error('[CampaignDetail] Failed to load user profile:', err);
          this.tryExtractIdFromToken();
        }
      });
    }
  }

  tryExtractIdFromToken(): void {
    try {
      const token = this.auth.getToken ? this.auth.getToken() : null;
      if (token) {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const cand = payload.id || payload.sub || payload.userId;
          if (cand && !isNaN(Number(cand))) {
            this.currentUserId = Number(cand);
            console.log('[CampaignDetail] Recovered userId from token:', this.currentUserId);
            if (!this.applicationForm.email && payload.email) this.applicationForm.email = payload.email;
            if (!this.applicationForm.nom && payload.name) this.applicationForm.nom = payload.name;
          }
        }
      }
    } catch (e) { console.error('[CampaignDetail] Token parse failed:', e); }
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
                  try { this.cdr.detectChanges(); } catch (e) { }
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
        this.setCampaignFromRaw(data);
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
    try { this.cdr.detectChanges(); } catch (e) { }
  }

  loadFavoriteStatus(id: number): void {
    try {
      const key = this.getFavoritesKey();
      let raw = localStorage.getItem(key);
      if (!raw) raw = localStorage.getItem('campaign_favorites');
      if (raw) {
        const favs = new Set<number>(JSON.parse(raw));
        this.isFavorite.set(favs.has(id));
      } else {
        this.isFavorite.set(false);
      }
    } catch { }
  }

  loadApplicationStatus(id: number): void {
    try {
      const key = this.getAppliedKey();
      let raw = localStorage.getItem(key);
      if (!raw) raw = localStorage.getItem('campaign_applied'); // legacy
      if (raw) {
        const applied = new Set<number>(JSON.parse(raw));
        this.hasApplied.set(applied.has(id));
      }
    } catch { }
  }

  toggleFavorite(): void {
    const c = this.campaign();
    if (!c || !c.id) return;

    try {
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

      try { localStorage.setItem(key, JSON.stringify(Array.from(favs))); } catch (e) { }
      try { localStorage.setItem('campaign_favorites', JSON.stringify(Array.from(favs))); } catch (e) { }
    } catch { }
  }

  private getFavoritesKey(): string {
    try {
      const token = this.auth.getToken ? this.auth.getToken() : null;
      if (!token) return 'campaign_favorites';
      const parts = token.split('.');
      if (parts.length < 2) return 'campaign_favorites';
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const id = payload.email || payload.sub || payload.username || payload.user || payload.name || payload.id;
      if (id) return `campaign_favorites_${String(id).toLowerCase().replace(/[^a-z0-9@.\-]/g, '_')}`;
    } catch (e) { /* ignore */ }
    return 'campaign_favorites';
  }

  private getAppliedKey(): string {
    try {
      return this.auth.getAppliedKeyForUser();
    } catch (e) {
      return 'campaign_applied';
    }
  }

  applyCampaign(): void {
    const c = this.campaign();
    if (!c || !c.id || this.hasApplied()) return;

    const status = this.getCampagneStatus();
    if (status === 'ended' || !c.active) return;

    if (!this.isLoggedIn) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Open modal
    this.showApplicationModal.set(true);
  }

  closeApplicationModal(): void {
    this.showApplicationModal.set(false);
    this.submitError.set('');
    this.submitSuccess.set('');
    this.submitting.set(false);
    this.currentStep.set(1);
    this.uploadedFiles.set({});
  }

  // Wizard Navigation
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

  // File handling
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

  validateApplication(): string | null {
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

    const campaign = this.campaign();
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
        this.submitSuccess.set('Votre candidature a été envoyée avec succès.');

        // Update local state
        this.hasApplied.set(true);

        // Save to localStorage
        try {
          const key = this.getAppliedKey();
          let raw = localStorage.getItem(key);
          const applied = new Set<number>(raw ? JSON.parse(raw) : []);
          applied.add(campaign.id!);
          localStorage.setItem(key, JSON.stringify(Array.from(applied)));
        } catch { }

        // Notify others
        this.applicationsService.notifyApplicationsUpdated();

        setTimeout(() => {
          this.closeApplicationModal();
        }, 2500);
      },
      error: (err) => {
        console.error('Submission failed:', err);
        this.submitting.set(false);
        this.submitError.set('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      }
    });
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
    return this.tx.t(`campaignsPage.status.${status}`);
  }

  getTypeLabel(type: string): string {
    return this.tx.t(`campaignsPage.typeLabels.${type}`) || type;
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
    try { e.target.style.visibility = 'hidden'; } catch { }
  }
}
