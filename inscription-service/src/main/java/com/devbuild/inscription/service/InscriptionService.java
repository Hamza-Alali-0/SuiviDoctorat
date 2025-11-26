package com.devbuild.inscription.service;

import com.devbuild.inscription.dto.DashboardDTO;
import com.devbuild.inscription.dto.InscriptionFormDTO;
import com.devbuild.inscription.model.*;
import com.devbuild.inscription.model.enums.StatutDossier;
import com.devbuild.inscription.model.enums.TypePieceJointe;
import com.devbuild.inscription.repository.CampagneInscriptionRepository;
import com.devbuild.inscription.repository.DossierInscriptionRepository;
import com.devbuild.inscription.repository.DoctorantRepository;
import com.devbuild.inscription.repository.PieceJointeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InscriptionService {

    private final DoctorantRepository doctorantRepository;
    private final DossierInscriptionRepository dossierRepository;
    private final CampagneInscriptionRepository campagneRepository;
    private final PieceJointeRepository pieceRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public InscriptionService(DoctorantRepository doctorantRepository,
                              DossierInscriptionRepository dossierRepository,
                              CampagneInscriptionRepository campagneRepository,
                              PieceJointeRepository pieceRepository,
                              FileStorageService fileStorageService,
                              NotificationService notificationService) {
        this.doctorantRepository = doctorantRepository;
        this.dossierRepository = dossierRepository;
        this.campagneRepository = campagneRepository;
        this.pieceRepository = pieceRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
    }

    @Transactional
    public DossierInscription soumettreDossier(Long doctorantId, DossierInscription payload) {
        Optional<Doctorant> d = doctorantRepository.findById(doctorantId);
        if (!d.isPresent()) throw new IllegalArgumentException("Doctorant introuvable");
        Doctorant doctorant = d.get();

        payload.setDoctorant(doctorant);
        payload.setDateSoumission(LocalDateTime.now());
        payload.setStatut(StatutDossier.SOUMIS);


        if (payload.getCampagne() == null) {
            List<CampagneInscription> campagnes = campagneRepository.findByActiveTrue();
            if (!campagnes.isEmpty()) payload.setCampagne(campagnes.get(0));
        }


        if (payload.getCampagne() != null) {
            CampagneInscription camp = campagneRepository.findById(payload.getCampagne().getId()).orElse(null);
            if (camp == null) throw new IllegalArgumentException("Campagne introuvable");
            if (!camp.isActive()) throw new IllegalStateException("La campagne n'est pas active");
            if (camp.getDateOuverture() != null && camp.getDateFermeture() != null) {
                java.time.LocalDate today = java.time.LocalDate.now();
                if (today.isBefore(camp.getDateOuverture()) || today.isAfter(camp.getDateFermeture())) {
                    throw new IllegalStateException("La campagne est fermée: soumission interdite en dehors des dates d'ouverture");
                }
            }
        }

        DossierInscription saved = dossierRepository.save(payload);

        // notifications
        notificationService.notifyDirecteur(saved);
        notificationService.notifyAdmin(saved);

        return saved;
    }

    public DossierInscription reinscription(Long doctorantId) {
        // find latest dossier for doctorant and copy selective fields
        List<DossierInscription> dossiers = dossierRepository.findByDoctorantId(doctorantId);
        if (dossiers.isEmpty()) throw new IllegalArgumentException("Aucun dossier précédent");

        DossierInscription latest = dossiers.get(dossiers.size() - 1);
        DossierInscription copy = new DossierInscription();
        copy.setDoctorant(latest.getDoctorant());
        copy.setSujetThese(latest.getSujetThese());
        copy.setDirecteurThese(latest.getDirecteurThese());
        copy.setCoDirecteur(latest.getCoDirecteur());
        copy.setLaboratoire(latest.getLaboratoire());
        copy.setReinscription(true);

        // attach the same campaign if exists
        copy.setCampagne(latest.getCampagne());

        return dossierRepository.save(copy);
    }

    public List<DossierInscription> getDossiersForDoctorant(Long doctorantId) {
        return dossierRepository.findByDoctorantId(doctorantId);
    }

    @Transactional
    public PieceJointe televerserPiece(Long dossierId, MultipartFile file) throws IOException {
        DossierInscription dossier = dossierRepository.findById(dossierId).orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
        // if dossier is linked to a campaign, ensure campaign is open
        if (dossier.getCampagne() != null) {
            CampagneInscription camp = campagneRepository.findById(dossier.getCampagne().getId()).orElse(null);
            if (camp == null) throw new IllegalArgumentException("Campagne introuvable");
            if (!camp.isActive()) throw new IllegalStateException("La campagne liée au dossier n'est pas active");
            if (camp.getDateOuverture() != null && camp.getDateFermeture() != null) {
                java.time.LocalDate today = java.time.LocalDate.now();
                if (today.isBefore(camp.getDateOuverture()) || today.isAfter(camp.getDateFermeture())) {
                    throw new IllegalStateException("La campagne est fermée: téléversement interdit en dehors des dates d'ouverture");
                }
            }
        }
        String path = fileStorageService.store(file);
        PieceJointe piece = new PieceJointe();
        piece.setNomFichier(file.getOriginalFilename());
        piece.setTypeMime(file.getContentType());
        piece.setTaille(file.getSize());
        piece.setCheminStockage(path);
        piece.setDateTeleversement(LocalDateTime.now());
        piece.setDossier(dossier);
        piece = pieceRepository.save(piece);
        dossier.addPiece(piece);
        dossierRepository.save(dossier);
        return piece;
    }

    @Transactional
    public DossierInscription donnerAvisDirecteur(Long dossierId, String avis) {
        DossierInscription dossier = dossierRepository.findById(dossierId).orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
        dossier.setAvisDirecteur(avis);
        dossier.setDateAvisDirecteur(LocalDateTime.now());
        // change status to EN_ATTENTE (waiting admin) or a specific director-reviewed state
        dossier.setStatut(StatutDossier.EN_ATTENTE);
        DossierInscription saved = dossierRepository.save(dossier);
        // notify admin that director gave opinion
        notificationService.notifyAdmin(saved);
        return saved;
    }

    @Transactional
    public DossierInscription validerParAdmin(Long dossierId, boolean valide, String noteAdmin) {
        DossierInscription dossier = dossierRepository.findById(dossierId).orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
        dossier.setAvisAdmin(noteAdmin);
        dossier.setDateValidationAdmin(LocalDateTime.now());
        dossier.setStatut(valide ? StatutDossier.VALIDÉ : StatutDossier.REJETÉ);
        DossierInscription saved = dossierRepository.save(dossier);
        // notify doctorant
        notificationService.notifyDoctorant(saved, valide);
        return saved;
    }
    
    /**
     * Get active campaigns for inscription
     */
    public List<CampagneInscription> getActiveCampagnes() {
        return campagneRepository.findByActiveTrue();
    }
    
    /**
     * Check if a campaign is currently open for submissions
     */
    public boolean isCampagneOpen(Long campagneId) {
        Optional<CampagneInscription> campOpt = campagneRepository.findById(campagneId);
        if (!campOpt.isPresent()) {
            return false;
        }
        
        CampagneInscription camp = campOpt.get();
        if (!camp.isActive()) {
            return false;
        }
        
        if (camp.getDateOuverture() != null && camp.getDateFermeture() != null) {
            LocalDate today = LocalDate.now();
            return !today.isBefore(camp.getDateOuverture()) && !today.isAfter(camp.getDateFermeture());
        }
        
        return true;
    }
    
    /**
     * Submit a complete inscription form
     */
    @Transactional
    public DossierInscription submitInscriptionForm(InscriptionFormDTO formDTO) {
        // Get or create doctorant
        Doctorant doctorant;
        if (formDTO.getDoctorantId() != null) {
            doctorant = doctorantRepository.findById(formDTO.getDoctorantId())
                .orElseThrow(() -> new IllegalArgumentException("Doctorant introuvable"));
            // Update doctorant info
            updateDoctorantFromDTO(doctorant, formDTO);
        } else {
            doctorant = createDoctorantFromDTO(formDTO);
        }
        doctorant = doctorantRepository.save(doctorant);
        
        // Create dossier
        DossierInscription dossier = new DossierInscription();
        dossier.setDoctorant(doctorant);
        dossier.setSujetThese(formDTO.getSujetThese());
        dossier.setDirecteurThese(formDTO.getDirecteurThese());
        dossier.setCoDirecteur(formDTO.getCoDirecteur());
        dossier.setLaboratoire(formDTO.getLaboratoire());
        dossier.setTypeCollaboration(formDTO.getTypeCollaboration());
        dossier.setOrganismeCollaboration(formDTO.getOrganismeCollaboration());
        dossier.setPaysCollaboration(formDTO.getPaysCollaboration());
        dossier.setReinscription(formDTO.isReinscription());
        dossier.setDateSoumission(LocalDateTime.now());
        dossier.setStatut(StatutDossier.SOUMIS);
        
        // Attach to campaign
        if (formDTO.getCampagneId() != null) {
            CampagneInscription camp = campagneRepository.findById(formDTO.getCampagneId())
                .orElseThrow(() -> new IllegalArgumentException("Campagne introuvable"));
            
            if (!isCampagneOpen(formDTO.getCampagneId())) {
                throw new IllegalStateException("La campagne n'est pas ouverte aux soumissions");
            }
            
            dossier.setCampagne(camp);
        }
        
        DossierInscription saved = dossierRepository.save(dossier);
        
        // Send notifications
        notificationService.notifyDirecteur(saved);
        notificationService.notifyAdmin(saved);
        
        return saved;
    }
    
    /**
     * Upload a piece with type information
     */
    @Transactional
    public PieceJointe televerserPieceAvecType(Long dossierId, MultipartFile file, 
                                               TypePieceJointe typePiece, String description) throws IOException {
        DossierInscription dossier = dossierRepository.findById(dossierId)
            .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
        
        // Verify campaign is open
        if (dossier.getCampagne() != null && !isCampagneOpen(dossier.getCampagne().getId())) {
            throw new IllegalStateException("La campagne est fermée: téléversement interdit");
        }
        
        // Store file with type validation
        String path = fileStorageService.store(file, typePiece);
        
        PieceJointe piece = new PieceJointe();
        piece.setNomFichier(file.getOriginalFilename());
        piece.setTypeMime(file.getContentType());
        piece.setTaille(file.getSize());
        piece.setCheminStockage(path);
        piece.setDateTeleversement(LocalDateTime.now());
        piece.setTypePiece(typePiece);
        piece.setDescription(description);
        piece.setDossier(dossier);
        
        piece = pieceRepository.save(piece);
        dossier.addPiece(piece);
        dossierRepository.save(dossier);
        
        return piece;
    }
    
    /**
     * Get dashboard data for a doctorant
     */
    public List<DashboardDTO> getDashboardForDoctorant(Long doctorantId) {
        List<DossierInscription> dossiers = dossierRepository.findByDoctorantId(doctorantId);
        List<DashboardDTO> dashboards = new ArrayList<>();
        
        for (DossierInscription dossier : dossiers) {
            DashboardDTO dto = new DashboardDTO();
            dto.setDossierId(dossier.getId());
            dto.setCampagneNom(dossier.getCampagne() != null ? dossier.getCampagne().getNom() : "N/A");
            dto.setStatut(dossier.getStatut());
            dto.setDateSoumission(dossier.getDateSoumission());
            dto.setReinscription(dossier.isReinscription());
            dto.setSujetThese(dossier.getSujetThese());
            dto.setDirecteurThese(dossier.getDirecteurThese());
            dto.setNombrePiecesJointes(dossier.getPieces() != null ? dossier.getPieces().size() : 0);
            dto.setAvisDirecteur(dossier.getAvisDirecteur());
            dto.setDateAvisDirecteur(dossier.getDateAvisDirecteur());
            dto.setAvisAdmin(dossier.getAvisAdmin());
            dto.setDateValidationAdmin(dossier.getDateValidationAdmin());
            
            // Build workflow timeline
            dto.setTimeline(buildWorkflowTimeline(dossier));
            dto.setEtapeActuelle(getCurrentWorkflowStep(dossier));
            
            dashboards.add(dto);
        }
        
        return dashboards;
    }
    
    /**
     * Build workflow timeline for a dossier
     */
    private List<DashboardDTO.WorkflowStep> buildWorkflowTimeline(DossierInscription dossier) {
        List<DashboardDTO.WorkflowStep> timeline = new ArrayList<>();
        
        // Step 1: Submission
        timeline.add(new DashboardDTO.WorkflowStep(
            "Soumission",
            "Dossier soumis par le candidat",
            dossier.getDateSoumission(),
            true,
            false
        ));
        
        // Step 2: Director review
        boolean directorCompleted = dossier.getDateAvisDirecteur() != null;
        timeline.add(new DashboardDTO.WorkflowStep(
            "Avis Directeur",
            directorCompleted ? "Avis donné: " + dossier.getAvisDirecteur() : "En attente de l'avis du directeur de thèse",
            dossier.getDateAvisDirecteur(),
            directorCompleted,
            !directorCompleted && dossier.getStatut() == StatutDossier.SOUMIS
        ));
        
        // Step 3: Admin validation
        boolean adminCompleted = dossier.getDateValidationAdmin() != null;
        timeline.add(new DashboardDTO.WorkflowStep(
            "Validation Administrative",
            adminCompleted ? "Décision: " + dossier.getStatut() : "En attente de validation administrative",
            dossier.getDateValidationAdmin(),
            adminCompleted,
            !adminCompleted && directorCompleted
        ));
        
        return timeline;
    }
    
    /**
     * Get current workflow step
     */
    private DashboardDTO.WorkflowStep getCurrentWorkflowStep(DossierInscription dossier) {
        if (dossier.getStatut() == StatutDossier.VALIDÉ || dossier.getStatut() == StatutDossier.REJETÉ) {
            return new DashboardDTO.WorkflowStep(
                "Terminé",
                "Dossier " + (dossier.getStatut() == StatutDossier.VALIDÉ ? "validé" : "rejeté"),
                dossier.getDateValidationAdmin(),
                true,
                false
            );
        } else if (dossier.getDateAvisDirecteur() != null) {
            return new DashboardDTO.WorkflowStep(
                "Validation Administrative",
                "En attente de validation administrative",
                null,
                false,
                true
            );
        } else {
            return new DashboardDTO.WorkflowStep(
                "Avis Directeur",
                "En attente de l'avis du directeur de thèse",
                null,
                false,
                true
            );
        }
    }
    
    /**
     * Create a new Doctorant from form DTO
     */
    private Doctorant createDoctorantFromDTO(InscriptionFormDTO dto) {
        Doctorant doctorant = new Doctorant();
        updateDoctorantFromDTO(doctorant, dto);
        return doctorant;
    }
    
    /**
     * Update Doctorant fields from form DTO
     */
    private void updateDoctorantFromDTO(Doctorant doctorant, InscriptionFormDTO dto) {
        doctorant.setPrenom(dto.getPrenom());
        doctorant.setNom(dto.getNom());
        doctorant.setEmail(dto.getEmail());
        doctorant.setDateNaissance(dto.getDateNaissance());
        doctorant.setLieuNaissance(dto.getLieuNaissance());
        doctorant.setSexe(dto.getSexe());
        doctorant.setNationalite(dto.getNationalite());
        doctorant.setCin(dto.getCin());
        doctorant.setAdresse(dto.getAdresse());
        doctorant.setTelephone(dto.getTelephone());
        doctorant.setDiplomesPrecedents(dto.getDiplomesPrecedents());
        doctorant.setEtablissementOrigine(dto.getEtablissementOrigine());
    }

}
