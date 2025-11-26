package com.devbuild.inscription.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Étend le modèle de campagne d'inscription pour couvrir INSCRIPTION, REINSCRIPTION, SOUTENANCE
 * avec champs supplémentaires utilisés par l'interface admin.
 */

@Entity
@Table(name = "campagne_inscription")
public class CampagneInscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nom;
	private LocalDate dateOuverture;
	private LocalDate dateFermeture;
	private boolean active = true;

	// Nouveaux champs génériques
	private String type; // INSCRIPTION | REINSCRIPTION | SOUTENANCE
	private String anneeUniversitaire;
	@Column(length = 2000)
	private String description;
	private String visibilite; // PUBLIC | INTERNE

	// INSCRIPTION spécifiques
	private String etablissement;
	private String ecoleDoctorale;
	@Lob @Column(columnDefinition = "LONGTEXT")
	private String logoEcole; // Base64 ou URL
	@Lob @Column(columnDefinition = "LONGTEXT")
	private String photoCouverture; // Base64 ou URL
	@ElementCollection
	@CollectionTable(name = "campagne_pieces_obligatoires", joinColumns = @JoinColumn(name = "campagne_id"))
	@Column(name = "piece")
	private List<String> piecesObligatoires = new ArrayList<>();
	@Column(length = 4000)
	private String reglesEligibilite;

	// REINSCRIPTION spécifiques
	private String anneeConcernee;
	@ElementCollection
	@CollectionTable(name = "campagne_docs_renouveler", joinColumns = @JoinColumn(name = "campagne_id"))
	@Column(name = "document")
	private List<String> documentsARenouveler = new ArrayList<>();
	private Boolean derogationTroisiemeAnnee;
	@Column(length = 2000)
	private String messageInformatif;

	// SOUTENANCE spécifiques
	@ElementCollection
	@CollectionTable(name = "campagne_checklist", joinColumns = @JoinColumn(name = "campagne_id"))
	private List<ChecklistItemEmbeddable> checklistObligatoire = new ArrayList<>();
	@ElementCollection
	@CollectionTable(name = "campagne_documents_obligatoires", joinColumns = @JoinColumn(name = "campagne_id"))
	@Column(name = "document")
	private List<String> documentsObligatoires = new ArrayList<>();
	@Lob @Column(columnDefinition = "LONGTEXT")
	private String modeleAutorisation; // PDF encodé ou URL

	// Notifications
	@Lob @Column(columnDefinition = "LONGTEXT")
	private String emailOuverture;
	@Lob @Column(columnDefinition = "LONGTEXT")
	private String emailRappel;
	@Lob @Column(columnDefinition = "LONGTEXT")
	private String emailFermeture;

	private Integer nombreDossiers; // compteur agrégé

	@JsonIgnore
	@OneToMany(mappedBy = "campagne", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DossierInscription> dossiers = new ArrayList<>();

	public CampagneInscription() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public LocalDate getDateOuverture() {
		return dateOuverture;
	}

	public void setDateOuverture(LocalDate dateOuverture) {
		this.dateOuverture = dateOuverture;
	}

	public LocalDate getDateFermeture() {
		return dateFermeture;
	}

	public void setDateFermeture(LocalDate dateFermeture) {
		this.dateFermeture = dateFermeture;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public List<DossierInscription> getDossiers() {
		return dossiers;
	}

	public void setDossiers(List<DossierInscription> dossiers) {
		this.dossiers = dossiers;
	}

	public void addDossier(DossierInscription dossier) {
		dossiers.add(dossier);
		dossier.setCampagne(this);
	}

	public void removeDossier(DossierInscription dossier) {
		dossiers.remove(dossier);
		dossier.setCampagne(null);
	}

	// Getters / Setters nouveaux champs
	public String getType() { return type; }
	public void setType(String type) { this.type = type; }
	public String getAnneeUniversitaire() { return anneeUniversitaire; }
	public void setAnneeUniversitaire(String anneeUniversitaire) { this.anneeUniversitaire = anneeUniversitaire; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public String getVisibilite() { return visibilite; }
	public void setVisibilite(String visibilite) { this.visibilite = visibilite; }
	public String getEtablissement() { return etablissement; }
	public void setEtablissement(String etablissement) { this.etablissement = etablissement; }
	public String getEcoleDoctorale() { return ecoleDoctorale; }
	public void setEcoleDoctorale(String ecoleDoctorale) { this.ecoleDoctorale = ecoleDoctorale; }
	public String getLogoEcole() { return logoEcole; }
	public void setLogoEcole(String logoEcole) { this.logoEcole = logoEcole; }
	public String getPhotoCouverture() { return photoCouverture; }
	public void setPhotoCouverture(String photoCouverture) { this.photoCouverture = photoCouverture; }
	public List<String> getPiecesObligatoires() { return piecesObligatoires; }
	public void setPiecesObligatoires(List<String> piecesObligatoires) { this.piecesObligatoires = piecesObligatoires; }
	public String getReglesEligibilite() { return reglesEligibilite; }
	public void setReglesEligibilite(String reglesEligibilite) { this.reglesEligibilite = reglesEligibilite; }
	public String getAnneeConcernee() { return anneeConcernee; }
	public void setAnneeConcernee(String anneeConcernee) { this.anneeConcernee = anneeConcernee; }
	public List<String> getDocumentsARenouveler() { return documentsARenouveler; }
	public void setDocumentsARenouveler(List<String> documentsARenouveler) { this.documentsARenouveler = documentsARenouveler; }
	public Boolean getDerogationTroisiemeAnnee() { return derogationTroisiemeAnnee; }
	public void setDerogationTroisiemeAnnee(Boolean derogationTroisiemeAnnee) { this.derogationTroisiemeAnnee = derogationTroisiemeAnnee; }
	public String getMessageInformatif() { return messageInformatif; }
	public void setMessageInformatif(String messageInformatif) { this.messageInformatif = messageInformatif; }
	public List<ChecklistItemEmbeddable> getChecklistObligatoire() { return checklistObligatoire; }
	public void setChecklistObligatoire(List<ChecklistItemEmbeddable> checklistObligatoire) { this.checklistObligatoire = checklistObligatoire; }
	public List<String> getDocumentsObligatoires() { return documentsObligatoires; }
	public void setDocumentsObligatoires(List<String> documentsObligatoires) { this.documentsObligatoires = documentsObligatoires; }
	public String getModeleAutorisation() { return modeleAutorisation; }
	public void setModeleAutorisation(String modeleAutorisation) { this.modeleAutorisation = modeleAutorisation; }
	public String getEmailOuverture() { return emailOuverture; }
	public void setEmailOuverture(String emailOuverture) { this.emailOuverture = emailOuverture; }
	public String getEmailRappel() { return emailRappel; }
	public void setEmailRappel(String emailRappel) { this.emailRappel = emailRappel; }
	public String getEmailFermeture() { return emailFermeture; }
	public void setEmailFermeture(String emailFermeture) { this.emailFermeture = emailFermeture; }
	public Integer getNombreDossiers() { return nombreDossiers; }
	public void setNombreDossiers(Integer nombreDossiers) { this.nombreDossiers = nombreDossiers; }

}
