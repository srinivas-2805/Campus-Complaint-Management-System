package com.ccms.dto;

public record CreateComplaintRequest(String title, String description, String department, String urgency) {
}
