package com.devbuild.gestionauth.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class NotificationClient {

    private final WebClient webClient;

    @Value("${app.notification.internal-secret:}")
    private String internalSecret;

    public NotificationClient(@Value("${app.notification.url:http://localhost:8094}") String notificationUrl) {
        // Normalize configured URL to avoid duplicate "/api/notifications" segments
        String base = notificationUrl != null ? notificationUrl.trim() : "";
        // collapse repeated '/api/notifications' occurrences and strip trailing slashes
        base = base.replaceAll("(/api/notifications)+", "/api/notifications");
        base = base.replaceAll("/+$", "");
        this.webClient = WebClient.builder()
                .baseUrl(base)
                .build();
    }

    /**
     * Send an email request to the notification service
     */
    public Mono<String> sendEmailRequest(Map<String, Object> payload) {
        // Use the template-aware `/email` endpoint so payloads containing
        // `templateCode` and `variables` are handled by the notification service.
        return webClient.post()
                .uri("/email")
                .header("Content-Type", "application/json")
                .header("X-INTERNAL-AUTH", internalSecret != null ? internalSecret : "")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> System.err.println("[NotificationClient] Error sending email: " + e.getMessage()))
                .onErrorResume(e -> {
                    System.err.println("[NotificationClient] Failed to send email: " + e.getMessage());
                    return Mono.empty();
                });
    }

    /**
     * Send a profile request notification
     */
    public Mono<String> sendProfileRequest(Map<String, Object> payload) {
        return webClient.post()
                .uri("/profile-request")
                .header("Content-Type", "application/json")
                .header("X-INTERNAL-AUTH", internalSecret != null ? internalSecret : "")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> System.err.println("[NotificationClient] Error sending profile request: " + e.getMessage()))
                .onErrorResume(e -> {
                    System.err.println("[NotificationClient] Failed to send profile request: " + e.getMessage());
                    return Mono.empty();
                });
    }
}
