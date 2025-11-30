import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EncadrantNavbarComponent } from '../../components/navbar/encadrant-navbar';
import { CandidatNavbarComponent } from '../../components/navbar/candidat-navbar';

interface DemandeSoutenance {
  id: number;
  doctorantEmail: string;
  directeurEmail: string;
  titreThese: string;
  resume: string;
  statut: string;
  dateCreation: string;
  dateSoumission?: string;
  dateSoutenance?: string;
  dateAutorisation?: string;
  lieuSoutenance?: string;
  commentairesAdmin?: string;
  raisonRejet?: string;
}

interface Prerequis {
  id: number;
  nombrePublications: number;
  nombrePublicationsRequises: number;
  publicationsValides: boolean;
  creditsFormation: number;
  creditsFormationRequis: number;
  creditsValides: boolean;
  demandeManuscrite: boolean;
  rapportThese: boolean;
  rapportAntiPlagiat: boolean;
  rapportPublications: boolean;
  attestationsFormation: boolean;
  autorisationSoutenance: boolean;
  prerequisValides: boolean;
  valideParAdmin?: string;
  dateValidation?: string;
  commentaires?: string;
}

interface MembreJury {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  grade?: string;
  etablissement?: string;
  avisRendu?: boolean;
  avisFavorable?: boolean;
}

@Component({
  selector: 'app-soutenance-premium',
  standalone: true,
  imports: [CommonModule, FormsModule, EncadrantNavbarComponent, CandidatNavbarComponent],
  templateUrl: './soutenance-premium.html',
  styleUrls: ['./soutenance-premium.scss']
})
export class SoutenancePremiumPage implements OnInit {
  currentView = signal<'list' | 'create' | 'detail'>('list');
  demandes = signal<DemandeSoutenance[]>([]);
  selectedDemande = signal<DemandeSoutenance | null>(null);
  loading = signal(false);
  userEmail = signal('');
  userName = signal('');
  userRole = signal<string>('');

  newDemande = {
    titre: '',
    resume: '',
    specialite: '',
    directeurEmail: '',
    coDirecteurEmail: ''
  };

  prerequis = signal<Prerequis | null>(null);
  juryMembers = signal<MembreJury[]>([]);
  showJuryForm = signal(false);
  
  // Modal/Popup state
  showModal = signal(false);
  modalTitle = signal('');
  modalMessage = signal('');
  modalType = signal<'confirm' | 'success' | 'error' | 'info'>('info');
  modalCallback: (() => void) | null = null;
  
  // Status management for encadrant
  newStatus: string = '';
  statusComment: string = '';
  showStatusComment = signal(false);
  
  newMember = {
    nom: '',
    prenom: '',
    email: '',
    role: 'EXAMINATEUR',
    grade: '',
    etablissement: ''
  };

  // Filter controls (plain properties so they bind easily with ngModel)
  filterQuery: string = '';
  filterStatus: string = '';
  sortBy: 'newest' | 'oldest' | 'title' = 'newest';
  dateFrom: string = '';
  dateTo: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (user: any) => {
        if (user) {
          this.userEmail.set(user.email || '');
          this.userName.set(`${user.firstName} ${user.lastName}`);
          // Extract role from roles array or use localStorage
          let role = 'candidat';
          
          console.log('[SoutenancePremium] User profile received:', user);
          console.log('[SoutenancePremium] User roles:', user.roles);
          
          if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
            // Backend returns roles in uppercase (e.g., "ENCADRANT", "CANDIDAT")
            const firstRole = user.roles[0];
            role = (typeof firstRole === 'string' ? firstRole : String(firstRole)).toLowerCase();
            // Remove "role_" prefix if present
            role = role.replace(/^role_/, '');
            console.log('[SoutenancePremium] Role from user.roles:', role);
          } else if (user.role) {
            role = user.role.toLowerCase();
            // Remove "role_" prefix if present
            role = role.replace(/^role_/, '');
            console.log('[SoutenancePremium] Role from user.role:', role);
          } else {
            // Fallback to localStorage
            const storedRole = localStorage.getItem('auth_role');
            role = storedRole?.toLowerCase().replace(/^role_/, '') || 'candidat';
            console.log('[SoutenancePremium] Role from localStorage:', role);
          }
          
          this.userRole.set(role);
          console.log('[SoutenancePremium] Final role set:', this.userRole());
          console.log('[SoutenancePremium] User profile loaded:', { 
            email: this.userEmail(), 
            name: this.userName(), 
            role: this.userRole() 
          });
          
          // Load demandes after profile is loaded
          this.route.queryParams.subscribe(params => {
            if (params['id'] && params['view'] === 'detail') {
              this.loadDemandeDetail(params['id']);
            } else {
              this.loadDemandes();
            }
          });
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }

