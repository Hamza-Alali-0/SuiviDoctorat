package com.devbuild.inscription.dto;

import com.devbuild.inscription.model.enums.StatutDossier;

/**
 * Minimal DTO returned after a dossier submission to avoid heavy entity graphs
 * and potential JSON parse issues on the frontend.
 */
public class DossierSubmissionDTO {
    private Long id;
    private StatutDossier statut;
    private Long campagneId;
    private String campagneNom;
    private int piecesCount;

    public DossierSubmissionDTO() {}

    public DossierSubmissionDTO(Long id, StatutDossier statut, Long campagneId, String campagneNom, int piecesCount) {
        this.id = id;
        this.statut = statut;
        this.campagneId = campagneId;
        this.campagneNom = campagneNom;
        this.piecesCount = piecesCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public StatutDossier getStatut() { return statut; }
    public void setStatut(StatutDossier statut) { this.statut = statut; }
    public Long getCampagneId() { return campagneId; }
    public void setCampagneId(Long campagneId) { this.campagneId = campagneId; }
    public String getCampagneNom() { return campagneNom; }
    public void setCampagneNom(String campagneNom) { this.campagneNom = campagneNom; }
    public int getPiecesCount() { return piecesCount; }
    public void setPiecesCount(int piecesCount) { this.piecesCount = piecesCount; }
}
