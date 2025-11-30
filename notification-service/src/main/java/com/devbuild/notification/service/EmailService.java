package com.devbuild.notification.service;

import com.devbuild.notification.dto.SendEmailRequest;
import com.devbuild.notification.model.EmailTemplate;
import com.devbuild.notification.repository.EmailTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import com.devbuild.notification.exception.EmailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailTemplateRepository templateRepository;
    private final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final boolean dryRun;
    private final boolean debugErrors;

    public EmailService(JavaMailSender mailSender, EmailTemplateRepository templateRepository,
                        @Value("${app.notification.dry-run:false}") boolean dryRun,
                        @Value("${app.notification.debug-errors:false}") boolean debugErrors) {
        this.mailSender = mailSender;
        this.templateRepository = templateRepository;
        this.dryRun = dryRun;
        this.debugErrors = debugErrors;
    }

    public boolean sendFromTemplate(SendEmailRequest req) {
        if (req == null || req.getTo() == null || req.getTemplateCode() == null) {
            return false;
        }
        try {
            EmailTemplate template = templateRepository.findByCode(req.getTemplateCode()).orElse(null);
            if (template == null) {
                log.warn("Template not found: {}", req.getTemplateCode());
                return false;
            }

            String subject = req.getSubject() != null ? req.getSubject() : template.getSujet();
            String body = template.generer(req.getVariables());

            // Debug: log mailSender implementation and config when available
            try {
                log.debug("[EmailService] mailSender implementation: {}", mailSender.getClass().getName());
                if (mailSender instanceof JavaMailSenderImpl) {
                    JavaMailSenderImpl impl = (JavaMailSenderImpl) mailSender;
                    log.debug("[EmailService] mail sender host={}, port={}, username={}", impl.getHost(), impl.getPort(), impl.getUsername());
                }
            } catch (Throwable t) {
                log.warn("[EmailService] unable to inspect mailSender implementation", t);
            }

            // If dry-run is enabled or mail sender is not configured, log the rendered email and skip sending.
            boolean senderConfigured = true;
            if (mailSender instanceof JavaMailSenderImpl) {
                JavaMailSenderImpl impl = (JavaMailSenderImpl) mailSender;
                String host = impl.getHost();
                if (host == null || host.isBlank()) {
                    senderConfigured = false;
                }
            }

            if (dryRun || !senderConfigured) {
                log.info("[EmailService] dry-run/log-only mode: to={} subject={} body={}", req.getTo(), subject, body);
                return true;
            }

            MimeMessage message = mailSender.createMimeMessage();
            boolean looksLikeHtml = body != null && (body.contains("<html") || body.contains("<body") || body.contains("<div") || body.contains("<p") || body.contains("<img") || body.contains("<table"));
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(req.getTo());
            helper.setSubject(subject);
            helper.setText(body != null ? body : "", looksLikeHtml);

            // Try to embed a logo if available on the classpath at /static/logo.png
            try {
                ClassPathResource logo = new ClassPathResource("static/logo.png");
                if (logo.exists()) {
                    helper.addInline("logo", logo);
                }
            } catch (Throwable t) {
                log.debug("Could not embed logo inline: {}", t.getMessage());
            }

            mailSender.send(message);
            log.info("Email sent to {} using template {}", req.getTo(), req.getTemplateCode());
            return true;
        } catch (Exception e) {
            // Log detailed context to help debugging (recipient + template + short exception message)
            try { log.error("Failed to send email to {} using template {} : {}", req != null ? req.getTo() : "<null>", req != null ? req.getTemplateCode() : "<null>", e.toString()); } catch (Throwable t) {}
            log.debug("Full exception for failed send:", e);
            if (debugErrors) {
                throw new EmailSendException("Failed to send email: " + e.getMessage(), e);
            }
            return false;
        }
    }

    public Map<String, String> renderPreview(SendEmailRequest req) {
        if (req == null || req.getTemplateCode() == null) {
            return Map.of("error", "invalid request");
        }
        EmailTemplate template = templateRepository.findByCode(req.getTemplateCode()).orElse(null);
        if (template == null) {
            return Map.of("error", "template not found");
        }
        String subject = req.getSubject() != null ? req.getSubject() : template.getSujet();
        String body = template.generer(req.getVariables());
        return Map.of("subject", subject, "body", body);
    }

    // Send an email using raw subject/body (no template lookup)
    public boolean sendRaw(String to, String subject, String body) {
        if (to == null || (subject == null && body == null)) return false;
        try {
            // If dry-run or mail sender not configured, log and return true
            boolean senderConfigured = true;
            if (mailSender instanceof JavaMailSenderImpl) {
                JavaMailSenderImpl impl = (JavaMailSenderImpl) mailSender;
                String host = impl.getHost();
                if (host == null || host.isBlank()) {
                    senderConfigured = false;
                }
            }

            if (dryRun || !senderConfigured) {
                log.info("[EmailService] dry-run mode - raw email to={} subject={} body={}", to, subject, body);
                return true;
            }

            MimeMessage message = mailSender.createMimeMessage();
            boolean looksLikeHtml = body != null && (body.contains("<html") || body.contains("<body") || body.contains("<div") || body.contains("<p") || body.contains("<img") || body.contains("<table"));
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            if (subject != null) helper.setSubject(subject);
            helper.setText(body != null ? body : "", looksLikeHtml);

            // Try to embed logo inline if present
            try {
                ClassPathResource logo = new ClassPathResource("static/logo.png");
                if (logo.exists()) {
                    helper.addInline("logo", logo);
                }
            } catch (Throwable t) {
                log.debug("Could not embed logo inline for raw email: {}", t.getMessage());
            }

            mailSender.send(message);
            log.info("Raw email sent to {}", to);
            return true;
        } catch (Exception e) {
            try { log.error("Failed to send raw email to {} : {}", to, e.toString()); } catch (Throwable t) {}
            log.debug("Full exception for failed raw send:", e);
            if (debugErrors) {
                throw new EmailSendException("Failed to send raw email: " + e.getMessage(), e);
            }
            return false;
        }
    }

    /**
     * Send an email with file attachments
     */
    public boolean sendWithAttachments(String to, String subject, String body, java.util.Map<String, byte[]> attachments) {
        if (to == null || (subject == null && body == null)) return false;
        try {
            // If dry-run or mail sender not configured, log and return true
            boolean senderConfigured = true;
            if (mailSender instanceof JavaMailSenderImpl) {
                JavaMailSenderImpl impl = (JavaMailSenderImpl) mailSender;
                String host = impl.getHost();
                if (host == null || host.isBlank()) {
                    senderConfigured = false;
                }
            }

            if (dryRun || !senderConfigured) {
                log.info("[EmailService] dry-run mode - email with attachments to={} subject={} attachmentCount={}",
                    to, subject, attachments != null ? attachments.size() : 0);
                if (attachments != null) {
                    log.info("[EmailService] dry-run - attachments: {}", attachments.keySet());
                }
                return true;
            }

            MimeMessage message = mailSender.createMimeMessage();
            boolean looksLikeHtml = body != null && (body.contains("<html") || body.contains("<body") || body.contains("<div") || body.contains("<p") || body.contains("<img") || body.contains("<table"));

            // Use multipart mode for attachments
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            if (subject != null) helper.setSubject(subject);
            helper.setText(body != null ? body : "", looksLikeHtml);

            // Try to embed logo inline if present
            try {
                ClassPathResource logo = new ClassPathResource("static/logo.png");
                if (logo.exists()) {
                    helper.addInline("logo", logo);
                }
            } catch (Throwable t) {
                log.debug("Could not embed logo inline for email with attachments: {}", t.getMessage());
            }

            // Add attachments
            if (attachments != null && !attachments.isEmpty()) {
                for (java.util.Map.Entry<String, byte[]> entry : attachments.entrySet()) {
                    String filename = entry.getKey();
                    byte[] content = entry.getValue();
                    helper.addAttachment(filename, new org.springframework.core.io.ByteArrayResource(content));
                    log.debug("Added attachment: {} ({} bytes)", filename, content.length);
                }
            }

            mailSender.send(message);
            log.info("Email with {} attachments sent to {}", attachments != null ? attachments.size() : 0, to);
            return true;
        } catch (Exception e) {
            try {
                log.error("Failed to send email with attachments to {} : {}", to, e.toString());
            } catch (Throwable t) {}
            log.debug("Full exception for failed send with attachments:", e);
            if (debugErrors) {
                throw new EmailSendException("Failed to send email with attachments: " + e.getMessage(), e);
            }
            return false;
        }
    }
}