  loadDemandes() {
    this.loading.set(true);
    const email = this.userEmail();
    const role = this.userRole();
    
    console.log('[SoutenancePremium] ========================================');
    console.log('[SoutenancePremium] loadDemandes called');
    console.log('[SoutenancePremium] Current email:', email);
    console.log('[SoutenancePremium] Current role:', role);
    console.log('[SoutenancePremium] ========================================');
    
    if (!email) {
      console.error('[SoutenancePremium] Cannot load demandes: user email not available');
      this.loading.set(false);
      return;
    }
    
    console.log('[SoutenancePremium] Making HTTP GET request to: http://localhost:8096/api/soutenance/demandes');
    
    // Encadrant voit toutes les demandes, Candidat voit seulement ses demandes
    this.http.get<DemandeSoutenance[]>(`http://localhost:8096/api/soutenance/demandes`).subscribe({
      next: (data) => {
        console.log('[SoutenancePremium] ========================================');
        console.log('[SoutenancePremium] ✅ HTTP Response received!');
        console.log('[SoutenancePremium] All demandes loaded from backend:', data);
        console.log('[SoutenancePremium] Total count:', data.length);
        console.log('[SoutenancePremium] Filtering with role:', role);
        console.log('[SoutenancePremium] ========================================');
        
        let filteredDemandes: DemandeSoutenance[];
        
        if (role === 'encadrant') {
          // Encadrant voit toutes les demandes
          filteredDemandes = data;
          console.log('[SoutenancePremium] 👨‍🏫 ENCADRANT - showing all demandes:', filteredDemandes.length);
        } else {
          // Candidat voit seulement ses propres demandes (où il est doctorant)
          console.log('[SoutenancePremium] 👨‍🎓 CANDIDAT mode - filtering by email:', email);
          filteredDemandes = data.filter(d => {
            const match = d.doctorantEmail === email;
            console.log(`  - Demande ID ${d.id}: doctorantEmail="${d.doctorantEmail}" === "${email}" ? ${match}`);
            return match;
          });
          console.log('[SoutenancePremium] CANDIDAT - filtered demandes for', email, ':', filteredDemandes.length);
          console.log('[SoutenancePremium] Filtered demandes:', filteredDemandes);
        }
        
        console.log('[SoutenancePremium] Setting demandes signal with', filteredDemandes.length, 'items');
        this.demandes.set(filteredDemandes);
        this.loading.set(false);
        console.log('[SoutenancePremium] ========================================');
      },
      error: (err) => {
        console.error('[SoutenancePremium] ========================================');
        console.error('[SoutenancePremium] ❌ HTTP Error!');
        console.error('[SoutenancePremium] Error loading demandes:', err);
        console.error('[SoutenancePremium] Error status:', err.status);
        console.error('[SoutenancePremium] Error details:', err.error);
        console.error('[SoutenancePremium] ========================================');
        this.loading.set(false);
      }
    });
  }

  loadDemandeDetail(id: number) {
    this.loading.set(true);
    this.http.get<DemandeSoutenance>(`http://localhost:8096/api/soutenance/demandes/${id}`).subscribe({
      next: (data) => {
        this.selectedDemande.set(data);
        this.currentView.set('detail');
        this.loadPrerequisAndJury(id);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading demande:', err);
        this.loading.set(false);
      }
    });
  }

