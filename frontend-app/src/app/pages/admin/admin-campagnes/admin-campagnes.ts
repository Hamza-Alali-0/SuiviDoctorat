import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminNavbarComponent } from '../../../components/navbar/admin-navbar';
import { CampagnesService, CampagnePayload } from '../../../services/campagnes.service';

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
  
  // Spécifique INSCRIPTION
  etablissement?: string;
  ecoleDoctorale?: string;
  logoEcole?: string;
  photoCouverture?: string;
  piecesObligatoires?: string[];
  reglesEligibilite?: string;
  
  // Spécifique RÉINSCRIPTION
  anneeConcernee?: string;
  documentsARenouveler?: string[];
  derogationTroisiemeAnnee?: boolean;
  messageInformatif?: string;
  
  // Spécifique SOUTENANCE
  checklistObligatoire?: ChecklistItem[];
  documentsObligatoires?: string[];
  modeleAutorisation?: string;
  
  // Notifications
  emailOuverture?: string;
  emailRappel?: string;
  emailFermeture?: string;
  
  nombreDossiers?: number;
}

interface ChecklistItem {
  id?: number;
  label: string;
  obligatoire: boolean;
}

interface CampagneStats {
  total: number;
  active: number;
  terminee: number;
  aVenir: number;
  totalDossiers: number;
}

