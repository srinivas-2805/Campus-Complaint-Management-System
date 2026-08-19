package com.ccms.dto;

import com.ccms.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

// Shape used for faculty listing / faculty creation responses: mirrors Mongoose's default
// toJSON (which emits "_id"), used by ManageFaculty.jsx / FacultyList.jsx (f._id).
// The password hash is intentionally omitted (the original createFaculty response leaked it).
@Builder
public record UserSummaryDto(
        @JsonProperty("_id") String id,
        String name,
        String email,
        String role,
        String department
) {
    public static UserSummaryDto from(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .build();
    }
}
