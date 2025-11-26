package com.devbuild.inscription.dto;

import java.time.LocalDate;

/**
 * DTO for dynamic inscription/reinscription form
 * Contains all fields needed for the candidat to submit a complete dossier
 */
public class InscriptionFormDTO {

    // Doctorant personal information
    private Long doctorantId; // null for new inscription, set for reinscription
    private String prenom;
    private String nom;
    private String email;
    private LocalDate dateNaissance;
    private String lieuNaissance;
    private String sexe;
    private String nationalite;
    private String cin;
    private String adresse;
    private String telephone;
    
    // Academic background
    private String diplomesPrecedents;
    private String etablissementOrigine;
    
    // Thesis details
    private String sujetThese;
    private String directeurThese;
    private String coDirecteur;
    private String laboratoire;
    
    // Collaboration details
    private String typeCollaboration;
    private String organismeCollaboration;
    private String paysCollaboration;
    
    // Administrative
    private Long campagneId;
    private boolean reinscription;

    public InscriptionFormDTO() {
    }

    // Getters and Setters
    public Long getDoctorantId() {
        return doctorantId;
    }

    public void setDoctorantId(Long doctorantId) {
        this.doctorantId = doctorantId;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return lieuNaissance;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getNationalite() {
        return nationalite;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getDiplomesPrecedents() {
        return diplomesPrecedents;
    }

    public void setDiplomesPrecedents(String diplomesPrecedents) {
        this.diplomesPrecedents = diplomesPrecedents;
    }

    public String getEtablissementOrigine() {
        return etablissementOrigine;
    }

    public void setEtablissementOrigine(String etablissementOrigine) {
        this.etablissementOrigine = etablissementOrigine;
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

    public String getCoDirecteur() {
        return coDirecteur;
    }

    public void setCoDirecteur(String coDirecteur) {
        this.coDirecteur = coDirecteur;
    }

    public String getLaboratoire() {
        return laboratoire;
    }

    public void setLaboratoire(String laboratoire) {
        this.laboratoire = laboratoire;
    }

    public String getTypeCollaboration() {
        return typeCollaboration;
    }

    public void setTypeCollaboration(String typeCollaboration) {
        this.typeCollaboration = typeCollaboration;
    }

    public String getOrganismeCollaboration() {
        return organismeCollaboration;
    }

    public void setOrganismeCollaboration(String organismeCollaboration) {
        this.organismeCollaboration = organismeCollaboration;
    }

    public String getPaysCollaboration() {
        return paysCollaboration;
    }

    public void setPaysCollaboration(String paysCollaboration) {
        this.paysCollaboration = paysCollaboration;
    }

    public Long getCampagneId() {
        return campagneId;
    }

    public void setCampagneId(Long campagneId) {
        this.campagneId = campagneId;
    }

    public boolean isReinscription() {
        return reinscription;
    }

    public void setReinscription(boolean reinscription) {
        this.reinscription = reinscription;
    }
}
