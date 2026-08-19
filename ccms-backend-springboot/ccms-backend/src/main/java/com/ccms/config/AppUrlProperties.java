package com.ccms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppUrlProperties(String frontendUrl) {
}
