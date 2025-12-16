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
        this.webClient = WebClient.builder()
                .baseUrl(notificationUrl)
                .build();
    }

    /**
     * Send an email request to the notification service
     */
    public Mono<String> sendEmailRequest(Map<String, Object> payload) {
        return webClient.post()
                .uri("/api/notifications/email/raw")
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
                .uri("/api/notifications/profile-request")
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
