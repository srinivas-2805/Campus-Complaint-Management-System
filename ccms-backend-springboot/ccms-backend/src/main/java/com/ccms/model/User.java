package com.ccms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Mirrors server/models/User.js.
 * role is kept as a plain, lower-case string ("student" | "faculty" | "admin")
 * to stay byte-compatible with the existing Mongo documents and the React frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    @Builder.Default
    private String role = "student"; // student | faculty | admin

    private String department; // faculty's department

    private String resetToken;

    private Long resetTokenExpiry; // epoch millis, mirrors Date.now() based expiry in Node

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
