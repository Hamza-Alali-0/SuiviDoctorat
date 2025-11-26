package com.devbuild.inscription.controller;

import com.devbuild.inscription.model.CampagneInscription;
import com.devbuild.inscription.repository.CampagneInscriptionRepository;
import com.devbuild.inscription.service.NotificationService;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/campagnes")
public class AdminCampagneController {

    private final CampagneInscriptionRepository repo;
    private final NotificationService notificationService;

    public AdminCampagneController(CampagneInscriptionRepository repo, NotificationService notificationService) {
        this.repo = repo;
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CampagneInscription campagne) {
        long start = System.currentTimeMillis();
        System.out.println("[AdminCampagneController] CREATE nom=" + campagne.getNom() + " type=" + campagne.getType());
        try {
            // Ensure no ID provided for new entity to avoid merge path
            campagne.setId(null);
            
            // Initialize collections to empty lists if null to avoid JPA issues
            if (campagne.getPiecesObligatoires() == null) campagne.setPiecesObligatoires(new java.util.ArrayList<>());
            if (campagne.getDocumentsARenouveler() == null) campagne.setDocumentsARenouveler(new java.util.ArrayList<>());
            if (campagne.getChecklistObligatoire() == null) campagne.setChecklistObligatoire(new java.util.ArrayList<>());
            if (campagne.getDocumentsObligatoires() == null) campagne.setDocumentsObligatoires(new java.util.ArrayList<>());
            
            CampagneInscription saved = repo.saveAndFlush(campagne); // force INSERT immediately
            System.out.println("[AdminCampagneController] CREATED id=" + saved.getId() + " in " + (System.currentTimeMillis()-start) + "ms");

            // If campaign as opening email and opening date is now or in the past and active, send opening email
            try {
                LocalDate today = LocalDate.now();
                if (saved.isActive() && saved.getEmailOuverture() != null && !saved.getEmailOuverture().isBlank()) {
                    if (saved.getDateOuverture() == null || !saved.getDateOuverture().isAfter(today)) {
                        // send opening emails (async may be better in production)
                        new Thread(() -> {
                            try {
                                notificationService.sendOpeningEmailToAll(saved);
                            } catch (Throwable t) { t.printStackTrace(); }
                        }).start();
                    }
                }
            } catch (Exception e) {
                System.err.println("[AdminCampagneController] failed to trigger opening emails: " + e.getMessage());
            }

            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            System.err.println("[AdminCampagneController] ERROR create: " + ex.getClass().getName() + " - " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Erreur enregistrement campagne: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CampagneInscription>> list() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable("id") long id, @RequestBody CampagneInscription campagne) {
        CampagneInscription existing = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Campagne not found"));
        System.out.println("[AdminCampagneController] UPDATE id=" + id + " nom=" + campagne.getNom());
        boolean wasActive = existing.isActive();
        existing.setNom(campagne.getNom());
        existing.setDateOuverture(campagne.getDateOuverture());
        existing.setDateFermeture(campagne.getDateFermeture());
        existing.setActive(campagne.isActive());
        existing.setType(campagne.getType());
        existing.setAnneeUniversitaire(campagne.getAnneeUniversitaire());
        existing.setDescription(campagne.getDescription());
        existing.setVisibilite(campagne.getVisibilite());
        existing.setEtablissement(campagne.getEtablissement());
        existing.setEcoleDoctorale(campagne.getEcoleDoctorale());
        existing.setLogoEcole(campagne.getLogoEcole());
        existing.setPhotoCouverture(campagne.getPhotoCouverture());
        existing.setPiecesObligatoires(campagne.getPiecesObligatoires());
        existing.setReglesEligibilite(campagne.getReglesEligibilite());
        existing.setAnneeConcernee(campagne.getAnneeConcernee());
        existing.setDocumentsARenouveler(campagne.getDocumentsARenouveler());
        existing.setDerogationTroisiemeAnnee(campagne.getDerogationTroisiemeAnnee());
        existing.setMessageInformatif(campagne.getMessageInformatif());
        existing.setChecklistObligatoire(campagne.getChecklistObligatoire());
        existing.setDocumentsObligatoires(campagne.getDocumentsObligatoires());
        existing.setModeleAutorisation(campagne.getModeleAutorisation());
        existing.setEmailOuverture(campagne.getEmailOuverture());
        existing.setEmailRappel(campagne.getEmailRappel());
        existing.setEmailFermeture(campagne.getEmailFermeture());
        existing.setNombreDossiers(campagne.getNombreDossiers());
        
        CampagneInscription updated = repo.save(existing);
        System.out.println("[AdminCampagneController] UPDATED id=" + updated.getId());
        // If the campaign was previously inactive and is now active, and opening template/date allow,
        // trigger sending opening emails to all doctorants.
        try {
            java.time.LocalDate today = java.time.LocalDate.now();
            if (!wasActive && updated.isActive() && updated.getEmailOuverture() != null && !updated.getEmailOuverture().isBlank()) {
                if (updated.getDateOuverture() == null || !updated.getDateOuverture().isAfter(today)) {
                    new Thread(() -> {
                        try { notificationService.sendOpeningEmailToAll(updated); } catch (Throwable t) { t.printStackTrace(); }
                    }).start();
                }
            }
        } catch (Exception e) {
            System.err.println("[AdminCampagneController] failed to trigger opening emails on update: " + e.getMessage());
        }
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<?> toggle(@PathVariable("id") long id) {
        CampagneInscription c = repo.findById(id).orElseThrow();
        boolean newState = !c.isActive();
        c.setActive(newState);
        CampagneInscription saved = repo.save(c);

        // If campaign is now active, and opening date/template allow, trigger opening emails
        try {
            java.time.LocalDate today = java.time.LocalDate.now();
            if (saved.isActive() && saved.getEmailOuverture() != null && !saved.getEmailOuverture().isBlank()) {
                if (saved.getDateOuverture() == null || !saved.getDateOuverture().isAfter(today)) {
                    new Thread(() -> {
                        try { notificationService.sendOpeningEmailToAll(saved); } catch (Throwable t) { t.printStackTrace(); }
                    }).start();
                }
            }
        } catch (Exception e) {
            System.err.println("[AdminCampagneController] failed to trigger opening emails on toggle: " + e.getMessage());
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

}