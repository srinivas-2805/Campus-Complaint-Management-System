package com.ccms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Mirrors the end of server.js:
 *   app.use(express.static(path.join(__dirname, "../client/build")));
 *   app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../client/build/index.html")));
 *
 * To use this, build the React app and copy client/build (or client/dist) contents into
 * src/main/resources/static/ before packaging - Spring Boot serves static/ automatically,
 * and any non-API, non-file route below falls back to index.html for React Router.
 * If you deploy the frontend separately (e.g. its own static host), you can delete this class.
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{path:^(?!api|health).*$}").setViewName("forward:/index.html");
        registry.addViewController("/{path:^(?!api|health).*$}/**").setViewName("forward:/index.html");
    }
}
