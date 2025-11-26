package com.devbuild.inscription.service;

import com.devbuild.inscription.model.enums.TypePieceJointe;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class FileStorageService {

    private final Path root;
    private final List<String> allowedMime = Arrays.asList(
        "application/pdf", 
        "image/jpeg", 
        "image/jpg", 
        "image/png",
        "image/gif"
    );
    private final long maxSize = 10 * 1024 * 1024; // 10MB
    
    // Allowed extensions mapped to MIME types
    private final Map<String, List<String>> extensionToMime = new HashMap<>();

    public FileStorageService() throws IOException {
        this.root = Path.of(System.getProperty("user.dir"), "inscription-service-uploads");
        Files.createDirectories(root);
        
        // Initialize extension to MIME mapping
        extensionToMime.put("pdf", Arrays.asList("application/pdf"));
        extensionToMime.put("jpg", Arrays.asList("image/jpeg", "image/jpg"));
        extensionToMime.put("jpeg", Arrays.asList("image/jpeg", "image/jpg"));
        extensionToMime.put("png", Arrays.asList("image/png"));
        extensionToMime.put("gif", Arrays.asList("image/gif"));
    }

    public String store(MultipartFile file) throws IOException {
        return store(file, null);
    }

    public String store(MultipartFile file, TypePieceJointe typePiece) throws IOException {
        // Basic validation
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Fichier vide");
        }
        
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("Fichier trop volumineux (maximum " + (maxSize / 1024 / 1024) + " MB)");
        }
        
        // Content type validation
        String contentType = file.getContentType();
        if (contentType == null || !allowedMime.contains(contentType)) {
            throw new IllegalArgumentException("Type de fichier non autorisé: " + contentType + 
                ". Types autorisés: PDF, JPG, PNG");
        }
        
        // File extension validation
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("Nom de fichier invalide");
        }
        
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!extensionToMime.containsKey(extension)) {
            throw new IllegalArgumentException("Extension de fichier non autorisée: ." + extension);
        }
        
        // Verify extension matches MIME type
        List<String> expectedMimeTypes = extensionToMime.get(extension);
        if (!expectedMimeTypes.contains(contentType)) {
            throw new IllegalArgumentException("Le type MIME ne correspond pas à l'extension du fichier");
        }
        
        // Type-specific validation
        if (typePiece != null) {
            validateDocumentType(typePiece, extension, file.getSize());
        }

        // Generate unique filename
        String filename = System.currentTimeMillis() + "-" + 
            UUID.randomUUID().toString() + "-" + sanitizeFilename(originalFilename);
        Path target = root.resolve(filename);
        
        // Store the file
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return target.toAbsolutePath().toString();
    }
    
    /**
     * Validates document based on its type
     */
    private void validateDocumentType(TypePieceJointe type, String extension, long fileSize) {
        switch (type) {
            case DIPLOME:
            case CERTIFICAT_SCOLARITE:
            case ATTESTATION:
                // These documents should preferably be PDF
                if (!extension.equals("pdf")) {
                    // Allow but could warn
                }
                break;
            case PHOTO_IDENTITE:
            case CARTE_IDENTITE:
                // These should be images
                if (!Arrays.asList("jpg", "jpeg", "png").contains(extension)) {
                    throw new IllegalArgumentException("Les photos doivent être au format JPG ou PNG");
                }
                break;
            case CV:
            case LETTRE_MOTIVATION:
                // Should be PDF
                if (!extension.equals("pdf")) {
                    // Allow but could warn
                }
                break;
            case AUTRE:
                // No specific validation for other types
                break;
        }
    }
    
    /**
     * Gets file extension from filename
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot == -1 || lastDot == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDot + 1);
    }
    
    /**
     * Sanitizes filename to prevent path traversal attacks
     */
    private String sanitizeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
    
    /**
     * Deletes a file from storage
     */
    public void delete(String path) throws IOException {
        Path file = Path.of(path);
        if (Files.exists(file)) {
            Files.delete(file);
        }
    }

}
