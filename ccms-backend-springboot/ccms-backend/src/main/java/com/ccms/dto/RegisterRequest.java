package com.ccms.dto;

import jakarta.validation.constraints.NotBlank;

// Note: the original Express controller did no field validation beyond "exists in body";
// we only require non-blank name/email/password to avoid NPEs, without adding new constraints
// (e.g. email format) that the old API didn't enforce.
public record RegisterRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Email is required") String email,
        @NotBlank(message = "Password is required") String password,
        String role
) {
}
