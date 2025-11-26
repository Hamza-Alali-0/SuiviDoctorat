package com.devbuild.soutenance.notification;

import com.devbuild.soutenance.model.MembreJury;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.notification.url:}")
    private String notificationBaseUrl;

    @Value("${app.notification.internal-secret:}")
    private String internalSecret;

    public void sendJuryAssignedEmail(String doctorantEmail, MembreJury membre) {
        if (notificationBaseUrl == null || notificationBaseUrl.isBlank()) {
            System.out.println("[notification-client] no notification url configured, skipping email");
            return;
        }

        String url = notificationBaseUrl;
        if (!url.endsWith("/")) url = url + "/";
        url = url + "email/raw"; // POST to /email/raw

        String subject = "Nouveau membre du jury assigné à votre soutenance";

        StringBuilder sb = new StringBuilder();
        sb.append("Bonjour,\n\n");
        sb.append("Un nouveau membre du jury a été affecté à votre soutenance.\n\n");
        sb.append("Nom: ").append(membre.getPrenom()).append(" ").append(membre.getNom()).append("\n");
        sb.append("Email: ").append(membre.getEmail()).append("\n");
        sb.append("Rôle: ").append(membre.getRole() != null ? membre.getRole().name() : "").append("\n");
        sb.append("Grade: ").append(membre.getGrade() != null ? membre.getGrade() : "N/A").append("\n");
        sb.append("Établissement: ").append(membre.getEtablissement() != null ? membre.getEtablissement() : "N/A").append("\n");
        if (membre.getDemande() != null && membre.getDemande().getTitreThese() != null) {
            sb.append("Thèse: ").append(membre.getDemande().getTitreThese()).append("\n");
        }
        sb.append("\nCordialement,\nL'équipe de suivi de soutenance");

        String body = sb.toString();

        Map<String, String> payload = new HashMap<>();
        payload.put("to", doctorantEmail);
        payload.put("subject", subject);
        payload.put("body", body);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (internalSecret != null && !internalSecret.isBlank()) {
            headers.set("X-INTERNAL-AUTH", internalSecret);
        }

        HttpEntity<Map<String, String>> req = new HttpEntity<>(payload, headers);

        // Verbose logging for debugging notification issues
        try {
            System.out.println("[notification-client] sending email -> url=" + url);
            System.out.println("[notification-client] internalSecretPresent=" + (internalSecret != null && !internalSecret.isBlank()));
            System.out.println("[notification-client] payload=" + payload);

            var resp = restTemplate.postForEntity(url, req, String.class);

            if (resp != null) {
                System.out.println("[notification-client] notification service response: status=" + resp.getStatusCodeValue());
                try {
                    System.out.println("[notification-client] response body=" + resp.getBody());
                } catch (Throwable t) {
                    // ignore
                }
            }

            System.out.println("[notification-client] sent jury-assigned email to " + doctorantEmail);
        } catch (Exception e) {
            System.err.println("[notification-client] failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
