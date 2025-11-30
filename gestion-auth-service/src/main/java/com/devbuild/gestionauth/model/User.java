package com.devbuild.gestionauth.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    private Set<Role> roles = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    @Column(nullable = true)
    private String firstName;

    @Column(nullable = true)
    private String lastName;

    @Column(nullable = true)
    private String phone;

    @Column(nullable = true)
    private Boolean acceptTerms = false;

    @Column(nullable = true)
    private String requestedProfile;

    @Column(nullable = false)
    private Boolean approved = false;

    @Column(nullable = true)
    private String affiliation;

    @Column(name = "email_verification_token", nullable = true)
    private String emailVerificationToken;

    @Column(name = "verification_code", nullable = true)
    private String verificationCode;

    @Column(name = "verification_expiry", nullable = true)
    private java.time.LocalDateTime verificationExpiry;

    @Column(name = "verification_sent_at", nullable = true)
    private java.time.LocalDateTime verificationSentAt;

    @Column(name = "verification_send_count", nullable = true)
    private Integer verificationSendCount = 0;

    @Column(name = "verification_send_count_reset", nullable = true)
    private java.time.LocalDateTime verificationSendCountReset;


    @Column(nullable = true)
    private String approvedBy;

    @Column(nullable = true)
    private java.time.LocalDateTime approvedAt;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    @Column(nullable = true)
    private String rejectionReason;

    @Column(nullable = false)
    private Boolean disabled = false;

    @Column(name = "password_reset_token_hash", nullable = true)
    private String passwordResetTokenHash;

    @Column(name = "password_reset_expiry", nullable = true)
    private java.time.LocalDateTime passwordResetExpiry;

    @Column(name = "bio", nullable = true, length = 1000)
    private String bio;

    @Column(name = "linkedin_url", nullable = true)
    private String linkedinUrl;

    @Column(name = "portfolio_url", nullable = true)
    private String portfolioUrl;

    @Column(name = "avatar", nullable = true)
    private String avatar;

    @Column(name = "cv_url", nullable = true)
    private String cvUrl;

    @Column(name = "pending_email", nullable = true)
    private String pendingEmail;

    @Column(name = "email_change_token", nullable = true)
    private String emailChangeToken;

    @Column(name = "email_change_expiry", nullable = true)
    private java.time.LocalDateTime emailChangeExpiry;

    // Encadrant-specific fields
    @Column(name = "etablissement", nullable = true)
    private String etablissement;

    @Column(name = "laboratoire", nullable = true)
    private String laboratoire;

    @Column(name = "specialite", nullable = true)
    private String specialite;

    @Column(name = "grade", nullable = true)
    private String grade;

    @Column(name = "domaines_recherche", nullable = true, length = 1000)
    private String domainesRecherche;

    @Column(name = "nombre_publications", nullable = true)
    private Integer nombrePublications;

    @Column(name = "h_index", nullable = true)
    private Integer hIndex;

    @Column(name = "orcid_id", nullable = true)
    private String orcidId;

    @Column(name = "research_gate_url", nullable = true)
    private String researchGateUrl;

    @Column(name = "google_scholar_url", nullable = true)
    private String googleScholarUrl;

    @Column(name = "avatar_url", nullable = true)
    private String avatarUrl;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Boolean getAcceptTerms() { return acceptTerms; }
    public void setAcceptTerms(Boolean acceptTerms) { this.acceptTerms = acceptTerms; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    public String getRequestedProfile() { return requestedProfile; }
    public void setRequestedProfile(String requestedProfile) { this.requestedProfile = requestedProfile; }
    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public String getAffiliation() { return affiliation; }
    public void setAffiliation(String affiliation) { this.affiliation = affiliation; }
    public String getEmailVerificationToken() { return emailVerificationToken; }
    public void setEmailVerificationToken(String emailVerificationToken) { this.emailVerificationToken = emailVerificationToken; }
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public java.time.LocalDateTime getVerificationExpiry() { return verificationExpiry; }
    public void setVerificationExpiry(java.time.LocalDateTime verificationExpiry) { this.verificationExpiry = verificationExpiry; }
    public java.time.LocalDateTime getVerificationSentAt() { return verificationSentAt; }
    public void setVerificationSentAt(java.time.LocalDateTime verificationSentAt) { this.verificationSentAt = verificationSentAt; }
    public Integer getVerificationSendCount() { return verificationSendCount; }
    public void setVerificationSendCount(Integer verificationSendCount) { this.verificationSendCount = verificationSendCount; }
    public java.time.LocalDateTime getVerificationSendCountReset() { return verificationSendCountReset; }
    public void setVerificationSendCountReset(java.time.LocalDateTime verificationSendCountReset) { this.verificationSendCountReset = verificationSendCountReset; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public java.time.LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(java.time.LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Boolean getDisabled() { return disabled; }
    public void setDisabled(Boolean disabled) { this.disabled = disabled; }

    public String getPasswordResetTokenHash() { return passwordResetTokenHash; }
    public void setPasswordResetTokenHash(String passwordResetTokenHash) { this.passwordResetTokenHash = passwordResetTokenHash; }

    public java.time.LocalDateTime getPasswordResetExpiry() { return passwordResetExpiry; }
    public void setPasswordResetExpiry(java.time.LocalDateTime passwordResetExpiry) { this.passwordResetExpiry = passwordResetExpiry; }

    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCvUrl() { return cvUrl; }
    public void setCvUrl(String cvUrl) { this.cvUrl = cvUrl; }
    public String getPendingEmail() { return pendingEmail; }
    public void setPendingEmail(String pendingEmail) { this.pendingEmail = pendingEmail; }
    public String getEmailChangeToken() { return emailChangeToken; }
    public void setEmailChangeToken(String emailChangeToken) { this.emailChangeToken = emailChangeToken; }
    public java.time.LocalDateTime getEmailChangeExpiry() { return emailChangeExpiry; }
    public void setEmailChangeExpiry(java.time.LocalDateTime emailChangeExpiry) { this.emailChangeExpiry = emailChangeExpiry; }

    // Encadrant-specific getters and setters
    public String getEtablissement() { return etablissement; }
    public void setEtablissement(String etablissement) { this.etablissement = etablissement; }
    public String getLaboratoire() { return laboratoire; }
    public void setLaboratoire(String laboratoire) { this.laboratoire = laboratoire; }
    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getDomainesRecherche() { return domainesRecherche; }
    public void setDomainesRecherche(String domainesRecherche) { this.domainesRecherche = domainesRecherche; }
    public Integer getNombrePublications() { return nombrePublications; }
    public void setNombrePublications(Integer nombrePublications) { this.nombrePublications = nombrePublications; }
    public Integer getHIndex() { return hIndex; }
    public void setHIndex(Integer hIndex) { this.hIndex = hIndex; }
    public String getOrcidId() { return orcidId; }
    public void setOrcidId(String orcidId) { this.orcidId = orcidId; }
    public String getResearchGateUrl() { return researchGateUrl; }
    public void setResearchGateUrl(String researchGateUrl) { this.researchGateUrl = researchGateUrl; }
    public String getGoogleScholarUrl() { return googleScholarUrl; }
    public void setGoogleScholarUrl(String googleScholarUrl) { this.googleScholarUrl = googleScholarUrl; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    // Helper method to get role as string for backward compatibility
    public String getRole() {
        if (roles == null || roles.isEmpty()) return null;
        return roles.iterator().next().name();
    }
}
