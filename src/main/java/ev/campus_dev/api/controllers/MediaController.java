package ev.campus_dev.api.controllers;

import ev.campus_dev.api.dtos.media.MediaUploadResponse;
import ev.campus_dev.api.models.media.ArquivoMedia;
import ev.campus_dev.api.services.MediaService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/media")
public class MediaController {
    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaUploadResponse> upload(@RequestPart("arquivo") MultipartFile arquivo,
                                                       @RequestParam String tipo,
                                                       Authentication authentication) {
        return ResponseEntity.status(201).body(mediaService.upload(arquivo, tipo.toUpperCase(), authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> buscar(@PathVariable Long id) {
        ArquivoMedia media = mediaService.buscar(id);
        MediaType contentType = MediaType.parseMediaType(media.getContentType());
        return ResponseEntity.ok()
                .contentType(contentType)
                .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic())
                .body(media.getDados());
    }
}
