package com.ccms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

/**
 * Mirrors server/models/Complaint.js.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "complaints")
public class Complaint {

    @Id
    private String id;

    private String title;

    private String description;

    @Field("student")
    private String studentId; // reference to User._id

    @Builder.Default
    private String department = "General";

    @Builder.Default
    private String urgency = "low"; // low | medium | high | critical

    @Builder.Default
    private String status = "Pending"; // Pending | In Progress | Resolved | Rejected

    private String progress;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
