package com.devbuild.inscription.controller;

import com.devbuild.inscription.dto.DashboardDTO;
import com.devbuild.inscription.dto.InscriptionFormDTO;
import com.devbuild.inscription.dto.DossierSubmissionDTO;
import com.devbuild.inscription.model.CampagneInscription;
import com.devbuild.inscription.model.DossierInscription;
import com.devbuild.inscription.model.PieceJointe;
import com.devbuild.inscription.model.enums.TypePieceJointe;
import com.devbuild.inscription.service.InscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionService service;

    public InscriptionController(InscriptionService service) {
        this.service = service;
    }
    
    /**
     * Get all active campaigns
     */
    @GetMapping("/campagnes/actives")
    public ResponseEntity<List<CampagneInscription>> getCampagnesActives() {
        List<CampagneInscription> campagnes = service.getActiveCampagnes();
        return ResponseEntity.ok(campagnes);
    }
    
    /**
     * Submit a complete inscription form
     */
    @PostMapping("/soumettre")
    public ResponseEntity<DossierSubmissionDTO> submitInscription(@RequestBody InscriptionFormDTO formDTO) {
        DossierInscription saved = service.submitInscriptionForm(formDTO);
        DossierSubmissionDTO dto = new DossierSubmissionDTO(
            saved.getId(),
            saved.getStatut(),
            saved.getCampagne() != null ? saved.getCampagne().getId() : null,
            saved.getCampagne() != null ? saved.getCampagne().getNom() : null,
            saved.getPieces() != null ? saved.getPieces().size() : 0
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/doctorant/{id}/soumettre")
    public ResponseEntity<DossierSubmissionDTO> soumettre(@PathVariable("id") Long doctorantId, @RequestBody DossierInscription payload) {
        DossierInscription saved = service.soumettreDossier(doctorantId, payload);
        DossierSubmissionDTO dto = new DossierSubmissionDTO(
            saved.getId(),
            saved.getStatut(),
            saved.getCampagne() != null ? saved.getCampagne().getId() : null,
            saved.getCampagne() != null ? saved.getCampagne().getNom() : null,
            saved.getPieces() != null ? saved.getPieces().size() : 0
        );
        return ResponseEntity.ok(dto);
    }

    /**
     * Submit dossier for the authenticated doctorant (uses authentication principal)
     */
    @PostMapping("/doctorant/me/soumettre")
    public ResponseEntity<DossierSubmissionDTO> soumettrePourAuthentifie(Principal principal, @RequestBody DossierInscription payload) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        DossierInscription saved = service.soumettreDossierPourEmail(principal.getName(), payload);
        DossierSubmissionDTO dto = new DossierSubmissionDTO(
            saved.getId(),
            saved.getStatut(),
            saved.getCampagne() != null ? saved.getCampagne().getId() : null,
            saved.getCampagne() != null ? saved.getCampagne().getNom() : null,
            saved.getPieces() != null ? saved.getPieces().size() : 0
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/doctorant/{id}/reinscription")
    public ResponseEntity<?> reinscription(@PathVariable("id") Long doctorantId) {
        DossierInscription newDossier = service.reinscription(doctorantId);
        return ResponseEntity.ok(newDossier);
    }

    @PostMapping(value = "/dossier/{id}/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadPiece(@PathVariable("id") Long dossierId, @RequestParam("file") MultipartFile file) throws IOException {
        PieceJointe piece = service.televerserPiece(dossierId, file);
        return ResponseEntity.ok(piece);
    }
    
    /**
     * Upload a piece with type and description
     */
    @PostMapping(value = "/dossier/{id}/upload-typed", consumes = "multipart/form-data")
    public ResponseEntity<PieceJointe> uploadPieceTyped(
            @PathVariable("id") Long dossierId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("typePiece") TypePieceJointe typePiece,
            @RequestParam(value = "description", required = false) String description) throws IOException {
        PieceJointe piece = service.televerserPieceAvecType(dossierId, file, typePiece, description);
        return ResponseEntity.ok(piece);
    }
    
    /**
     * Get dossier details
     */
    @GetMapping("/dossier/{id}")
    public ResponseEntity<DossierInscription> getDossier(@PathVariable("id") Long dossierId) {
        DossierInscription dossier = service.getDossiersForDoctorant(dossierId).stream()
            .filter(d -> d.getId().equals(dossierId))
            .findFirst()
            .orElse(null);
        if (dossier == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dossier);
    }

    @GetMapping("/doctorant/{id}/dashboard")
    public ResponseEntity<?> dashboard(@PathVariable("id") Long doctorantId) {
        System.out.println("[InscriptionController] dashboard() called for doctorantId: " + doctorantId);
        // For simplicity return list of dossiers (could be a DTO with status and latest updates)
        List<DossierInscription> dossiers = service.getDossiersForDoctorant(doctorantId);
        System.out.println("[InscriptionController] Found " + dossiers.size() + " dossiers for doctorant " + doctorantId);
        for (DossierInscription d : dossiers) {
            System.out.println("  - Dossier ID: " + d.getId() + ", Campagne: " + 
                (d.getCampagne() != null ? d.getCampagne().getNom() + " (ID: " + d.getCampagne().getId() + ")" : "NULL") +
                ", Statut: " + d.getStatut());
        }
        return ResponseEntity.ok(dossiers);
    }

    /**
     * Dashboard for authenticated doctorant without needing numeric id in frontend.
     */
    @GetMapping("/doctorant/me/dashboard")
    public ResponseEntity<?> dashboardMe(Principal principal) {
        if (principal == null || principal.getName() == null) {
            System.out.println("[InscriptionController] dashboardMe() - no principal, returning 401");
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        String identity = principal.getName();
        System.out.println("[InscriptionController] dashboardMe() principal=" + identity);
        try {
            List<DossierInscription> dossiers = service.getDossiersForDoctorantEmail(identity);
            System.out.println("[InscriptionController] dashboardMe() returning " + dossiers.size() + " dossiers");
            return ResponseEntity.ok(dossiers);
        } catch (Exception e) {
            System.err.println("[InscriptionController] dashboardMe() error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Internal error", "error", e.getMessage()));
        }
    }
    
    /**
     * Get enhanced dashboard with workflow timeline
     */
    @GetMapping("/doctorant/{id}/dashboard-enhanced")
    public ResponseEntity<List<DashboardDTO>> getDashboardEnhanced(@PathVariable("id") Long doctorantId) {
        List<DashboardDTO> dashboard = service.getDashboardForDoctorant(doctorantId);
        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/dossier/{id}/directeur/avis")
    public ResponseEntity<?> avisDirecteur(@PathVariable("id") Long dossierId, @RequestParam("avis") String avis) {
        DossierInscription updated = service.donnerAvisDirecteur(dossierId, avis);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/dossier/{id}/admin/valider")
    public ResponseEntity<?> validerAdmin(@PathVariable("id") Long dossierId, @RequestParam("valide") boolean valide, @RequestParam(value = "note", required = false) String note) {
        DossierInscription updated = service.validerParAdmin(dossierId, valide, note);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/doctorant/me/favorites/{campagneId}")
    public ResponseEntity<?> addFavorite(Principal principal, @PathVariable Long campagneId) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        service.addFavorite(principal.getName(), campagneId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/doctorant/me/favorites/{campagneId}")
    public ResponseEntity<?> removeFavorite(Principal principal, @PathVariable Long campagneId) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        service.removeFavorite(principal.getName(), campagneId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctorant/me/favorites")
    public ResponseEntity<List<CampagneInscription>> getFavorites(Principal principal) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        List<CampagneInscription> favorites = service.getFavorites(principal.getName());
        return ResponseEntity.ok(favorites);
    }

}
