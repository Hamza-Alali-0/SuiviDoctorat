package com.devbuild.inscription.service;

import com.devbuild.inscription.model.DossierInscription;
import com.devbuild.inscription.model.CampagneInscription;
import com.devbuild.inscription.model.Doctorant;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for generating PDF documents related to PhD registration
 */
@Service
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Generate attestation d'inscription PDF
     */
    public byte[] generateAttestationInscription(DossierInscription dossier) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        StringBuilder content = new StringBuilder();
        content.append("%PDF-1.4\n");
        content.append("1 0 obj\n");
        content.append("<< /Type /Catalog /Pages 2 0 R >>\n");
        content.append("endobj\n");
        content.append("2 0 obj\n");
        content.append("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n");
        content.append("endobj\n");
        content.append("3 0 obj\n");
        content.append("<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\n");
        content.append("endobj\n");
        content.append("4 0 obj\n");
        content.append("<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>\n");
        content.append("endobj\n");
        content.append("5 0 obj\n");
        
        // Build the content text
        String contentText = buildAttestationContent(dossier);
        content.append("<< /Length ").append(contentText.length()).append(" >>\n");
        content.append("stream\n");
        content.append(contentText);
        content.append("\nendstream\n");
        content.append("endobj\n");
        
        // Add cross-reference table and trailer
        content.append("xref\n");
        content.append("0 6\n");
        content.append("0000000000 65535 f \n");
        content.append("0000000009 00000 n \n");
        content.append("0000000058 00000 n \n");
        content.append("0000000115 00000 n \n");
        content.append("0000000214 00000 n \n");
        content.append("0000000370 00000 n \n");
        content.append("trailer\n");
        content.append("<< /Size 6 /Root 1 0 R >>\n");
        content.append("startxref\n");
        content.append("470\n");
        content.append("%%EOF\n");
        
        baos.write(content.toString().getBytes("ISO-8859-1"));
        return baos.toByteArray();
    }
    
    private String buildAttestationContent(DossierInscription dossier) {
        Doctorant doctorant = dossier.getDoctorant();
        CampagneInscription campagne = dossier.getCampagne();
        
        StringBuilder sb = new StringBuilder();
        sb.append("BT\n");
        sb.append("/F2 18 Tf\n");
        sb.append("100 700 Td\n");
        sb.append("(ATTESTATION D'INSCRIPTION) Tj\n");
        sb.append("ET\n");
        
        sb.append("BT\n");
        sb.append("/F1 12 Tf\n");
        sb.append("100 650 Td\n");
        
        if (campagne != null && campagne.getEtablissement() != null) {
            sb.append("(Etablissement: ").append(escapeForPdf(campagne.getEtablissement())).append(") Tj\n");
        } else {
            sb.append("(Etablissement: Universite) Tj\n");
        }
        
        sb.append("0 -20 Td\n");
        if (campagne != null && campagne.getEcoleDoctorale() != null) {
            sb.append("(Ecole Doctorale: ").append(escapeForPdf(campagne.getEcoleDoctorale())).append(") Tj\n");
        }
        
        sb.append("0 -40 Td\n");
        sb.append("(Nous soussigne, directeur de l'etablissement,) Tj\n");
        sb.append("0 -20 Td\n");
        sb.append("(certifions que:) Tj\n");
        
        sb.append("0 -40 Td\n");
        sb.append("/F2 12 Tf\n");
        String nom = doctorant != null ? doctorant.getNom() : "";
        String prenom = doctorant != null ? doctorant.getPrenom() : "";
        sb.append("(").append(escapeForPdf(prenom)).append(" ").append(escapeForPdf(nom)).append(") Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F1 12 Tf\n");
        if (doctorant != null && doctorant.getEmail() != null) {
            sb.append("(Email: ").append(escapeForPdf(doctorant.getEmail())).append(") Tj\n");
        }
        
        sb.append("0 -30 Td\n");
        sb.append("(est dument inscrit\\(e\\) en doctorat pour l'annee) Tj\n");
        sb.append("0 -20 Td\n");
        if (campagne != null && campagne.getAnneeUniversitaire() != null) {
            sb.append("(universitaire ").append(escapeForPdf(campagne.getAnneeUniversitaire())).append(") Tj\n");
        }
        
        sb.append("0 -40 Td\n");
        if (dossier.getSujetThese() != null) {
            sb.append("(Sujet de these: ").append(escapeForPdf(dossier.getSujetThese())).append(") Tj\n");
        }
        
        sb.append("0 -30 Td\n");
        if (dossier.getDirecteurThese() != null) {
            sb.append("(Directeur de these: ").append(escapeForPdf(dossier.getDirecteurThese())).append(") Tj\n");
        }
        
        sb.append("0 -30 Td\n");
        if (dossier.getLaboratoire() != null) {
            sb.append("(Laboratoire: ").append(escapeForPdf(dossier.getLaboratoire())).append(") Tj\n");
        }
        
        sb.append("0 -50 Td\n");
        String date = LocalDateTime.now().format(DATE_FORMATTER);
        sb.append("(Date d'emission: ").append(date).append(") Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("(Numero de dossier: ").append(dossier.getId() != null ? dossier.getId().toString() : "N/A").append(") Tj\n");
        
        sb.append("ET\n");
        return sb.toString();
    }

    /**
     * Generate autorisation de soutenance PDF
     */
    public byte[] generateAutorisationSoutenance(DossierInscription dossier) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        StringBuilder content = new StringBuilder();
        content.append("%PDF-1.4\n");
        content.append("1 0 obj\n");
        content.append("<< /Type /Catalog /Pages 2 0 R >>\n");
        content.append("endobj\n");
        content.append("2 0 obj\n");
        content.append("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n");
        content.append("endobj\n");
        content.append("3 0 obj\n");
        content.append("<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\n");
        content.append("endobj\n");
        content.append("4 0 obj\n");
        content.append("<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>\n");
        content.append("endobj\n");
        content.append("5 0 obj\n");
        
        String contentText = buildAutorisationContent(dossier);
        content.append("<< /Length ").append(contentText.length()).append(" >>\n");
        content.append("stream\n");
        content.append(contentText);
        content.append("\nendstream\n");
        content.append("endobj\n");
        
        content.append("xref\n");
        content.append("0 6\n");
        content.append("0000000000 65535 f \n");
        content.append("0000000009 00000 n \n");
        content.append("0000000058 00000 n \n");
        content.append("0000000115 00000 n \n");
        content.append("0000000214 00000 n \n");
        content.append("0000000370 00000 n \n");
        content.append("trailer\n");
        content.append("<< /Size 6 /Root 1 0 R >>\n");
        content.append("startxref\n");
        content.append("470\n");
        content.append("%%EOF\n");
        
        baos.write(content.toString().getBytes("ISO-8859-1"));
        return baos.toByteArray();
    }
    
    private String buildAutorisationContent(DossierInscription dossier) {
        Doctorant doctorant = dossier.getDoctorant();
        CampagneInscription campagne = dossier.getCampagne();
        
        StringBuilder sb = new StringBuilder();
        sb.append("BT\n");
        sb.append("/F2 18 Tf\n");
        sb.append("100 700 Td\n");
        sb.append("(AUTORISATION DE SOUTENANCE) Tj\n");
        sb.append("ET\n");
        
        sb.append("BT\n");
        sb.append("/F1 12 Tf\n");
        sb.append("100 650 Td\n");
        
        if (campagne != null && campagne.getEtablissement() != null) {
            sb.append("(Etablissement: ").append(escapeForPdf(campagne.getEtablissement())).append(") Tj\n");
        }
        
        sb.append("0 -20 Td\n");
        if (campagne != null && campagne.getEcoleDoctorale() != null) {
            sb.append("(Ecole Doctorale: ").append(escapeForPdf(campagne.getEcoleDoctorale())).append(") Tj\n");
        }
        
        sb.append("0 -40 Td\n");
        sb.append("(Le directeur de l'ecole doctorale autorise) Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 12 Tf\n");
        String nom = doctorant != null ? doctorant.getNom() : "";
        String prenom = doctorant != null ? doctorant.getPrenom() : "";
        sb.append("(").append(escapeForPdf(prenom)).append(" ").append(escapeForPdf(nom)).append(") Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F1 12 Tf\n");
        sb.append("(a soutenir sa these de doctorat intitulee:) Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 12 Tf\n");
        if (dossier.getSujetThese() != null) {
            sb.append("(").append(escapeForPdf(dossier.getSujetThese())).append(") Tj\n");
        }
        
        sb.append("0 -40 Td\n");
        sb.append("/F1 12 Tf\n");
        sb.append("(Sous la direction de:) Tj\n");
        sb.append("0 -20 Td\n");
        if (dossier.getDirecteurThese() != null) {
            sb.append("(").append(escapeForPdf(dossier.getDirecteurThese())).append(") Tj\n");
        }
        
        sb.append("0 -40 Td\n");
        if (dossier.getLaboratoire() != null) {
            sb.append("(Laboratoire: ").append(escapeForPdf(dossier.getLaboratoire())).append(") Tj\n");
        }
        
        sb.append("0 -50 Td\n");
        sb.append("(Date limite de soutenance: [A completer]) Tj\n");
        
        sb.append("0 -40 Td\n");
        String date = LocalDateTime.now().format(DATE_FORMATTER);
        sb.append("(Fait le ").append(date).append(") Tj\n");
        
        sb.append("0 -60 Td\n");
        sb.append("(Signature du directeur:) Tj\n");
        
        sb.append("ET\n");
        return sb.toString();
    }

    /**
     * Generate procès-verbal de soutenance (pre-filled template)
     */
    public byte[] generateProcesVerbalSoutenance(DossierInscription dossier) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        StringBuilder content = new StringBuilder();
        content.append("%PDF-1.4\n");
        content.append("1 0 obj\n");
        content.append("<< /Type /Catalog /Pages 2 0 R >>\n");
        content.append("endobj\n");
        content.append("2 0 obj\n");
        content.append("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n");
        content.append("endobj\n");
        content.append("3 0 obj\n");
        content.append("<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\n");
        content.append("endobj\n");
        content.append("4 0 obj\n");
        content.append("<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>\n");
        content.append("endobj\n");
        content.append("5 0 obj\n");
        
        String contentText = buildProcesVerbalContent(dossier);
        content.append("<< /Length ").append(contentText.length()).append(" >>\n");
        content.append("stream\n");
        content.append(contentText);
        content.append("\nendstream\n");
        content.append("endobj\n");
        
        content.append("xref\n");
        content.append("0 6\n");
        content.append("0000000000 65535 f \n");
        content.append("0000000009 00000 n \n");
        content.append("0000000058 00000 n \n");
        content.append("0000000115 00000 n \n");
        content.append("0000000214 00000 n \n");
        content.append("0000000370 00000 n \n");
        content.append("trailer\n");
        content.append("<< /Size 6 /Root 1 0 R >>\n");
        content.append("startxref\n");
        content.append("470\n");
        content.append("%%EOF\n");
        
        baos.write(content.toString().getBytes("ISO-8859-1"));
        return baos.toByteArray();
    }
    
    private String buildProcesVerbalContent(DossierInscription dossier) {
        Doctorant doctorant = dossier.getDoctorant();
        CampagneInscription campagne = dossier.getCampagne();
        
        StringBuilder sb = new StringBuilder();
        sb.append("BT\n");
        sb.append("/F2 16 Tf\n");
        sb.append("100 720 Td\n");
        sb.append("(PROCES-VERBAL DE SOUTENANCE DE THESE) Tj\n");
        sb.append("ET\n");
        
        sb.append("BT\n");
        sb.append("/F1 11 Tf\n");
        sb.append("100 680 Td\n");
        
        if (campagne != null && campagne.getEtablissement() != null) {
            sb.append("(Etablissement: ").append(escapeForPdf(campagne.getEtablissement())).append(") Tj\n");
        }
        
        sb.append("0 -18 Td\n");
        if (campagne != null && campagne.getEcoleDoctorale() != null) {
            sb.append("(Ecole Doctorale: ").append(escapeForPdf(campagne.getEcoleDoctorale())).append(") Tj\n");
        }
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Candidat\\(e\\):) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        String nom = doctorant != null ? doctorant.getNom() : "";
        String prenom = doctorant != null ? doctorant.getPrenom() : "";
        sb.append("(").append(escapeForPdf(prenom)).append(" ").append(escapeForPdf(nom)).append(") Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Titre de la these:) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        if (dossier.getSujetThese() != null) {
            sb.append("(").append(escapeForPdf(dossier.getSujetThese())).append(") Tj\n");
        }
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Directeur de these:) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        if (dossier.getDirecteurThese() != null) {
            sb.append("(").append(escapeForPdf(dossier.getDirecteurThese())).append(") Tj\n");
        }
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Composition du jury \\(a completer\\):) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        sb.append("(President: __________________________) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("(Rapporteur 1: ________________________) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("(Rapporteur 2: ________________________) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("(Examinateur: _________________________) Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Date et lieu de la soutenance:) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        sb.append("(Date: ____________  Lieu: ___________________) Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Resultat de la soutenance:) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        sb.append("([ ] Admis      [ ] Ajourne) Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("/F2 11 Tf\n");
        sb.append("(Mention:) Tj\n");
        sb.append("0 -18 Td\n");
        sb.append("/F1 11 Tf\n");
        sb.append("([ ] Tres Honorable  [ ] Honorable  [ ] Passable) Tj\n");
        
        sb.append("0 -40 Td\n");
        String date = LocalDateTime.now().format(DATE_FORMATTER);
        sb.append("(Etabli le ").append(date).append(") Tj\n");
        
        sb.append("0 -30 Td\n");
        sb.append("(Signatures du jury:) Tj\n");
        
        sb.append("ET\n");
        return sb.toString();
    }
    
    /**
     * Escape special characters for PDF text
     */
    private String escapeForPdf(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("(", "\\(")
                   .replace(")", "\\)")
                   .replace("\n", " ")
                   .replace("\r", "");
    }
}
