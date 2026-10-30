package in.soro.backend.config;

import java.util.Arrays;
import java.util.List;
import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    private final List<String> allowedOrigins;

    public CorsConfig(@Value("${app.cors.allowed-origins}") String origins) {
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .map(CorsConfig::validateOrigin)
                .toList();
        if (allowedOrigins.isEmpty()) {
            throw new IllegalArgumentException("CORS_ALLOWED_ORIGINS must contain at least one origin.");
        }
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept")
                .allowCredentials(false)
                .maxAge(3600);
    }

    private static String validateOrigin(String origin) {
        URI uri;
        try {
            uri = URI.create(origin);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("CORS_ALLOWED_ORIGINS must contain exact HTTP or HTTPS origins.");
        }
        if (!List.of("http", "https").contains(uri.getScheme())
                || uri.getHost() == null
                || uri.getRawUserInfo() != null
                || uri.getRawQuery() != null
                || uri.getRawFragment() != null
                || (uri.getRawPath() != null && !uri.getRawPath().isEmpty())
                || uri.getPort() > 65_535
                || !uri.toString().equals(origin)) {
            throw new IllegalArgumentException("CORS_ALLOWED_ORIGINS must contain exact HTTP or HTTPS origins.");
        }
        return origin;
    }
}
