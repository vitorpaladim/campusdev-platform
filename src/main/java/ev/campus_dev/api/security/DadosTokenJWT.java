package ev.campus_dev.api.security;

import ev.campus_dev.api.models.usuario.Usuario;

public record DadosTokenJWT (String token, Usuario usuario){
}