  loadPrerequisAndJury(demandeId: number) {
    console.log('Loading prerequis and jury for demande:', demandeId);
    
    this.http.get<Prerequis>(`http://localhost:8096/api/soutenance/demandes/${demandeId}/prerequis`).subscribe({
      next: (data) => {
        console.log('Prerequis loaded:', data);
        this.prerequis.set(data);
      },
      error: (err) => {
        console.error('Error loading prerequis:', err);
        console.error('Error details:', err.error);
        this.prerequis.set(null);
      }
    });

    this.http.get<MembreJury[]>(`http://localhost:8096/api/soutenance/demandes/${demandeId}/jury`).subscribe({
      next: (data) => {
        console.log('Jury members loaded:', data);
        console.log('Jury count:', data.length);
        this.juryMembers.set(data);
      },
      error: (err) => {
        console.error('Error loading jury:', err);
        console.error('Error details:', err.error);
        this.juryMembers.set([]);
      }
    });
  }

  createDemande() {
    // Validate required fields
    if (!this.newDemande.titre || !this.newDemande.resume) {
      alert('Veuillez remplir tous les champs obligatoires (titre, résumé)');
      return;
    }

    if (!this.userEmail()) {
      alert('Erreur: Email utilisateur non disponible. Veuillez vous reconnecter.');
      return;
    }

    // Map frontend fields to backend DTO structure
    // Use "non-defini" as default director email if not provided
    const payload = {
      doctorantEmail: this.userEmail(),
      directeurEmail: this.newDemande.directeurEmail || 'non-defini@systeme.fr',
      titreThese: this.newDemande.titre,
      resume: this.newDemande.resume
    };

    console.log('[SoutenancePremium] Creating demande with payload:', payload);
    console.log('[SoutenancePremium] Sending POST to: http://localhost:8096/api/soutenance/demandes');

    this.http.post('http://localhost:8096/api/soutenance/demandes', payload).subscribe({
      next: (response: any) => {
        console.log('[SoutenancePremium] ✅ Demande created successfully!');
        console.log('[SoutenancePremium] Response from backend:', response);
        console.log('[SoutenancePremium] Created demande ID:', response?.id);
        console.log('[SoutenancePremium] Created demande statut:', response?.statut);
        
        alert('Demande créée avec succès! ID: ' + (response?.id || 'N/A'));
        
        this.currentView.set('list');
        
        // Reload demandes from server
        console.log('[SoutenancePremium] Reloading demandes from server...');
        this.loadDemandes();
        
        this.resetForm();
      },
      error: (err) => {
        console.error('[SoutenancePremium] ❌ Error creating demande:', err);
        console.error('[SoutenancePremium] Error status:', err.status);
        console.error('[SoutenancePremium] Error details:', err.error);
        console.error('[SoutenancePremium] Full error object:', JSON.stringify(err, null, 2));
        alert('Erreur lors de la création de la demande: ' + (err.error?.error || err.error?.message || err.message));
      }
    });
  }

  addJuryMember() {
    const demandeId = this.selectedDemande()?.id;
    if (!demandeId) {
      alert('Erreur: Aucune demande sélectionnée');
      return;
    }

    // Validate required fields
    if (!this.newMember.nom || !this.newMember.prenom || !this.newMember.email) {
      alert('Veuillez remplir tous les champs obligatoires (nom, prénom, email)');
      return;
    }

    console.log('Adding jury member to demande:', demandeId);
    console.log('Member data:', this.newMember);

    this.http.post(`http://localhost:8096/api/soutenance/demandes/${demandeId}/jury`, this.newMember).subscribe({
      next: (response) => {
        console.log('Jury member added successfully:', response);
        alert('Membre du jury ajouté avec succès!');
        this.loadPrerequisAndJury(demandeId);
        this.showJuryForm.set(false);
        this.resetJuryForm();
      },
      error: (err) => {
        console.error('Error adding jury member:', err);
        console.error('Error details:', err.error);
        alert('Erreur lors de l\'ajout du membre: ' + (err.error?.error || err.message));
      }
    });
  }

  resetForm() {
    this.newDemande = { titre: '', resume: '', specialite: '', directeurEmail: '', coDirecteurEmail: '' };
  }

  resetJuryForm() {
    this.newMember = { nom: '', prenom: '', email: '', role: 'EXAMINATEUR', grade: '', etablissement: '' };
  }

