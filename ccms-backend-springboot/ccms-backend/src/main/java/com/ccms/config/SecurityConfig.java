package com.ccms.config;

import com.ccms.security.JwtAuthFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;

/**
 * Replaces:
 *  - app.use(cors({...}))           -> corsConfigurationSource()
 *  - middleware/authMiddleware.js   -> JwtAuthFilter wired into the chain
 *  - authorize("admin")/("faculty") -> route-level hasRole(...) below
 *
 * Fine-grained checks that depend on request data (e.g. "faculty can only touch
 * their own department's complaints") are kept in the controllers/services, exactly
 * like the original Express controllers did.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsProperties corsProperties;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // matches bcrypt.hash(password, 10) in Node
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    objectMapper.writeValueAsString(Map.of("message", "Not authorized, no token")));
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    objectMapper.writeValueAsString(Map.of("message", "Access denied")));
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight must never require auth (mirrors cors() auto-handling OPTIONS in Express)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public
                        .requestMatchers(HttpMethod.GET, "/health").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login",
                                "/api/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/auth/reset-password/**").permitAll()
                        // student stub routes had no auth middleware in the original app
                        .requestMatchers("/api/student/**").permitAll()

                        // Static SPA assets / index.html fallback (see SpaWebConfig) - no auth,
                        // matching express.static() serving the React build unauthenticated
                        .requestMatchers(HttpMethod.GET, "/", "/index.html", "/assets/**", "/static/**",
                                "/*.png", "/*.ico", "/*.svg", "/*.js", "/*.css",
                                "/{path:^(?!api|health).*$}", "/{path:^(?!api|health).*$}/**").permitAll()

                        // Admin-only
                        .requestMatchers(HttpMethod.POST, "/api/auth/faculty").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/auth/faculty/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Faculty-only
                        .requestMatchers("/api/faculty/**").hasRole("FACULTY")

                        // Everything else just needs a valid token; role/ownership checks happen in controllers
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(corsProperties.allowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Content-Type", "Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
