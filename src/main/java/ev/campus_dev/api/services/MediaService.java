package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.media.MediaUploadResponse;
import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import ev.campus_dev.api.models.cliente.Cliente;
import ev.campus_dev.api.models.media.ArquivoMedia;
import ev.campus_dev.api.models.media.ArquivoMediaRepository;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.UsuarioRepository;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Service
public class MediaService {
    private static final long MAX_BYTES = 10 * 1024 * 1024;
    private static final Set<String> IMAGE_TYPES = Set.of(MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, "image/webp");
    private static final Set<String> ATTACHMENT_TYPES = Set.of("application/pdf", "text/plain", "text/markdown", "application/zip", "application/x-zip-compressed", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private final ArquivoMediaRepository mediaRepository;
    private final UsuarioRepository usuarioRepository;

    public MediaService(ArquivoMediaRepository mediaRepository, UsuarioRepository usuarioRepository) {
        this.mediaRepository = mediaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public MediaUploadResponse upload(MultipartFile arquivo, String tipo, Authentication authentication) {
        if (arquivo == null || arquivo.isEmpty()) throw new BusinessException("Selecione uma imagem");
        if (arquivo.getSize() > MAX_BYTES) throw new BusinessException("O arquivo deve ter no máximo 10 MB");
        boolean attachment = "PORTFOLIO_FILE".equals(tipo);
        Set<String> allowedTypes = attachment ? ATTACHMENT_TYPES : IMAGE_TYPES;
        if (!allowedTypes.contains(arquivo.getContentType())) throw new BusinessException(attachment ? "Formato inválido. Use PDF, TXT, MD, DOCX ou ZIP" : "Formato inválido. Use JPG, PNG ou WebP");
        if (!Set.of("AVATAR", "BANNER", "LOGO", "PORTFOLIO_FILE").contains(tipo)) throw new BusinessException("Tipo de mídia inválido");

        Usuario proprietario = usuarioRepository.findByEmail(authentication.getName());
        if (proprietario == null) throw new ResourceNotFoundException("Usuário não encontrado");
        if ("LOGO".equals(tipo) && !(proprietario instanceof Cliente)) {
            throw new BusinessException("Apenas empresas podem enviar logo");
        }

        try {
            ArquivoMedia media = new ArquivoMedia();
            media.setProprietario(proprietario);
            media.setTipo(tipo);
            media.setNomeOriginal(arquivo.getOriginalFilename());
            media.setContentType(arquivo.getContentType());
            media.setDados(arquivo.getBytes());
            ArquivoMedia salvo = mediaRepository.save(media);
            String url = "/media/" + salvo.getId();
            if ("AVATAR".equals(tipo)) proprietario.setAvatarUrl(url);
            if ("BANNER".equals(tipo)) proprietario.setBannerUrl(url);
            if ("LOGO".equals(tipo)) ((Cliente) proprietario).setLogoUrl(url);
            usuarioRepository.save(proprietario);
            return new MediaUploadResponse(salvo.getId(), tipo, url);
        } catch (IOException exception) {
            throw new BusinessException("Não foi possível ler a imagem");
        }
    }

    @Transactional(readOnly = true)
    public ArquivoMedia buscar(Long id) {
        return mediaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Imagem não encontrada"));
    }
}
