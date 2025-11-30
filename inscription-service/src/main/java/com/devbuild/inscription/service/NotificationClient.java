package com.devbuild.inscription.service;

import com.devbuild.inscription.dto.NotificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;

import java.util.Map;
import java.util.HashMap;

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

    /**
     * Send email with attachments
     */
    public void sendEmailWithAttachments(String recipient, String subject, String message, Map<String, byte[]> attachments) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            if (internalSecret != null && !internalSecret.isBlank()) {
                headers.set("X-INTERNAL-AUTH", internalSecret);
            }

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("to", recipient);
            body.add("subject", subject);
            body.add("body", message);
            
            // Add attachments
            if (attachments != null && !attachments.isEmpty()) {
                for (Map.Entry<String, byte[]> entry : attachments.entrySet()) {
                    ByteArrayResource fileResource = new ByteArrayResource(entry.getValue()) {
                        @Override
                        public String getFilename() {
                            return entry.getKey();
                        }
                    };
                    body.add("attachments", fileResource);
                }
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            String url = notificationServiceUrl + "/api/notifications/email/with-attachments";
            
            System.out.println("[NOTIFICATION-CLIENT] Sending email with attachments to " + recipient + " via " + url);
            var response = restTemplate.postForEntity(url, requestEntity, String.class);
            System.out.println("[NOTIFICATION-CLIENT] Email with attachments sent: " + (response != null ? response.getStatusCode() : "null"));
        } catch (Exception e) {
            System.err.println("[NOTIFICATION-CLIENT] Failed to send email with attachments: " + e.getMessage());
            e.printStackTrace();
            // Fallback to console logging
            System.out.println("[FALLBACK] Email with attachments to " + recipient + ": " + subject);
            if (attachments != null) {
                System.out.println("[FALLBACK] Attachments: " + attachments.keySet());
            }
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