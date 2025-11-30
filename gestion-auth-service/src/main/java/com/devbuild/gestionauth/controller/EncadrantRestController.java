package com.devbuild.gestionauth.controller;

import com.devbuild.gestionauth.model.User;
import com.devbuild.gestionauth.repository.UserRepository;
import com.devbuild.gestionauth.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/encadrant")
public class EncadrantRestController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Value("${upload.path:uploads}")
    private String uploadPath;

    public EncadrantRestController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ENCADRANT', 'ADMIN')")
    public ResponseEntity<?> getProfile(Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("bio", user.getBio());
        profile.put("phone", user.getPhone());
        profile.put("etablissement", user.getEtablissement());
        profile.put("laboratoire", user.getLaboratoire());
        profile.put("specialite", user.getSpecialite());
        profile.put("grade", user.getGrade());
        profile.put("domainesRecherche", user.getDomainesRecherche());
        profile.put("nombrePublications", user.getNombrePublications());
        profile.put("hIndex", user.getHIndex());
        profile.put("orcidId", user.getOrcidId());
        profile.put("linkedinUrl", user.getLinkedinUrl());
        profile.put("portfolioUrl", user.getPortfolioUrl());
        profile.put("researchGateUrl", user.getResearchGateUrl());
        profile.put("googleScholarUrl", user.getGoogleScholarUrl());
        profile.put("cvUrl", user.getCvUrl());
        profile.put("avatarUrl", user.getAvatarUrl());

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ENCADRANT', 'ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates, Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        // Update fields if provided
        if (updates.containsKey("firstName")) user.setFirstName((String) updates.get("firstName"));
        if (updates.containsKey("lastName")) user.setLastName((String) updates.get("lastName"));
        if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));
        if (updates.containsKey("bio")) user.setBio((String) updates.get("bio"));
        if (updates.containsKey("phone")) user.setPhone((String) updates.get("phone"));
        if (updates.containsKey("etablissement")) user.setEtablissement((String) updates.get("etablissement"));
        if (updates.containsKey("laboratoire")) user.setLaboratoire((String) updates.get("laboratoire"));
        if (updates.containsKey("specialite")) user.setSpecialite((String) updates.get("specialite"));
        if (updates.containsKey("grade")) user.setGrade((String) updates.get("grade"));
        if (updates.containsKey("domainesRecherche")) user.setDomainesRecherche((String) updates.get("domainesRecherche"));
        if (updates.containsKey("nombrePublications")) user.setNombrePublications(updates.get("nombrePublications") != null ? Integer.parseInt(updates.get("nombrePublications").toString()) : null);
        if (updates.containsKey("hIndex")) user.setHIndex(updates.get("hIndex") != null ? Integer.parseInt(updates.get("hIndex").toString()) : null);
        if (updates.containsKey("orcidId")) user.setOrcidId((String) updates.get("orcidId"));
        if (updates.containsKey("linkedinUrl")) user.setLinkedinUrl((String) updates.get("linkedinUrl"));
        if (updates.containsKey("portfolioUrl")) user.setPortfolioUrl((String) updates.get("portfolioUrl"));
        if (updates.containsKey("researchGateUrl")) user.setResearchGateUrl((String) updates.get("researchGateUrl"));
        if (updates.containsKey("googleScholarUrl")) user.setGoogleScholarUrl((String) updates.get("googleScholarUrl"));

        User saved = userRepository.save(user);

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", saved.getId());
        profile.put("firstName", saved.getFirstName());
        profile.put("lastName", saved.getLastName());
        profile.put("email", saved.getEmail());
        profile.put("role", saved.getRole());
        profile.put("bio", saved.getBio());
        profile.put("phone", saved.getPhone());
        profile.put("etablissement", saved.getEtablissement());
        profile.put("laboratoire", saved.getLaboratoire());
        profile.put("specialite", saved.getSpecialite());
        profile.put("grade", saved.getGrade());
        profile.put("domainesRecherche", saved.getDomainesRecherche());
        profile.put("nombrePublications", saved.getNombrePublications());
        profile.put("hIndex", saved.getHIndex());
        profile.put("orcidId", saved.getOrcidId());
        profile.put("linkedinUrl", saved.getLinkedinUrl());
        profile.put("portfolioUrl", saved.getPortfolioUrl());
        profile.put("researchGateUrl", saved.getResearchGateUrl());
        profile.put("googleScholarUrl", saved.getGoogleScholarUrl());
        profile.put("cvUrl", saved.getCvUrl());
        profile.put("avatarUrl", saved.getAvatarUrl());

        return ResponseEntity.ok(profile);
    }

    @PostMapping("/avatar")
    @PreAuthorize("hasAnyAuthority('ENCADRANT', 'ADMIN')")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        try {
            String userId = String.valueOf(user.getId());
            Path avatarDir = Paths.get(uploadPath, "avatars", userId);
            Files.createDirectories(avatarDir);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = "avatar_" + UUID.randomUUID().toString() + extension;
            Path targetPath = avatarDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = "/uploads/avatars/" + userId + "/" + filename;
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl, "url", avatarUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to upload avatar"));
        }
    }

    @PostMapping("/cv")
    @PreAuthorize("hasAnyAuthority('ENCADRANT', 'ADMIN')")
    public ResponseEntity<?> uploadCv(@RequestParam("file") MultipartFile file, Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        try {
            String userId = String.valueOf(user.getId());
            Path cvDir = Paths.get(uploadPath, "cv", userId);
            Files.createDirectories(cvDir);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = "cv_" + UUID.randomUUID().toString() + extension;
            Path targetPath = cvDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String cvUrl = "/uploads/cv/" + userId + "/" + filename;
            user.setCvUrl(cvUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("cvUrl", cvUrl, "url", cvUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to upload CV"));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('ENCADRANT', 'ADMIN')")
    public ResponseEntity<?> getStats(Principal principal) {
        // Placeholder stats - you can implement real queries later
        Map<String, Object> stats = new HashMap<>();
        stats.put("doctorants", 0);
        stats.put("soutenances", 0);
        stats.put("publications", 0);

        return ResponseEntity.ok(stats);
    }
}
