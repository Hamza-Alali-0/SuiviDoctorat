package com.devbuild.inscription.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctorants")
public class Doctorant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String prenom;
	private String nom;
	private String email;
	private LocalDate dateNaissance;
	private String adresse;
	private String telephone;
	
	// Additional fields for complete registration form
	private String nationalite;
	private String lieuNaissance;
	private String sexe; // M/F
	private String cin; // Carte d'identité nationale
	private String diplomesPrecedents; // e.g., Master en Informatique, Université X
	private String etablissementOrigine;

	@OneToMany(mappedBy = "doctorant", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DossierInscription> dossiers = new ArrayList<>();

	@ManyToMany
	@JoinTable(
		name = "doctorant_favorites",
		joinColumns = @JoinColumn(name = "doctorant_id"),
		inverseJoinColumns = @JoinColumn(name = "campagne_id")
	)
	private List<CampagneInscription> favorites = new ArrayList<>();

	public Doctorant() {
	}

	public Doctorant(String prenom, String nom, String email) {
		this.prenom = prenom;
		this.nom = nom;
		this.email = email;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getNationalite() {
		return nationalite;
	}

	public void setNationalite(String nationalite) {
		this.nationalite = nationalite;
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

	public String getCin() {
		return cin;
	}

	public void setCin(String cin) {
		this.cin = cin;
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

	public List<DossierInscription> getDossiers() {
		return dossiers;
	}

	public void setDossiers(List<DossierInscription> dossiers) {
		this.dossiers = dossiers;
	}

	public void addDossier(DossierInscription dossier) {
		dossiers.add(dossier);
		dossier.setDoctorant(this);
	}

	public void removeDossier(DossierInscription dossier) {
		dossiers.remove(dossier);
		dossier.setDoctorant(null);
	}

	public List<CampagneInscription> getFavorites() {
		return favorites;
	}

	public void setFavorites(List<CampagneInscription> favorites) {
		this.favorites = favorites;
	}

	public void addFavorite(CampagneInscription campagne) {
		if (!favorites.contains(campagne)) {
			favorites.add(campagne);
		}
	}

	public void removeFavorite(CampagneInscription campagne) {
		favorites.remove(campagne);
	}

	@Override
	public String toString() {
		return "Doctorant{" +
				"id=" + id +
				", prenom='" + prenom + '\'' +
				", nom='" + nom + '\'' +
				", email='" + email + '\'' +
				'}';
	}

}
