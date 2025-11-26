package com.devbuild.notification.repository;

import com.devbuild.notification.model.EmailTemplate;
import com.devbuild.notification.model.TypeNotification;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class InMemoryEmailTemplateRepository implements EmailTemplateRepository {

    private final Map<String, EmailTemplate> templates = new HashMap<>();

    @PostConstruct
    public void init() {
        // CONFIRM_EMAIL template
        EmailTemplate confirm = new EmailTemplate();
        confirm.setId(1L);
        confirm.setCode("CONFIRM_EMAIL");
        confirm.setSujet("Confirmez votre adresse email");
        confirm.setCorps("Bonjour ${fullname},\n\nMerci pour votre inscription. Veuillez vérifier votre adresse email pour activer votre compte.\n\nOption 1 : Cliquez sur ce lien de confirmation :\n${link}\n\nOption 2 : Saisissez le code de vérification suivant sur la page de connexion :\nCode : ${code}\n\nCe code expire dans 15 minutes. Si vous n'êtes pas à l'origine de cette création de compte, ignorez simplement ce message.\n\nCordialement,\nL'équipe Support");
        confirm.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        confirm.setVariables("fullname,link,code,token");
        confirm.setDateModification(LocalDateTime.now());
        templates.put(confirm.getCode(), confirm);

        // RESET_PASSWORD template
        EmailTemplate reset = new EmailTemplate();
        reset.setId(2L);
        reset.setCode("RESET_PASSWORD");
        reset.setSujet("Réinitialisation de votre mot de passe");
        reset.setCorps("Bonjour ${fullname},\n\nVous avez demandé la réinitialisation de votre mot de passe. Vous pouvez utiliser ce lien : ${link}\nou ce code : ${code} (valable 15 minutes).\nSi vous n'avez pas demandé, ignorez ce message.\n\nCordialement,\nL'équipe");
        reset.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        reset.setVariables("fullname,link,token,code");
        reset.setDateModification(LocalDateTime.now());
        templates.put(reset.getCode(), reset);

        // VERIFY_CODE template
        EmailTemplate verify = new EmailTemplate();
        verify.setId(3L);
        verify.setCode("VERIFY_CODE");
        verify.setSujet("Votre code de vérification");
        verify.setCorps("Bonjour ${fullname},\n\nVotre code de vérification est : ${code}\nIl est valable pendant 15 minutes.\n\nSi vous n'avez pas demandé ce code, ignorez ce message.\n\nCordialement,\nL'équipe");
        verify.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        verify.setVariables("fullname,code,link");
        verify.setDateModification(LocalDateTime.now());
        templates.put(verify.getCode(), verify);

        // PASSWORD_CHANGED template
        EmailTemplate pwdChanged = new EmailTemplate();
        pwdChanged.setId(4L);
        pwdChanged.setCode("PASSWORD_CHANGED");
        pwdChanged.setSujet("Votre mot de passe a été modifié");
        pwdChanged.setCorps("Bonjour ${fullname},\n\nVotre mot de passe a été modifié avec succès. Si vous n'avez pas initié ce changement, contactez le support immédiatement.\n\nCordialement,\nL'équipe");
        pwdChanged.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        pwdChanged.setVariables("fullname");
        pwdChanged.setDateModification(LocalDateTime.now());
        templates.put(pwdChanged.getCode(), pwdChanged);

        // EMAIL_CHANGE_VERIFY template
        EmailTemplate emailChange = new EmailTemplate();
        emailChange.setId(5L);
        emailChange.setCode("EMAIL_CHANGE_VERIFY");
        emailChange.setSujet("Vérification de changement d'email");
        emailChange.setCorps("Bonjour ${fullname},\n\nVous avez demandé à changer votre adresse email de ${currentEmail} vers ${newEmail}.\n\nVeuillez saisir le code de vérification suivant pour confirmer ce changement :\nCode : ${code}\n\nCe code est valable pendant 15 minutes.\n\nSi vous n'avez pas demandé ce changement, ignorez ce message et votre email actuel restera inchangé.\n\nCordialement,\nL'équipe");
        emailChange.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        emailChange.setVariables("fullname,code,newEmail,currentEmail");
        emailChange.setDateModification(LocalDateTime.now());
        templates.put(emailChange.getCode(), emailChange);

        // ROLE_REQUEST_APPROVED template
        EmailTemplate roleApproved = new EmailTemplate();
        roleApproved.setId(6L);
        roleApproved.setCode("role-request-approved");
        roleApproved.setSujet("Demande de rôle approuvée");
        roleApproved.setCorps("Bonjour ${userName},\n\nNous avons le plaisir de vous informer que votre demande pour le rôle ${role} a été approuvée.\n\nRaison : ${reason}\n\nVous pouvez maintenant accéder à votre tableau de bord avec vos nouvelles permissions.\n\nCordialement,\nL'équipe d'administration");
        roleApproved.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        roleApproved.setVariables("userName,role,reason");
        roleApproved.setDateModification(LocalDateTime.now());
        templates.put(roleApproved.getCode(), roleApproved);

        // ROLE_REQUEST_REJECTED template
        EmailTemplate roleRejected = new EmailTemplate();
        roleRejected.setId(7L);
        roleRejected.setCode("role-request-rejected");
        roleRejected.setSujet("Demande de rôle rejetée");
        roleRejected.setCorps("Bonjour ${userName},\n\nNous regrettons de vous informer que votre demande pour le rôle ${role} a été rejetée.\n\nRaison : ${reason}\n\nSi vous avez des questions ou souhaitez plus d'informations, n'hésitez pas à contacter l'administration.\n\nCordialement,\nL'équipe d'administration");
        roleRejected.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        roleRejected.setVariables("userName,role,reason");
        roleRejected.setDateModification(LocalDateTime.now());
        templates.put(roleRejected.getCode(), roleRejected);

        // ROLE_REQUEST_MESSAGE template
        EmailTemplate roleMessage = new EmailTemplate();
        roleMessage.setId(8L);
        roleMessage.setCode("role-request-message");
        roleMessage.setSujet("Message de l'administration concernant votre demande");
        roleMessage.setCorps("Bonjour ${userName},\n\nL'administration a envoyé un message concernant votre demande pour le rôle ${role} :\n\n${message}\n\nEnvoyé par : ${adminName}\n\nVous pouvez consulter l'état de votre demande sur votre page de profil.\n\nCordialement,\nL'équipe d'administration");
        roleMessage.setTypeNotification(TypeNotification.INSCRIPTION_SOUMISE);
        roleMessage.setVariables("userName,role,message,adminName");
        roleMessage.setDateModification(LocalDateTime.now());
        templates.put(roleMessage.getCode(), roleMessage);
    }

    @Override
    public Optional<EmailTemplate> findByCode(String code) {
        return Optional.ofNullable(templates.get(code));
    }
}
