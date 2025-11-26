package com.devbuild.inscription.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private SecretKey jwtKey;

    @Value("${app.jwt.secret:}")
    public void setJwtSecret(String secret) {
        if (secret != null && !secret.isBlank()) {
            try {
                byte[] keyBytes;
                if (secret.startsWith("base64:")) {
                    keyBytes = java.util.Base64.getDecoder().decode(secret.substring(7));
                } else {
                    keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
                }
                if (keyBytes.length >= 32) {
                    this.jwtKey = Keys.hmacShaKeyFor(keyBytes);
                    System.out.println("[TokenAuthenticationFilter] JWT secret configured successfully");
                }
            } catch (Exception e) {
                System.err.println("[TokenAuthenticationFilter] Failed to configure JWT secret: " + e.getMessage());
            }
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String token = getTokenFromRequest(request);
        
        if (StringUtils.hasText(token)) {
            // Try to parse as JWT first
            if (jwtKey != null && !token.startsWith("dummy-token-for:")) {
                try {
                    Claims claims = Jwts.parserBuilder()
                            .setSigningKey(jwtKey)
                            .build()
                            .parseClaimsJws(token)
                            .getBody();
                    
                    String username = claims.getSubject();
                    String rolesStr = claims.get("roles", String.class);
                    
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    if (rolesStr != null && !rolesStr.isBlank()) {
                        authorities = Arrays.stream(rolesStr.split(","))
                                .filter(r -> !r.isBlank())
                                .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());
                    }
                    
                    if (!authorities.isEmpty()) {
                        UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(username, null, authorities);
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("[TokenAuthenticationFilter] Authenticated user: " + username + " with roles: " + authorities);
                    }
                } catch (Exception e) {
                    System.err.println("[TokenAuthenticationFilter] Failed to parse JWT: " + e.getMessage());
                }
            }
            // Fallback to dummy token for backward compatibility
            else if (token.startsWith("dummy-token-for:")) {
                String username = token.substring("dummy-token-for:".length());
                String role = determineRole(username);
                
                if (role != null) {
                    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + role)
                    );
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private String determineRole(String username) {
        // Simple role mapping based on username patterns
        if (username.contains("admin")) {
            return "ADMIN";
        } else if (username.contains("directeur") || username.contains("director")) {
            return "DIRECTEUR";
        } else if (username.contains("doctorant") || username.contains("student")) {
            return "DOCTORANT";
        }
        // Default role
        return "DOCTORANT";
    }
}