@Component({
  selector: 'admin-campagnes',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './admin-campagnes.html',
  styles: [`
    .wrap { max-width:1400px; margin:1.25rem auto; padding:1rem; }
    .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; background:var(--gradient-primary); padding:1.5rem 2rem; border-radius:var(--radius-lg); color:#fff; box-shadow:0 6px 24px rgba(0,0,0,0.25); }
    .header h1 { margin:0; font-size:1.75rem; font-weight:600; }
    .header-subtitle { font-size:0.9rem; opacity:0.85; color:#000; }
    .header h1 { margin:0; font-size:1.75rem; font-weight:600; color:#000; }
    .header-actions { display:flex; gap:0.5rem; }

    /* Stats */
    .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:0.75rem; margin-bottom:1.5rem; }
    .stat-card { background:var(--color-surface); padding:0.9rem 1.1rem; border:1px solid var(--color-border); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); transition:var(--transition-fast); }
    .stat-card:hover { box-shadow:var(--shadow-md); }
    .stat-card.blue { border-top:3px solid #3b82f6; }
    .stat-card.green { border-top:3px solid #10b981; }
    .stat-card.purple { border-top:3px solid #8b5cf6; }
    .stat-card.orange { border-top:3px solid #f59e0b; }
    .stat-card.red { border-top:3px solid #ef4444; }
    .stat-label { font-size:0.6rem; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:var(--color-muted); margin-bottom:0.2rem; }
    .stat-value { font-size:1.25rem; font-weight:700; color:var(--color-text); }

    /* Buttons */
    .btn { padding:0.55rem 1rem; border-radius:8px; border:0; cursor:pointer; font-size:0.85rem; font-weight:600; transition:var(--transition-fast); display:inline-flex; align-items:center; gap:0.4rem; }
    .btn.primary { background:var(--gradient-primary); color:#fff; }
    .btn.white { background:#fff; color:var(--color-primary); border:1px solid var(--color-border); }
    .btn.success { background:#10b981; color:#fff; }
    .btn.danger { background:#ef4444; color:#fff; }
    .btn.outline { background:transparent; border:1px solid var(--color-border); color:var(--color-text); }
    .btn.sm { padding:0.35rem 0.7rem; font-size:0.7rem; }
    .btn:hover:not(:disabled) { filter:brightness(1.05); }
    .btn:disabled { opacity:0.5; cursor:not-allowed; }

    /* Toolbar */
    .toolbar { display:flex; gap:0.75rem; margin-bottom:1.25rem; align-items:center; flex-wrap:wrap; }
    .search-box { flex:1; min-width:240px; }
    .search-input { width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border); font-size:0.85rem; }

    /* Cards */
    .campagnes-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:1rem; }
    .campagne-card { background:#fff; border:1px solid var(--color-border); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); overflow:hidden; transition:var(--transition-fast); }
    .campagne-card:hover { box-shadow:var(--shadow-md); }
    .campagne-banner { position:relative; width:100%; height:160px; background:var(--gradient-primary); }
    .campagne-banner img { width:100%; height:100%; object-fit:cover; }
    .campagne-logo-overlay { position:absolute; bottom:-28px; left:1.25rem; width:70px; height:70px; background:#fff; border-radius:12px; padding:0.4rem; box-shadow:0 4px 12px rgba(0,0,0,0.15); border:3px solid #fff; }
    .campagne-logo-overlay img, .campagne-logo-small img { width:100%; height:100%; object-fit:contain; }
    .campagne-logo-small { width:50px; height:50px; background:#fff; border-radius:10px; padding:0.4rem; box-shadow:0 2px 6px rgba(0,0,0,0.1); border:2px solid #f3f4f6; }
    .campagne-content { padding:1.25rem; }
    .campagne-banner + .campagne-content { padding-top:2.5rem; }
    .campagne-header-row { display:flex; align-items:flex-start; gap:0.75rem; margin-bottom:0.75rem; }
    .campagne-title { font-size:1.05rem; font-weight:700; color:var(--color-text); margin:0 0 0.4rem; }
    .campagne-type { display:inline-block; padding:0.25rem 0.65rem; border-radius:999px; font-size:0.6rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
    .type-inscription { background:#dbeafe; color:#1e40af; }
    .type-reinscription { background:#fef3c7; color:#92400e; }
    .type-soutenance { background:#ede9fe; color:#5b21b6; }
    .campagne-badge { padding:0.3rem 0.6rem; border-radius:999px; font-size:0.55rem; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
    .badge-active { background:#10b981; color:#fff; }
    .badge-inactive { background:#ef4444; color:#fff; }
    .badge-upcoming { background:#f59e0b; color:#fff; }
    .badge-ended { background:#6b7280; color:#fff; }
    .campagne-info { font-size:0.75rem; color:var(--color-muted); margin-bottom:0.75rem; }
    .info-row { margin-bottom:0.35rem; display:flex; align-items:center; gap:0.4rem; }
    .campagne-actions { display:flex; gap:0.4rem; justify-content:flex-end; padding-top:0.75rem; border-top:1px solid #f3f4f6; }

    /* Modal */
    .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal-card { width:90%; max-width:900px; max-height:88vh; background:#fff; border-radius:var(--radius-lg); box-shadow:0 20px 40px rgba(0,0,0,0.25); padding:1.75rem; overflow-y:auto; }
    .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--color-border); }
    .modal-title { font-size:1.25rem; font-weight:600; color:var(--color-text); margin:0; }
    .close-btn { background:#f3f4f6; border:none; padding:0.4rem 0.8rem; border-radius:6px; cursor:pointer; font-size:0.75rem; }
    .close-btn:hover { background:#e5e7eb; }

    /* Form */
    .form-section { margin-bottom:1.5rem; padding:1.1rem 1.1rem; background:#f9fafb; border-radius:12px; border:1px solid #e5e7eb; }
    .section-title { font-size:0.9rem; font-weight:600; color:var(--color-text); margin:0 0 0.7rem; }
    .form-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
    .form-grid.full { grid-template-columns:1fr; }
    .form-label { display:block; margin-bottom:0.4rem; font-weight:600; color:#374151; font-size:0.7rem; letter-spacing:0.3px; }
    .form-input, .form-select, .form-textarea { width:100%; padding:0.55rem 0.75rem; border-radius:6px; border:1px solid var(--color-border); font-size:0.75rem; box-sizing:border-box; background:#fff; }
    .form-input:focus, .form-select:focus, .form-textarea:focus { outline:none; border-color:var(--color-primary); box-shadow:0 0 0 3px rgba(102,126,234,0.2); }
    .form-textarea { min-height:90px; resize:vertical; }
    .char-counter { text-align:right; font-size:0.6rem; color:#9ca3af; margin-top:0.2rem; }
    .form-checkbox-list { display:grid; grid-template-columns:repeat(2,1fr); gap:0.5rem; }
    .checkbox-item { display:flex; align-items:center; gap:0.4rem; padding:0.4rem; border-radius:6px; cursor:pointer; }
    .checkbox-item:hover { background:#f3f4f6; }
    .checkbox-item input { width:16px; height:16px; accent-color:var(--color-primary); }
    .checkbox-item label { font-size:0.7rem; color:#374151; }

    /* Checklist */
    .checklist-builder { border:1px solid #e5e7eb; border-radius:8px; padding:0.75rem; background:#fff; }
    .checklist-item { display:flex; gap:0.6rem; align-items:center; margin-bottom:0.5rem; padding:0.5rem; background:#f9fafb; border-radius:6px; }
    .remove-btn { background:#fee2e2; color:#dc2626; border:none; padding:0.35rem 0.6rem; border-radius:6px; font-size:0.65rem; cursor:pointer; }
    .remove-btn:hover { background:#fecaca; }
    .add-btn { background:var(--color-primary); color:#fff; border:none; padding:0.4rem 0.7rem; border-radius:6px; font-size:0.65rem; font-weight:600; cursor:pointer; }
    .add-btn:hover { filter:brightness(1.05); }

    /* Upload */
    .file-upload { border:2px dashed #e5e7eb; border-radius:8px; padding:1rem; text-align:center; background:#fafafa; cursor:pointer; }
    .file-upload:hover { border-color:var(--color-primary); background:#f5f3ff; }
    .file-upload input { display:none; }
    .file-upload-text { font-size:0.6rem; color:var(--color-muted); }
    .file-preview { margin-top:0.6rem; padding:0.5rem; background:#f3f4f6; border-radius:6px; font-size:0.65rem; display:flex; align-items:center; gap:0.4rem; }
    .preview-image-small { width:50px; height:50px; object-fit:contain; border-radius:6px; background:#fff; padding:0.2rem; border:1px solid #e5e7eb; }
    .preview-image-banner { width:100%; max-height:110px; object-fit:cover; border-radius:6px; border:1px solid #e5e7eb; }

    /* Templates */
    .template-editor { border:1px solid #e5e7eb; border-radius:8px; padding:0.75rem; background:#fff; }
    .template-header { margin-bottom:0.5rem; padding-bottom:0.4rem; border-bottom:1px solid #e5e7eb; }
    .template-title { font-weight:600; color:#374151; font-size:0.75rem; }

    /* Modal Actions */
    .modal-actions { display:flex; gap:0.5rem; justify-content:flex-end; margin-top:1.25rem; padding-top:1rem; border-top:1px solid #f3f4f6; }

    /* Messages */
    .error-message { background:#fee2e2; color:#991b1b; padding:0.6rem 0.8rem; border-radius:8px; font-size:0.7rem; margin-bottom:1rem; border:1px solid #fca5a5; }
    .success-message { background:#d1fae5; color:#065f46; padding:0.6rem 0.8rem; border-radius:8px; font-size:0.7rem; margin-bottom:1rem; border:1px solid #6ee7b7; }

    /* Empty */
    .empty-state { text-align:center; padding:3rem 1.5rem; }
    .empty-icon { font-size:3rem; margin-bottom:0.75rem; opacity:0.15; }
    .empty-title { font-size:1.1rem; font-weight:600; color:#374151; margin:0 0 0.4rem; }
    .empty-message { color:#6b7280; font-size:0.75rem; margin-bottom:1rem; }
  `]
})
export class AdminCampagnesComponent implements OnInit {
  campagnes = signal<Campagne[]>([]);
  filteredCampagnes = signal<Campagne[]>([]);
  stats = signal<CampagneStats>({ total: 0, active: 0, terminee: 0, aVenir: 0, totalDossiers: 0 });
  
