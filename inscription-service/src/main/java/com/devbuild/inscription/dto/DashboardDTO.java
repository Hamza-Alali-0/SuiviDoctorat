package com.devbuild.inscription.dto;

import com.devbuild.inscription.model.enums.StatutDossier;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for doctorant dashboard
 * Provides real-time tracking of dossier status with timeline
 */
public class DashboardDTO {

    private Long dossierId;
    private String campagneNom;
    private StatutDossier statut;
    private LocalDateTime dateSoumission;
    private boolean reinscription;
    
    // Workflow tracking
    private WorkflowStep etapeActuelle;
    private List<WorkflowStep> timeline = new ArrayList<>();
    
    // Dossier details
    private String sujetThese;
    private String directeurThese;
    private int nombrePiecesJointes;
    
    // Validation info
    private String avisDirecteur;
    private LocalDateTime dateAvisDirecteur;
    private String avisAdmin;
    private LocalDateTime dateValidationAdmin;

    public DashboardDTO() {
    }

    public DashboardDTO(Long dossierId, String campagneNom, StatutDossier statut, 
                       LocalDateTime dateSoumission, boolean reinscription) {
        this.dossierId = dossierId;
        this.campagneNom = campagneNom;
        this.statut = statut;
        this.dateSoumission = dateSoumission;
        this.reinscription = reinscription;
    }

    // Getters and Setters
    public Long getDossierId() {
        return dossierId;
    }

    public void setDossierId(Long dossierId) {
        this.dossierId = dossierId;
    }

    public String getCampagneNom() {
        return campagneNom;
    }

    public void setCampagneNom(String campagneNom) {
        this.campagneNom = campagneNom;
    }

    public StatutDossier getStatut() {
        return statut;
    }

    public void setStatut(StatutDossier statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDateTime dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public boolean isReinscription() {
        return reinscription;
    }

    public void setReinscription(boolean reinscription) {
        this.reinscription = reinscription;
    }

    public WorkflowStep getEtapeActuelle() {
        return etapeActuelle;
    }

    public void setEtapeActuelle(WorkflowStep etapeActuelle) {
        this.etapeActuelle = etapeActuelle;
    }

    public List<WorkflowStep> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<WorkflowStep> timeline) {
        this.timeline = timeline;
    }

    public String getSujetThese() {
        return sujetThese;
    }

    public void setSujetThese(String sujetThese) {
        this.sujetThese = sujetThese;
    }

    public String getDirecteurThese() {
        return directeurThese;
    }

    public void setDirecteurThese(String directeurThese) {
        this.directeurThese = directeurThese;
    }

    public int getNombrePiecesJointes() {
        return nombrePiecesJointes;
    }

    public void setNombrePiecesJointes(int nombrePiecesJointes) {
        this.nombrePiecesJointes = nombrePiecesJointes;
    }

    public String getAvisDirecteur() {
        return avisDirecteur;
    }

    public void setAvisDirecteur(String avisDirecteur) {
        this.avisDirecteur = avisDirecteur;
    }

    public LocalDateTime getDateAvisDirecteur() {
        return dateAvisDirecteur;
    }

    public void setDateAvisDirecteur(LocalDateTime dateAvisDirecteur) {
        this.dateAvisDirecteur = dateAvisDirecteur;
    }

    public String getAvisAdmin() {
        return avisAdmin;
    }

    public void setAvisAdmin(String avisAdmin) {
        this.avisAdmin = avisAdmin;
    }

    public LocalDateTime getDateValidationAdmin() {
        return dateValidationAdmin;
    }

    public void setDateValidationAdmin(LocalDateTime dateValidationAdmin) {
        this.dateValidationAdmin = dateValidationAdmin;
    }

    /**
     * Inner class representing a step in the workflow timeline
     */
    public static class WorkflowStep {
        private String etape;
        private String description;
        private LocalDateTime date;
        private boolean completed;
        private boolean current;

        public WorkflowStep() {
        }

        public WorkflowStep(String etape, String description, LocalDateTime date, 
                          boolean completed, boolean current) {
            this.etape = etape;
            this.description = description;
            this.date = date;
            this.completed = completed;
            this.current = current;
        }

        public String getEtape() {
            return etape;
        }

        public void setEtape(String etape) {
            this.etape = etape;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getDate() {
            return date;
        }

        public void setDate(LocalDateTime date) {
            this.date = date;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }

        public boolean isCurrent() {
            return current;
        }

        public void setCurrent(boolean current) {
            this.current = current;
        }
    }
}
