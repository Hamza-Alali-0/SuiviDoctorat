package com.devbuild.inscription.model.enums;

/**
 * Types of documents that can be attached to a dossier
 */
public enum TypePieceJointe {
    DIPLOME("Diplôme"),
    CV("Curriculum Vitae"),
    LETTRE_MOTIVATION("Lettre de motivation"),
    PHOTO_IDENTITE("Photo d'identité"),
    CARTE_IDENTITE("Carte d'identité"),
    CERTIFICAT_SCOLARITE("Certificat de scolarité"),
    ATTESTATION("Attestation"),
    AUTRE("Autre document");

    private final String libelle;

    TypePieceJointe(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelle() {
        return libelle;
    }
}
