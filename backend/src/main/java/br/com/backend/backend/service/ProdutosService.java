package br.com.backend.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class ProdutosService {

    private final Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");

    public String salvarArquivo(MultipartFile arquivo) {
        try {
            if (arquivo == null || arquivo.isEmpty()) {
                throw new IllegalArgumentException("Arquivo vazio ou inexistente.");
            }

            Files.createDirectories(uploadDir);

            String original = StringUtils.cleanPath(Objects.requireNonNull(arquivo.getOriginalFilename()));
            String nomeArquivo = UUID.randomUUID() + "_" + original;

            Path destino = uploadDir.resolve(nomeArquivo);

            try (InputStream is = arquivo.getInputStream()) {
                Files.copy(is, destino, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/" + nomeArquivo;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage(), e);
        }
    }
}