  showModal = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  editingCampagne = signal<Campagne | null>(null);
  
  viewMode = signal<'grid' | 'list'>('grid');
  filterStatus = signal<'all' | 'active' | 'upcoming' | 'ended' | 'inactive'>('all');
  searchQuery = signal('');
  activeMenuId = signal<number | null>(null);
  
  currentStep = signal(1);
  totalSteps = 4;
  
  campagneForm: any = {
    nom: '',
    type: 'INSCRIPTION',
    anneeUniversitaire: '2025/2026',
    description: '',
    dateOuverture: '',
    dateFermeture: '',
    active: true,
    visibilite: 'PUBLIC',
    etablissement: '',
    ecoleDoctorale: '',
    logoEcole: '',
    photoCouverture: '',
    piecesObligatoires: [] as string[],
    reglesEligibilite: '',

    // RÉINSCRIPTION
    anneeConcernee: '',
    documentsARenouveler: [] as string[],
    derogationTroisiemeAnnee: false,
    messageInformatif: '',

    // SOUTENANCE
    checklistObligatoire: [] as ChecklistItem[],
    documentsObligatoires: [] as string[],
    modeleAutorisation: '',

    // Notifications
    emailOuverture: '',
    emailRappel: '',
    emailFermeture: ''
  };
  