  viewDetail(demande: DemandeSoutenance) {
    this.selectedDemande.set(demande);
    this.currentView.set('detail');
    this.loadPrerequisAndJury(demande.id);
  }
 
  // Return demandes filtered locally using the UI controls
  getFilteredDemandes(): DemandeSoutenance[] {
    const list = this.demandes();
    let res = list.slice();

    const q = this.filterQuery?.trim().toLowerCase();
    if (q) {
      res = res.filter(d => {
        const titre = (d.titreThese || '').toLowerCase();
        const doc = (d.doctorantEmail || '').toLowerCase();
        const dir = (d.directeurEmail || '').toLowerCase();
        return titre.includes(q) || doc.includes(q) || dir.includes(q);
      });
    }

    if (this.filterStatus) {
      res = res.filter(d => d.statut === this.filterStatus);
    }

    if (this.dateFrom) {
      const f = new Date(this.dateFrom);
      res = res.filter(d => new Date(d.dateCreation) >= f);
    }

    if (this.dateTo) {
      const t = new Date(this.dateTo);
      res = res.filter(d => new Date(d.dateCreation) <= t);
    }

    if (this.sortBy === 'newest') {
      res.sort((a,b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
    } else if (this.sortBy === 'oldest') {
      res.sort((a,b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
    } else if (this.sortBy === 'title') {
      res.sort((a,b) => (a.titreThese || '').localeCompare(b.titreThese || ''));
    }

    return res;
  }

  clearFilters() {
    this.filterQuery = '';
    this.filterStatus = '';
    this.sortBy = 'newest';
    this.dateFrom = '';
    this.dateTo = '';
  }
 

  getStatusLabel(statut: string): string {
    const labels: Record<string, string> = {
      'BROUILLON': 'Brouillon',
      'SOUMISE': 'Soumise',
      'EN_VERIFICATION': 'En Vérification',
      'PREREQUIS_VALIDES': 'Prérequis Validés',
      'EN_ATTENTE_JURY': 'En Attente Jury',
      'JURY_PROPOSE': 'Jury Proposé',
      'AUTORISEE': 'Autorisée',
      'PLANIFIEE': 'Planifiée',
      'TERMINEE': 'Terminée',
      'REJETEE': 'Rejetée'
    };
    return labels[statut] || statut;
  }

  getPrerequisProgress(): number {
    const prereq = this.prerequis();
    if (!prereq) return 0;
    
    // Count how many document fields are completed
    const documents = [
      prereq.demandeManuscrite,
      prereq.rapportThese,
      prereq.rapportAntiPlagiat,
      prereq.rapportPublications,
      prereq.attestationsFormation,
      prereq.autorisationSoutenance
    ];
    
    const completed = documents.filter(d => d === true).length;
    return Math.round((completed / documents.length) * 100);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Non définie';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Status management methods for encadrant
  onStatusChange(): void {
    if (this.newStatus && this.newStatus !== '') {
      this.showStatusComment.set(true);
    } else {
      this.showStatusComment.set(false);
      this.statusComment = '';
    }
  }

  cancelStatusChange(): void {
    this.newStatus = '';
    this.statusComment = '';
    this.showStatusComment.set(false);
  }

  updateDemandeStatus(): void {
    const demandeId = this.selectedDemande()?.id;
    if (!demandeId || !this.newStatus) {
      alert('Erreur: Demande ou statut non valide');
      return;
    }

    console.log('[SoutenancePremium] Updating demande status:', {
      demandeId,
      newStatus: this.newStatus,
      comment: this.statusComment
    });

    const payload: any = {
      statut: this.newStatus
    };

    if (this.statusComment) {
      payload.commentairesAdmin = this.statusComment;
    }

    this.http.patch(`http://localhost:8096/api/soutenance/demandes/${demandeId}/status`, payload).subscribe({
      next: (response) => {
        console.log('[SoutenancePremium] Status updated successfully:', response);
        alert('Statut mis à jour avec succès!');
        
        // Reload the demande detail to reflect changes
        this.loadDemandeDetail(demandeId);
        
        // Reset the form
        this.cancelStatusChange();
      },
      error: (err) => {
        console.error('[SoutenancePremium] Error updating status:', err);
        console.error('[SoutenancePremium] Error details:', err.error);
        alert('Erreur lors de la mise à jour du statut: ' + (err.error?.message || err.message));
      }
    });
  }

  // Download Autorisation de Soutenance PDF
  downloadAutorisationPdf(): void {
    const demandeId = this.selectedDemande()?.id;
    if (!demandeId) {
      alert('Erreur: Aucune demande sélectionnée');
      return;
    }

    console.log('[SoutenancePremium] Downloading PDF for demande:', demandeId);

    this.http.get(`http://localhost:8096/api/soutenance/demandes/${demandeId}/autorisation-pdf`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        console.log('[SoutenancePremium] PDF downloaded successfully');
        
        // Create a blob URL and trigger download
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Autorisation_Soutenance_${demandeId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        console.error('[SoutenancePremium] Error downloading PDF:', err);
        alert('Erreur lors du téléchargement du PDF: ' + (err.error?.error || err.message));
      }
    });
  }

  // Send Autorisation de Soutenance PDF by email to doctorant
  sendAutorisationPdfByEmail(): void {
    const demandeId = this.selectedDemande()?.id;
    const doctorantEmail = this.selectedDemande()?.doctorantEmail;
    
    if (!demandeId) {
      this.showErrorModal('Aucune demande sélectionnée');
      return;
    }

    if (!doctorantEmail) {
      this.showErrorModal('Email du doctorant non disponible');
      return;
    }

    this.showConfirmModal(
      'Envoyer l\'Autorisation de Soutenance',
      `Voulez-vous envoyer l'Autorisation de Soutenance (PDF) par email à <strong>${doctorantEmail}</strong> ?<br/><br/>
      <div style="text-align: left; margin-top: 15px;">
        <strong>Le PDF contient :</strong>
        <ul style="margin-top: 8px;">
          <li>La composition complète du jury</li>
          <li>Les informations de chaque membre</li>
          <li>L'autorisation officielle</li>
        </ul>
      </div>`,
      () => {
        console.log('[SoutenancePremium] Sending PDF by email for demande:', demandeId);

        this.http.post(`http://localhost:8096/api/soutenance/demandes/${demandeId}/send-autorisation-pdf`, {}).subscribe({
          next: (response: any) => {
            console.log('[SoutenancePremium] PDF sent successfully:', response);
            this.showSuccessModal(
              'Envoi réussi !',
              `L'Autorisation de Soutenance a été envoyée avec succès à <strong>${doctorantEmail}</strong><br/><br/>
              <div style="text-align: left; margin-top: 15px;">
                <strong>Le doctorant recevra :</strong>
                <ul style="margin-top: 8px;">
                  <li>Le document PDF en pièce jointe</li>
                  <li>La composition du jury</li>
                  <li>L'autorisation officielle</li>
                </ul>
              </div>`
            );
          },
          error: (err) => {
            console.error('[SoutenancePremium] Error sending PDF:', err);
            this.showErrorModal('Erreur lors de l\'envoi du PDF: ' + (err.error?.error || err.message));
          }
        });
      }
    );
  }

  // Modal helper methods
  showConfirmModal(title: string, message: string, onConfirm: () => void): void {
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.modalType.set('confirm');
    this.modalCallback = onConfirm;
    this.showModal.set(true);
  }

  showSuccessModal(title: string, message: string): void {
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.modalType.set('success');
    this.modalCallback = null;
    this.showModal.set(true);
  }

  showErrorModal(message: string): void {
    this.modalTitle.set('Erreur');
    this.modalMessage.set(message);
    this.modalType.set('error');
    this.modalCallback = null;
    this.showModal.set(true);
  }

  showInfoModal(title: string, message: string): void {
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.modalType.set('info');
    this.modalCallback = null;
    this.showModal.set(true);
  }

  confirmModal(): void {
    this.showModal.set(false);
    if (this.modalCallback) {
      this.modalCallback();
      this.modalCallback = null;
    }
  }

  closeModal(): void {
    this.showModal.set(false);
    this.modalCallback = null;
  }
}
