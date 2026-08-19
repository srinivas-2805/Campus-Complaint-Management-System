package com.ccms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.seed")
public record SeedProperties(List<AdminSeed> admins) {

    public record AdminSeed(String name, String email, String password) {
    }
}
