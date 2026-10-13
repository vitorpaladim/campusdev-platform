package ev.campus_dev.api.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todos os endpoints
                .allowedOrigins(Arrays.stream(frontendUrl.split(","))
                        .map(String::trim)
                        .filter(origin -> !origin.isBlank())
                        .toArray(String[]::new))
                .allowedOriginPatterns("https://campus-dev-api-teste-*-vitorpaladims-projects.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}