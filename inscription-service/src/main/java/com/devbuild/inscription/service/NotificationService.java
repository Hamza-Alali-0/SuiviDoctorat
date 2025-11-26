package com.devbuild.inscription.service;

import com.devbuild.inscription.model.DossierInscription;
import com.devbuild.inscription.model.CampagneInscription;
import com.devbuild.inscription.model.Doctorant;
import com.devbuild.inscription.repository.DoctorantRepository;
import com.devbuild.inscription.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class NotificationService {

    private final NotificationClient notificationClient;
    private final DoctorantRepository doctorantRepository;
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;
    @Value("${app.notifications.target-roles:ROLE_USER}")
    private String targetRolesConfig;

    public NotificationService(NotificationClient notificationClient, DoctorantRepository doctorantRepository, JdbcTemplate jdbcTemplate, UserRepository userRepository) {
        this.notificationClient = notificationClient;
        this.doctorantRepository = doctorantRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    public void notifyDirecteur(DossierInscription dossier) {
        String recipient = dossier.getDirecteurThese() + "@university.edu"; // placeholder email
        String subject = "Nouveau dossier d'inscription à examiner";
        String message = "Un nouveau dossier d'inscription (ID: " + dossier.getId() + 
                        ") de " + dossier.getDoctorant().getPrenom() + " " + dossier.getDoctorant().getNom() +
                        " a été soumis et nécessite votre avis.";
        
        notificationClient.sendNotification(recipient, subject, message, "EMAIL");
    }

    public void notifyAdmin(DossierInscription dossier) {
        String recipient = "admin@university.edu"; // placeholder admin email
        String subject = "Dossier d'inscription à valider";
        String message = "Le dossier d'inscription (ID: " + dossier.getId() + 
                        ") de " + dossier.getDoctorant().getPrenom() + " " + dossier.getDoctorant().getNom() +
                        " est prêt pour validation administrative.";
        
        notificationClient.sendNotification(recipient, subject, message, "EMAIL");
    }

    public void notifyDoctorant(DossierInscription dossier, boolean accepted) {
        String recipient = dossier.getDoctorant().getEmail();
        String subject = accepted ? "Dossier d'inscription validé" : "Dossier d'inscription rejeté";
        String message = "Votre dossier d'inscription (ID: " + dossier.getId() + ") a été " + 
                        (accepted ? "validé" : "rejeté") + " par l'administration.";
        
        notificationClient.sendNotification(recipient, subject, message, "EMAIL");
    }

    // Send opening email to all users with ROLE_USER. Returns the list of targeted email addresses.
    public java.util.List<String> sendOpeningEmailToAll(CampagneInscription campagne) {
        java.util.List<String> targetedEmails = new java.util.ArrayList<>();
        if (campagne == null) return targetedEmails;
        String bodyTemplate = campagne.getEmailOuverture();
        if (bodyTemplate == null || bodyTemplate.isBlank()) {
            System.out.println("[NotificationService] No opening email template configured for campagne id=" + (campagne.getId()));
            return targetedEmails;
        }

        String subject = "Ouverture de la campagne: " + campagne.getNom();

            try {
            // Prepare common replacements for the template
            String ouverture = campagne.getDateOuverture() != null ? campagne.getDateOuverture().toString() : "Non définie";
            String fermeture = campagne.getDateFermeture() != null ? campagne.getDateFermeture().toString() : "Non définie";
            String etab = campagne.getEtablissement() != null ? campagne.getEtablissement() : "";
            String ecole = campagne.getEcoleDoctorale() != null ? campagne.getEcoleDoctorale() : "";
            String annee = campagne.getAnneeUniversitaire() != null ? campagne.getAnneeUniversitaire() : "";

            // Default link to frontend inscriptions page (can be customized later)
            String inscriptionLink = "http://localhost:4200/inscriptions?campagne=" + (campagne.getId() != null ? campagne.getId() : "");

            // First try: use UserRepository / JdbcTemplate to fetch emails for configured roles (no pagination)
            java.util.Set<String> emailSet = new java.util.LinkedHashSet<>();
            try {
                    if (this.userRepository != null) {
                    // Compute target roles: take configured roles, but always include ROLE_CANDIDAT
                    String cfg = (this.targetRolesConfig != null && !this.targetRolesConfig.isBlank()) ? this.targetRolesConfig : "ROLE_USER,ROLE_CANDIDAT";
                    java.util.Set<String> roleSet = new java.util.LinkedHashSet<>();
                    for (String r : cfg.split(",")) {
                        if (r == null) continue;
                        String role = r.trim();
                        if (!role.isEmpty()) roleSet.add(role);
                    }
                    // Ensure candidate role is included so candidates always receive opening emails
                    if (!roleSet.contains("ROLE_CANDIDAT") && !roleSet.contains("CANDIDAT")) {
                        roleSet.add("ROLE_CANDIDAT");
                    }
                    for (String role : roleSet) {
                        if (role == null || role.isEmpty()) continue;
                        try {
                            if (this.jdbcTemplate != null) {
                                // Fetch emails with tolerance for ROLE_ prefix variations and case differences.
                                String trimmedRole = role.trim();
                                java.util.List<String> candidates = new java.util.ArrayList<>();
                                candidates.add(trimmedRole);
                                if (trimmedRole.startsWith("ROLE_")) {
                                    String without = trimmedRole.substring(5);
                                    if (!without.isEmpty() && !candidates.contains(without)) candidates.add(without);
                                } else {
                                    String withRole = "ROLE_" + trimmedRole;
                                    if (!candidates.contains(withRole)) candidates.add(withRole);
                                }

                                // Try exact matches first
                                for (String cand : candidates) {
                                    try {
                                        String sql = "SELECT u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.roles = ?";
                                        java.util.List<String> found = jdbcTemplate.queryForList(sql, String.class, cand);
                                        if (found != null) {
                                            for (String e : found) {
                                                if (e != null) {
                                                    String s = e.trim();
                                                    if (!s.isEmpty()) emailSet.add(s);
                                                }
                                            }
                                        }
                                    } catch (Throwable t) {
                                        System.err.println("[NotificationService] jdbcTemplate exact-role query failed for role '" + cand + "': " + t.getMessage());
                                    }
                                }

                                // If still empty, try a case-insensitive LIKE match
                                if (emailSet.isEmpty()) {
                                    try {
                                        String sqlLike = "SELECT u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE UPPER(ur.roles) LIKE ?";
                                        String likeParam = "%" + trimmedRole.toUpperCase() + "%";
                                        java.util.List<String> found = jdbcTemplate.queryForList(sqlLike, String.class, likeParam);
                                        if (found != null) {
                                            for (String e : found) {
                                                if (e != null) {
                                                    String s = e.trim();
                                                    if (!s.isEmpty()) emailSet.add(s);
                                                }
                                            }
                                        }
                                    } catch (Throwable t) {
                                        System.err.println("[NotificationService] jdbcTemplate LIKE-role query failed for role '" + trimmedRole + "': " + t.getMessage());
                                    }
                                }
                            } else {
                                java.util.List<String> found = this.userRepository.findEmailsByRole(role);
                                if (found != null) {
                                    for (String e : found) {
                                        if (e != null) {
                                            String s = e.trim();
                                            if (!s.isEmpty()) emailSet.add(s);
                                        }
                                    }
                                }
                            }
                        } catch (Throwable t) {
                            System.err.println("[NotificationService] failed to fetch users for role '" + role + "': " + t.getMessage());
                        }
                    }
                }
            } catch (Throwable t) {
                System.err.println("[NotificationService] failed to fetch users by role(s): " + t.getMessage());
            }

            if (!emailSet.isEmpty()) {
                java.util.List<String> emails = new java.util.ArrayList<>(emailSet);
                System.out.println("[NotificationService] Found " + emails.size() + " recipient emails for roles='" + this.targetRolesConfig + "'");

                int sentCount = 0;
                int skipped = 0;
                for (String to : emails) {
                    String recipientInfo = "user";
                    if (to == null || to.isBlank()) {
                        skipped++;
                        System.out.println("[NotificationService] Skipping user (no email) " + recipientInfo);
                        continue;
                    }
                    try {
                        String body = buildOpeningEmailHtml(campagne, bodyTemplate, ouverture, fermeture, etab, ecole, annee, inscriptionLink);

                        System.out.println("[NotificationService] Sending opening email to " + recipientInfo + " <" + to + "> subject='" + subject + "' bodyLength=" + (body != null ? body.length() : 0));
                        notificationClient.sendNotification(to, subject, body, "EMAIL");
                        targetedEmails.add(to);
                        sentCount++;
                    } catch (Throwable t) {
                        System.err.println("[NotificationService] Failed to send to " + recipientInfo + " <" + to + ": " + t.getMessage());
                        t.printStackTrace();
                    }
                }
                System.out.println("[NotificationService] Sent opening emails for campagne id=" + campagne.getId() + " sent=" + sentCount + " skipped=" + skipped);
            } else {
                // Fallback to doctorant repository
                java.util.List<Doctorant> all = doctorantRepository != null ? doctorantRepository.findAll() : java.util.Collections.emptyList();
                System.out.println("[NotificationService] Found " + all.size() + " doctorants from doctorantRepository for opening email campagne id=" + campagne.getId());
                int sentCount = 0;
                int skipped = 0;
                for (Doctorant d : all) {
                    String to = d.getEmail();
                    String recipientInfo = "id=" + (d.getId() != null ? d.getId() : "<null>") + " name=" + d.getPrenom() + " " + d.getNom();
                    if (to == null || to.isBlank()) {
                        skipped++;
                        System.out.println("[NotificationService] Skipping doctorant (no email) " + recipientInfo);
                        continue;
                    }
                    try {
                        String body = buildOpeningEmailHtml(campagne, bodyTemplate, ouverture, fermeture, etab, ecole, annee, inscriptionLink);

                        System.out.println("[NotificationService] Sending opening email to " + recipientInfo + " <" + to + "> subject='" + subject + "' bodyLength=" + (body != null ? body.length() : 0));
                        notificationClient.sendNotification(to, subject, body, "EMAIL");
                        targetedEmails.add(to);
                        sentCount++;
                    } catch (Throwable t) {
                        System.err.println("[NotificationService] Failed to send to " + recipientInfo + " <" + to + ": " + t.getMessage());
                        t.printStackTrace();
                    }
                }
                System.out.println("[NotificationService] Sent opening emails for campagne id=" + campagne.getId() + " sent=" + sentCount + " skipped=" + skipped);
            }
        } catch (Exception e) {
            System.err.println("[NotificationService] Error while sending opening emails: " + e.getMessage());
        }

        return targetedEmails;
    }

    // Build an HTML body for opening email, injecting logo, required documents and eligibility rules.
    private String buildOpeningEmailHtml(CampagneInscription campagne, String bodyTemplate, String ouverture, String fermeture, String etab, String ecole, String annee, String inscriptionLink) {
        String template = bodyTemplate == null ? "" : bodyTemplate;

        // Build pieces list as HTML
        String htmlPieces;
        try {
            java.util.List<String> pieces = campagne.getPiecesObligatoires();
            if (pieces != null && !pieces.isEmpty()) {
                StringBuilder ul = new StringBuilder();
                ul.append("<ul>");
                for (String p : pieces) {
                    ul.append("<li>").append(escapeHtml(p == null ? "" : p)).append("</li>");
                }
                ul.append("</ul>");
                htmlPieces = ul.toString();
            } else {
                htmlPieces = "<p>Aucune pièce obligatoire spécifiée.</p>";
            }
        } catch (Throwable t) {
            htmlPieces = "<p>Aucune pièce obligatoire spécifiée.</p>";
        }

        String regles;
        if (campagne.getReglesEligibilite() != null && !campagne.getReglesEligibilite().isBlank()) {
            regles = "<p>" + escapeHtml(campagne.getReglesEligibilite()).replace("\n", "<br/>") + "</p>";
        } else {
            regles = "<p>Aucune règle d'éligibilité spécifiée.</p>";
        }

        String logoHtml = "";
        if (campagne.getLogoEcole() != null && !campagne.getLogoEcole().isBlank()) {
            String url = campagne.getLogoEcole();
            logoHtml = "<div style='text-align:center;margin-bottom:16px;'><img src=\"" + escapeHtml(url) + "\" alt=\"Logo de l'école\" style=\"max-height:80px;max-width:200px;\"/></div>";
        }

        // Perform replacements for placeholders (HTML-aware)
        String filled = template;
        filled = filled.replace("[NOM_CAMPAGNE]", escapeHtml(campagne.getNom() == null ? "" : campagne.getNom()));
        filled = filled.replace("[DATE_OUVERTURE]", escapeHtml(ouverture));
        filled = filled.replace("[DATE_FERMETURE]", escapeHtml(fermeture));
        filled = filled.replace("[ETABLISSEMENT]", escapeHtml(etab));
        filled = filled.replace("[ECOLE_DOCTORALE]", escapeHtml(ecole));
        filled = filled.replace("[ANNEE_UNIVERSITAIRE]", escapeHtml(annee));
        // For link, prefer an HTML anchor
        filled = filled.replace("[LIEN_INSCRIPTION]", "<a href=\"" + escapeHtml(inscriptionLink) + "\">" + escapeHtml(inscriptionLink) + "</a>");

        // Inject pieces and rules and logo placeholders if present
        filled = filled.replace("[PIECES_OBLIGATOIRES]", htmlPieces);
        filled = filled.replace("[REGLES_ELIGIBILITE]", regles);
        filled = filled.replace("[LOGO_ECOLE]", logoHtml);

        // If template appears to contain HTML tags, use it as-is, but ensure logo at top if not present
        if (filled.contains("<") || filled.contains("</")) {
            if (!filled.contains("<img") && !logoHtml.isBlank()) {
                // Prepend logo
                return "<html><body>" + logoHtml + filled + "</body></html>";
            }
            return "<html><body>" + filled + "</body></html>";
        }

        // Fallback: build a simple HTML body
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append(logoHtml);
        sb.append("<h1>").append(escapeHtml(campagne.getNom() == null ? "" : campagne.getNom())).append("</h1>");
        sb.append("<p><strong>Ouverture:</strong> ").append(escapeHtml(ouverture)).append(" | <strong>Fermeture:</strong> ").append(escapeHtml(fermeture)).append("</p>");
        if (!annee.isBlank()) sb.append("<p><strong>Année:</strong> ").append(escapeHtml(annee)).append("</p>");
        if (!etab.isBlank()) sb.append("<p><strong>Établissement:</strong> ").append(escapeHtml(etab)).append("</p>");
        if (!ecole.isBlank()) sb.append("<p><strong>École doctorale:</strong> ").append(escapeHtml(ecole)).append("</p>");
        sb.append("<h3>Pièces obligatoires</h3>").append(htmlPieces);
        sb.append("<h3>Règles d'éligibilité</h3>").append(regles);
        sb.append("<p>Inscrivez-vous ici: <a href=\"").append(escapeHtml(inscriptionLink)).append("\">Ouvrir la page d'inscription</a></p>");
        sb.append("</body></html>");
        return sb.toString();
    }

    // Minimal HTML-escape helper to avoid breaking the HTML structure when injecting user-provided text
    private static String escapeHtml(String in) {
        if (in == null) return "";
        return in.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }

}