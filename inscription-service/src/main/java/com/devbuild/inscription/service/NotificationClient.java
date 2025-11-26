package com.devbuild.inscription.service;

import com.devbuild.inscription.dto.NotificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationClient {

    private final RestTemplate restTemplate;
    private final String notificationServiceUrl;
    @org.springframework.beans.factory.annotation.Value("${app.notification.internal-secret:}")
    private String internalSecret;

    public NotificationClient(@Value("${notification.service.url:http://localhost:8094}") String notificationServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.notificationServiceUrl = notificationServiceUrl;
    }

    public void sendNotification(String recipient, String subject, String message, String type) {
        try {
            NotificationRequest request = new NotificationRequest(recipient, subject, message, type);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (internalSecret != null && !internalSecret.isBlank()) {
                headers.set("X-INTERNAL-AUTH", internalSecret);
            }

            HttpEntity<NotificationRequest> entity = new HttpEntity<>(request, headers);

            // Call the notification service raw-email endpoint directly to avoid 404s
            try {
                RawEmailPayload raw = new RawEmailPayload(recipient, subject, message);
                HttpEntity<RawEmailPayload> rawEntity = new HttpEntity<>(raw, headers);
                String rawUrl = notificationServiceUrl + "/api/notifications/email/raw";
                System.out.println("[NOTIFICATION-CLIENT] POST " + rawUrl + " payload=" + raw + " headersPresent=" + (internalSecret != null && !internalSecret.isBlank()));
                var resp2 = restTemplate.postForEntity(rawUrl, rawEntity, String.class);
                System.out.println("[NOTIFICATION-CLIENT] response from /email/raw: status=" + (resp2 != null ? resp2.getStatusCode().value() : "<null>") + " body=" + (resp2 != null ? resp2.getBody() : "<null>"));
            } catch (Exception ex) {
                System.err.println("[NOTIFICATION-CLIENT] /email/raw failed: " + ex.getMessage());
                ex.printStackTrace();
                throw ex; // let outer catch handle fallback logging
            }

            System.out.println("[NOTIFICATION-CLIENT] Sent notification to " + recipient);
        } catch (Exception e) {
            System.err.println("[NOTIFICATION-CLIENT] Failed to send notification: " + e.getMessage());
            e.printStackTrace();
            // Fall back to console logging to ensure notification not lost
            System.out.println("[FALLBACK] " + type + " to " + recipient + ": " + subject + " - " + message);
        }
    }

    // Simple payload class for raw email (keeps dependency minimal)
    private static class RawEmailPayload {
        public String to;
        public String subject;
        public String body;

        public RawEmailPayload(String to, String subject, String body) {
            this.to = to;
            this.subject = subject;
            this.body = body;
        }

        @Override
        public String toString() {
            return "RawEmailPayload[to=" + to + ", subject=" + subject + "]";
        }
    }
}