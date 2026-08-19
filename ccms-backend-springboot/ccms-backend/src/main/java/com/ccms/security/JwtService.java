package com.ccms.security;

import com.ccms.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

/**
 * Mirrors the jsonwebtoken usage in auth.controller.js:
 *   jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(JwtProperties jwtProperties) {
        // The Node secret is an arbitrary UTF-8 string (HMAC-SHA256 accepts any byte length there).
        // jjwt's HS256 requires >= 256-bit keys, so we derive a stable 256-bit key via SHA-256
        // of the configured secret. This keeps configuration compatible with the old .env value.
        this.key = deriveKey(jwtProperties.secret());
        this.expirationMs = jwtProperties.expirationMs();
    }

    private static SecretKey deriveKey(String secret) {
        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] digest = sha256.digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Unable to derive JWT signing key", e);
        }
    }

    public String generateToken(String userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(userId)
                .claim("id", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public Claims parseClaims(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
