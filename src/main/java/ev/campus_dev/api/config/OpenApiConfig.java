package ev.campus_dev.api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI campusDevOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("CampusDev API").version("v1")
                        .description("""
                                API REST para conexão entre clientes e desenvolvedores.
                                Rotas protegidas usam o header Authorization: Bearer <JWT>.
                                Login e registro são públicos; projetos podem ser consultados publicamente.
                                """))
                .addServersItem(new Server().url("/").description("Servidor atual"))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP)
                                .scheme("bearer").bearerFormat("JWT")));
    }
}
