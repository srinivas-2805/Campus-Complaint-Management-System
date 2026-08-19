package com.ccms.dto;

import lombok.Builder;

@Builder
public record LoginResponse(String token, UserInfo user) {

    // Deliberately uses "id" (not "_id") to match the original:
    // res.json({ token, user: { id: user._id, name, email, role } })
    @Builder
    public record UserInfo(String id, String name, String email, String role) {
    }
}
