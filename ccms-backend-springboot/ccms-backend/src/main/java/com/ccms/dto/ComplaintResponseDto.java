package com.ccms.dto;

import com.ccms.model.Complaint;
import com.ccms.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.time.Instant;

@Builder
public record ComplaintResponseDto(
        @JsonProperty("_id") String id,
        String title,
        String description,
        String department,
        String urgency,
        String status,
        String progress,
        StudentInfo student,
        Instant createdAt,
        Instant updatedAt
) {

    @Builder
    public record StudentInfo(@JsonProperty("_id") String id, String name, String email) {
        public static StudentInfo from(User user) {
            if (user == null) return null;
            return StudentInfo.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).build();
        }
    }

    public static ComplaintResponseDto from(Complaint complaint, User student) {
        return ComplaintResponseDto.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .department(complaint.getDepartment())
                .urgency(complaint.getUrgency())
                .status(complaint.getStatus())
                .progress(complaint.getProgress())
                .student(StudentInfo.from(student))
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
