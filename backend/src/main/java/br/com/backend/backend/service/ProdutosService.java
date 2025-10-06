package br.com.backend.backend.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProdutosService {

    public String salvarArquivo(MultipartFile arquivo) {
        try {
            String pastaUploads = System.getProperty("user.dir") + "/uploads/";

            File pasta = new File(pastaUploads);
            if (!pasta.exists()) {
                pasta.mkdirs();
            }

            String nomeArquivo = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
            Path caminho = Paths.get(pastaUploads + nomeArquivo);

            Files.copy(arquivo.getInputStream(), caminho, StandardCopyOption.REPLACE_EXISTING);

            return "http://localhost:8080/uploads/" + nomeArquivo;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

}