  // Listes prédéfinies
  ecolesDoctoraLes = [
    'École Doctorale Sciences et Technologies',
    'École Doctorale Sciences Juridiques et Économiques',
    'École Doctorale Sciences Humaines et Sociales',
    'École Doctorale Sciences de la Santé'
  ];
  
  piecesDisponibles = [
    'Copie diplôme Master',
    'Relevés de notes Master',
    'CV actualisé',
    'Lettre de motivation',
    'Projet de recherche',
    'Lettres de recommandation (2)',
    'Copie CIN',
    'Photo d\'identité',
    'Attestation d\'inscription'
  ];
  
  checklistSoutenanceDefaut: ChecklistItem[] = [
    { label: '2 articles publiés en Q1/Q2', obligatoire: true },
    { label: '2 participations à des conférences internationales', obligatoire: true },
    { label: '200 heures de formation validées', obligatoire: true },
    { label: 'Rapport anti-plagiat (<15%)', obligatoire: true },
    { label: 'Validation du directeur de thèse', obligatoire: true }
  ];
  
  constructor(private http: HttpClient, private campagnesService: CampagnesService) {}
  
  ngOnInit() {
    this.loadCampagnes();
  }
  
  loadCampagnes() {
    this.campagnesService.getAll().subscribe({
      next: (data: any) => {
        // Backend retourne CampagneInscription basique; enrichissement simple
        const mapped: Campagne[] = data.map((c: any) => ({
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
        this.campagnes.set(mapped);
        this.calculateStats();
        this.applyFilters();
      },
      error: () => {
        this.errorMessage.set('Erreur lors du chargement des campagnes');
      }
    });
  }
  
  calculateStats() {
    const campagnes = this.campagnes();
    const now = new Date();
    
    const stats: CampagneStats = {
      total: campagnes.length,
      active: 0,
      terminee: 0,
      aVenir: 0,
      totalDossiers: 0
    };
    
    campagnes.forEach(c => {
      const ouverture = new Date(c.dateOuverture);
      const fermeture = new Date(c.dateFermeture);
      
      if (c.active && now >= ouverture && now <= fermeture) stats.active++;
      else if (now > fermeture) stats.terminee++;
      else if (now < ouverture) stats.aVenir++;
      
      stats.totalDossiers += c.nombreDossiers || 0;
    });
    
    this.stats.set(stats);
  }
  
  applyFilters() {
    let filtered = this.campagnes();
    const query = this.searchQuery().toLowerCase();
    const filter = this.filterStatus();
    
    if (query) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query)
      );
    }
    
    if (filter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(c => {
        const ouverture = new Date(c.dateOuverture);
        const fermeture = new Date(c.dateFermeture);
        
        if (filter === 'active') return c.active && now >= ouverture && now <= fermeture;
        if (filter === 'upcoming') return now < ouverture;
        if (filter === 'ended') return now > fermeture;
        if (filter === 'inactive') return !c.active;
        return true;
      });
    }
    
    this.filteredCampagnes.set(filtered);
  }
  
  setFilter(filter: 'all' | 'active' | 'upcoming' | 'ended' | 'inactive') {
    this.filterStatus.set(filter);
    this.applyFilters();
  }
  
  onSearch(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilters();
  }
  
  toggleViewMode() {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }
  
  openModal(campagne?: Campagne) {
    this.editingCampagne.set(campagne || null);
    this.currentStep.set(1);
    
    if (campagne) {
      this.campagneForm = {
        nom: campagne.nom,
        type: campagne.type,
        anneeUniversitaire: campagne.anneeUniversitaire,
        description: campagne.description,
        dateOuverture: campagne.dateOuverture,
        dateFermeture: campagne.dateFermeture,
        active: campagne.active,
        visibilite: campagne.visibilite,
        etablissement: campagne.etablissement || '',
        ecoleDoctorale: campagne.ecoleDoctorale || '',
        logoEcole: campagne.logoEcole || '',
        photoCouverture: campagne.photoCouverture || '',
        piecesObligatoires: campagne.piecesObligatoires || [],
        reglesEligibilite: campagne.reglesEligibilite || '',
        anneeConcernee: campagne.anneeConcernee || '',
        documentsARenouveler: campagne.documentsARenouveler || [],
        derogationTroisiemeAnnee: campagne.derogationTroisiemeAnnee || false,
        messageInformatif: campagne.messageInformatif || '',
        checklistObligatoire: campagne.checklistObligatoire || [...this.checklistSoutenanceDefaut],
        documentsObligatoires: campagne.documentsObligatoires || [],
        modeleAutorisation: campagne.modeleAutorisation || '',
        emailOuverture: campagne.emailOuverture || '',
        emailRappel: campagne.emailRappel || '',
        emailFermeture: campagne.emailFermeture || ''
      };
    } else {
      this.resetForm();
    }
    
    this.showModal.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }
  
