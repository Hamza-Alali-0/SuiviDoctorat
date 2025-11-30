package com.devbuild.notification;

import com.devbuild.notification.dto.SendEmailRequest;
import com.devbuild.notification.dto.RawEmailRequest;
import com.devbuild.notification.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {

    private final String expectedInternalSecret;
    private final EmailService emailService;
    private final boolean debugErrors;
    private final JavaMailSender mailSender;
    private final boolean dryRun;

    public NotificationsController(@Value("${app.notification.internal-secret:}") String expectedInternalSecret,
                                   EmailService emailService,
                                   JavaMailSender mailSender,
                                   @Value("${app.notification.debug-errors:false}") boolean debugErrors,
                                   @Value("${app.notification.dry-run:false}") boolean dryRun) {
        this.expectedInternalSecret = expectedInternalSecret;
        this.emailService = emailService;
        this.debugErrors = debugErrors;
        this.mailSender = mailSender;
        this.dryRun = dryRun;
    }

    @GetMapping("/debug-config")
    public ResponseEntity<?> debugConfig(@RequestHeader(value = "X-INTERNAL-AUTH", required = false) String header) {
        if (expectedInternalSecret != null && !expectedInternalSecret.isBlank()) {
            if (header == null || !expectedInternalSecret.equals(header)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "forbidden"));
            }
        }
        try {
            String impl = mailSender != null ? mailSender.getClass().getName() : "<none>";
            String host = "<unknown>";
            Integer port = null;
            String username = "<unknown>";
            if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
                org.springframework.mail.javamail.JavaMailSenderImpl implObj = (org.springframework.mail.javamail.JavaMailSenderImpl) mailSender;
                host = implObj.getHost();
                port = implObj.getPort();
                username = implObj.getUsername();
            }
            return ResponseEntity.ok(Map.of(
                "mailSenderImpl", impl,
                "mailHost", host == null ? "<null>" : host,
                "mailPort", port,
                "mailUsername", username,
                "dryRun", dryRun,
                "debugErrors", debugErrors
            ));
        } catch (Throwable t) {
            t.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "debug-failed", "message", t.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> receive(@RequestBody Map<String, Object> payload,
                                     @RequestHeader(value = "X-INTERNAL-AUTH", required = false) String header) {
        // If an internal secret is configured, require it
        if (expectedInternalSecret != null && !expectedInternalSecret.isBlank()) {
            if (header == null || !expectedInternalSecret.equals(header)) {
                System.out.println("[notification] rejected: invalid internal auth");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "forbidden"));
            }
        }
        System.out.println("[notification] received: " + payload);
        return ResponseEntity.ok(Map.of("status", "accepted"));
    }

    @PostMapping("/email")
    public ResponseEntity<?> sendEmail(@RequestBody SendEmailRequest req,
                                       @RequestHeader(value = "X-INTERNAL-AUTH", required = false) String header) {
        if (expectedInternalSecret != null && !expectedInternalSecret.isBlank()) {
            if (header == null || !expectedInternalSecret.equals(header)) {
                System.out.println("[notification] rejected email: invalid internal auth");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "forbidden"));
            }
        }

        try {
            System.out.println("[notification] /email received payload: " + req);
            System.out.println("[notification] header X-INTERNAL-AUTH present=" + (header != null));
            System.out.println("[notification] expectedInternalSecret configured=" + (expectedInternalSecret != null && !expectedInternalSecret.isBlank()));
            System.out.println("[notification] dryRun=" + dryRun + " debugErrors=" + debugErrors);
            try {
                String impl = mailSender != null ? mailSender.getClass().getName() : "<none>";
                System.out.println("[notification] mailSender impl=" + impl);
                if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
                    org.springframework.mail.javamail.JavaMailSenderImpl implObj = (org.springframework.mail.javamail.JavaMailSenderImpl) mailSender;
                    System.out.println("[notification] mailHost=" + implObj.getHost() + " mailPort=" + implObj.getPort() + " mailUser=" + implObj.getUsername());
                }
            } catch (Throwable t) { System.out.println("[notification] unable to inspect mailSender: " + t.getMessage()); }
        } catch (Throwable t) {}
        boolean sent = false;
        try {
            sent = emailService.sendFromTemplate(req);
        } catch (com.devbuild.notification.exception.EmailSendException ese) {
            try { System.err.println("[notification] email send exception: " + ese.getMessage()); } catch (Throwable ignore) {}
            if (debugErrors) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "reason", "send_failed", "error", ese.getMessage()));
            }
        } catch (Throwable t) {
            try { System.err.println("[notification] error while sending email: " + t.getMessage()); } catch (Throwable ignore) {}
        }
        if (sent) {
            try { System.out.println("[notification] email send returned: sent for to=" + req.getTo()); } catch (Throwable t) {}
            return ResponseEntity.ok(Map.of("status", "sent"));
        } else {
            try { System.out.println("[notification] email send returned: failed for to=" + req.getTo() + " template=" + req.getTemplateCode()); } catch (Throwable t) {}
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "reason", "send_failed"));
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<?> preview(@RequestBody SendEmailRequest req,
                                     @RequestHeader(value = "X-INTERNAL-AUTH", required = false) String header) {
        if (expectedInternalSecret != null && !expectedInternalSecret.isBlank()) {
            if (header == null || !expectedInternalSecret.equals(header)) {
                System.out.println("[notification] rejected preview: invalid internal auth");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "forbidden"));
            }
        }

        try {
            var preview = emailService.renderPreview(req);
            return ResponseEntity.ok(preview);
        } catch (Throwable t) {
            t.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "preview failed"));
        }
    }

    @PostMapping("/email/raw")
    public ResponseEntity<?> sendRawEmail(@RequestBody RawEmailRequest req,
                                          @RequestHeader(value = "X-INTERNAL-AUTH", required = false) String header) {
        if (expectedInternalSecret != null && !expectedInternalSecret.isBlank()) {
            if (header == null || !expectedInternalSecret.equals(header)) {
                System.out.println("[notification] rejected raw email: invalid internal auth");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "forbidden"));
            }
        }
        try {
            System.out.println("[notification] /email/raw received payload: " + req);
            System.out.println("[notification] header X-INTERNAL-AUTH present=" + (header != null));
            System.out.println("[notification] dryRun=" + dryRun + " debugErrors=" + debugErrors);
            try {
                String impl = mailSender != null ? mailSender.getClass().getName() : "<none>";
                System.out.println("[notification] mailSender impl=" + impl);
                if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
                    org.springframework.mail.javamail.JavaMailSenderImpl implObj = (org.springframework.mail.javamail.JavaMailSenderImpl) mailSender;
                    System.out.println("[notification] mailHost=" + implObj.getHost() + " mailPort=" + implObj.getPort() + " mailUser=" + implObj.getUsername());
                }
            } catch (Throwable t) { System.out.println("[notification] unable to inspect mailSender: " + t.getMessage()); }
        } catch (Throwable t) {}

        boolean sent = false;
        try {
            sent = emailService.sendRaw(req.getTo(), req.getSubject(), req.getBody());
        } catch (com.devbuild.notification.exception.EmailSendException ese) {
            try { System.err.println("[notification] email send exception: " + ese.getMessage()); } catch (Throwable ignore) {}
            if (debugErrors) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "reason", "send_failed", "error", ese.getMessage()));
            }
        } catch (Throwable t) {
            try { System.err.println("[notification] error while sending raw email: " + t.getMessage()); } catch (Throwable ignore) {}
        }
        if (sent) {
            try { System.out.println("[notification] raw email send returned: sent for to=" + req.getTo()); } catch (Throwable t) {}
            return ResponseEntity.ok(Map.of("status", "sent"));
        } else {
            try { System.out.println("[notification] raw email send returned: failed for to=" + req.getTo()); } catch (Throwable t) {}
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "reason", "send_failed"));
        }
    }

    @PostMapping("/email/with-attachments")
    public ResponseEntity<?> sendEmailWithAttachments(
            @org.springframework.web.bind.annotation.RequestParam("to") String to,
            @org.springframework.web.bind.annotation.RequestParam("subject") String subject,
            @org.springframework.web.bind.annotation.RequestParam("body") String body,
            @org.springframework.web.bind.annotation.RequestParam(value = "attachments", required = false) org.springframework.web.multipart.MultipartFile[] attachments,
            @RequestHeader(value = "X-INTERNAL-AUTH", required = false) String header) {
        
        if (expectedInternalSecret != null && !expectedInternalSecret.isBlank()) {
            if (header == null || !expectedInternalSecret.equals(header)) {
                System.out.println("[notification] rejected email with attachments: invalid internal auth");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "forbidden"));
            }
        }

        try {
            System.out.println("[notification] /email/with-attachments received: to=" + to + " subject=" + subject + " attachmentCount=" + (attachments != null ? attachments.length : 0));
            
            java.util.Map<String, byte[]> attachmentMap = new java.util.HashMap<>();
            if (attachments != null && attachments.length > 0) {
                for (org.springframework.web.multipart.MultipartFile file : attachments) {
                    String filename = file.getOriginalFilename();
                    byte[] content = file.getBytes();
                    attachmentMap.put(filename, content);
                    System.out.println("[notification] Received attachment: " + filename + " (" + content.length + " bytes)");
                }
            }

            boolean sent = emailService.sendWithAttachments(to, subject, body, attachmentMap);
            
            if (sent) {
                System.out.println("[notification] email with attachments sent successfully to=" + to);
                return ResponseEntity.ok(Map.of("status", "sent", "attachmentCount", attachmentMap.size()));
            } else {
                System.out.println("[notification] email with attachments failed for to=" + to);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "reason", "send_failed"));
            }
        } catch (Exception e) {
            System.err.println("[notification] error sending email with attachments: " + e.getMessage());
            e.printStackTrace();
            if (debugErrors) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("status", "failed", "reason", "exception"));
        }
    }
}

