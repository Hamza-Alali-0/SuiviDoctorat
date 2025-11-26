package com.devbuild.inscription.repository;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.List;

@Repository
public class UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Retrieve emails of users having the given role.
     * Uses a native query to match the existing `users` and `user_roles` tables.
     */
    public List<String> findEmailsByRole(String role) {
        if (role == null) return Collections.emptyList();
        try {
            // Build role candidates: exact role, add/remove ROLE_ prefix variant, and a LIKE fallback.
            java.util.List<String> candidates = new java.util.ArrayList<>();
            String trimmed = role.trim();
            candidates.add(trimmed);
            if (trimmed.startsWith("ROLE_")) {
                String without = trimmed.substring(5);
                if (!without.isEmpty() && !candidates.contains(without)) candidates.add(without);
            } else {
                String withRole = "ROLE_" + trimmed;
                if (!candidates.contains(withRole)) candidates.add(withRole);
            }

            final int batchSize = 500; // fetch in batches
            java.util.Set<String> resultSet = new java.util.LinkedHashSet<>();

            // First try exact matches for each candidate
            for (String cand : candidates) {
                String sql = "SELECT u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.roles = :role";
                int offset = 0;
                while (true) {
                    @SuppressWarnings("unchecked")
                    java.util.List<Object> partial = entityManager.createNativeQuery(sql)
                            .setParameter("role", cand)
                            .setFirstResult(offset)
                            .setMaxResults(batchSize)
                            .getResultList();
                    if (partial == null || partial.isEmpty()) break;
                    for (Object o : partial) {
                        if (o != null) {
                            String s = o.toString().trim();
                            if (!s.isEmpty()) resultSet.add(s);
                        }
                    }
                    if (partial.size() < batchSize) break; // last page
                    offset += partial.size();
                }
            }

            // If nothing found yet, try a case-insensitive LIKE match on the roles column
            if (resultSet.isEmpty()) {
                String sqlLike = "SELECT u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE UPPER(ur.roles) LIKE :likeRole";
                int offset = 0;
                String likeParam = "%" + trimmed.toUpperCase() + "%";
                while (true) {
                    @SuppressWarnings("unchecked")
                    java.util.List<Object> partial = entityManager.createNativeQuery(sqlLike)
                            .setParameter("likeRole", likeParam)
                            .setFirstResult(offset)
                            .setMaxResults(batchSize)
                            .getResultList();
                    if (partial == null || partial.isEmpty()) break;
                    for (Object o : partial) {
                        if (o != null) {
                            String s = o.toString().trim();
                            if (!s.isEmpty()) resultSet.add(s);
                        }
                    }
                    if (partial.size() < batchSize) break;
                    offset += partial.size();
                }
            }

            return new java.util.ArrayList<>(resultSet);
        } catch (Throwable t) {
            System.err.println("[UserRepository] Error fetching users by role: " + t.getMessage());
            return Collections.emptyList();
        }
    }
}