  closeModal() {
    this.showModal.set(false);
    this.editingCampagne.set(null);
    this.currentStep.set(1);
    this.resetForm();
  }
  
  resetForm() {
    this.campagneForm = {
      nom: '',
      type: 'INSCRIPTION',
      anneeUniversitaire: '2025/2026',
      description: '',
      dateOuverture: '',
      dateFermeture: '',
      active: true,
      visibilite: 'PUBLIC',
      etablissement: '',
      ecoleDoctorale: '',
      logoEcole: '',
      photoCouverture: '',
      piecesObligatoires: [],
      reglesEligibilite: '',
      anneeConcernee: '',
      documentsARenouveler: [],
      derogationTroisiemeAnnee: false,
      messageInformatif: '',
      checklistObligatoire: [...this.checklistSoutenanceDefaut],
      documentsObligatoires: [],
      modeleAutorisation: '',
      emailOuverture: '',
      emailRappel: '',
      emailFermeture: ''
    };
  }
  
  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }
  
  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }
  
  saveCampagne() {
    // Validation de base
    if (!this.campagneForm.nom.trim()) {
      this.errorMessage.set('Le nom de la campagne est obligatoire');
      return;
    }
    
    if (!this.campagneForm.anneeUniversitaire.trim()) {
      this.errorMessage.set('L\'année universitaire est obligatoire');
      return;
    }
    
    if (!this.campagneForm.dateOuverture || !this.campagneForm.dateFermeture) {
      this.errorMessage.set('Les dates d\'ouverture et de fermeture sont obligatoires');
      return;
    }
    
    // Validation selon le type
    if (this.campagneForm.type === 'INSCRIPTION') {
      if (!this.campagneForm.etablissement?.trim()) {
        this.errorMessage.set('L\'établissement est obligatoire pour une campagne d\'inscription');
        return;
      }
      if (!this.campagneForm.ecoleDoctorale) {
        this.errorMessage.set('L\'école doctorale est obligatoire pour une campagne d\'inscription');
        return;
      }
    }
    
    if (this.campagneForm.type === 'REINSCRIPTION') {
      if (!this.campagneForm.anneeConcernee?.trim()) {
        this.errorMessage.set('L\'année concernée est obligatoire pour une campagne de réinscription');
        return;
      }
    }
    
    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload: CampagnePayload = { ...this.campagneForm };

    const obs = this.editingCampagne()?.id
      ? this.campagnesService.update(this.editingCampagne()!.id!, payload)
      : this.campagnesService.create(payload);

    obs.subscribe({
      next: (saved: any) => {
        const campagnes = this.campagnes();
        const mapped: Campagne = {
          ...saved,
          type: (saved.type as any) || this.campagneForm.type,
          visibilite: (saved.visibilite as any) || this.campagneForm.visibilite,
          checklistObligatoire: saved.checklistObligatoire || this.campagneForm.checklistObligatoire || [],
          piecesObligatoires: saved.piecesObligatoires || this.campagneForm.piecesObligatoires || [],
          documentsARenouveler: saved.documentsARenouveler || this.campagneForm.documentsARenouveler || [],
          documentsObligatoires: saved.documentsObligatoires || this.campagneForm.documentsObligatoires || [],
          nombreDossiers: saved.nombreDossiers || 0
        } as Campagne;

        if (this.editingCampagne()) {
          const index = campagnes.findIndex(c => c.id === this.editingCampagne()?.id);
          campagnes[index] = mapped;
        } else {
          campagnes.push(mapped);
        }

        this.campagnes.set([...campagnes]);
        this.closeModal();
        this.calculateStats();
        this.applyFilters();
        this.successMessage.set('Campagne enregistrée avec succès');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err: any) => {
        console.error('[AdminCampagnes] save error', err);
        const backendMsg = (err?.error && typeof err.error === 'string') ? err.error : (err?.error?.message || err?.message);
        this.errorMessage.set(backendMsg || 'Erreur lors de la sauvegarde');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
  
  deleteCampagne(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) return;
    this.campagnesService.delete(id).subscribe({
      next: () => {
        const campagnes = this.campagnes().filter(c => c.id !== id);
        this.campagnes.set(campagnes);
        this.calculateStats();
        this.applyFilters();
      },
      error: () => this.errorMessage.set('Erreur lors de la suppression')
    });
  }
  
  duplicateCampagne(campagne: Campagne) {
    const copy: CampagnePayload = { ...campagne, nom: `${campagne.nom} (Copie)`, active: false, id: undefined };
    this.campagnesService.create(copy).subscribe({
      next: (saved: any) => {
        this.campagnes.set([...this.campagnes(), { ...saved } as Campagne]);
        this.calculateStats();
        this.applyFilters();
      },
      error: () => this.errorMessage.set('Erreur lors de la duplication')
    });
  }
  
  // Gestion des pièces et documents
  togglePiece(piece: string) {
    const pieces = this.campagneForm.piecesObligatoires;
    const index = pieces.indexOf(piece);
    if (index > -1) {
      pieces.splice(index, 1);
    } else {
      pieces.push(piece);
    }
  }
  
  isPieceSelected(piece: string): boolean {
    return this.campagneForm.piecesObligatoires.includes(piece);
  }
  
  toggleDocument(doc: string, type: 'renouveler' | 'obligatoire') {
    const docs = type === 'renouveler' 
      ? this.campagneForm.documentsARenouveler 
      : this.campagneForm.documentsObligatoires;
    const index = docs.indexOf(doc);
    if (index > -1) {
      docs.splice(index, 1);
    } else {
      docs.push(doc);
    }
  }
  
  isDocumentSelected(doc: string, type: 'renouveler' | 'obligatoire'): boolean {
    const docs = type === 'renouveler' 
      ? this.campagneForm.documentsARenouveler 
      : this.campagneForm.documentsObligatoires;
    return docs.includes(doc);
  }
  
  addChecklistItem() {
    this.campagneForm.checklistObligatoire.push({
      label: '',
      obligatoire: true
    });
  }
  
  removeChecklistItem(index: number) {
    this.campagneForm.checklistObligatoire.splice(index, 1);
  }
  
  onFileSelect(event: any, field: 'logoEcole' | 'photoCouverture' | 'modeleAutorisation') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (field === 'logoEcole') {
          this.campagneForm.logoEcole = e.target.result;
        } else if (field === 'photoCouverture') {
          this.campagneForm.photoCouverture = e.target.result;
        } else {
          this.campagneForm.modeleAutorisation = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  getCampagneStatusKey(campagne: Campagne): string {
    const now = new Date();
    const ouverture = new Date(campagne.dateOuverture);
    const fermeture = new Date(campagne.dateFermeture);
    
    if (!campagne.active) return 'inactive';
    if (now < ouverture) return 'upcoming';
    if (now > fermeture) return 'ended';
    return 'active';
  }
  
  getCampagneBadgeClass(campagne: Campagne): string {
    return `badge-${this.getCampagneStatusKey(campagne)}`;
  }
  
  getCampagneStatusLabel(campagne: Campagne): string {
    const key = this.getCampagneStatusKey(campagne);
    const labels = {
      active: 'En cours',
      inactive: 'Inactive',
      upcoming: 'À venir',
      ended: 'Terminée'
    };
    return labels[key as keyof typeof labels];
  }
  
  getTypeLabel(type: string): string {
    const labels = {
      INSCRIPTION: 'Inscription',
      REINSCRIPTION: 'Réinscription',
      SOUTENANCE: 'Soutenance'
    };
    return labels[type as keyof typeof labels] || type;
  }
  
  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
  
  getDaysRemaining(dateFermeture: string): number {
    const now = new Date();
    const fermeture = new Date(dateFermeture);
    const diff = fermeture.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
  
  getDaysUntilStart(dateOuverture: string): number {
    const now = new Date();
    const ouverture = new Date(dateOuverture);
    const diff = ouverture.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}
