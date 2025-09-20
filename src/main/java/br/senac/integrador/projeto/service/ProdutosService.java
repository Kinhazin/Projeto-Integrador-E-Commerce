package br.senac.integrador.projeto.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProdutosService {

    public String salvarImagem(MultipartFile file) {
        try {
            String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destino = Paths.get("uploads/" + nomeArquivo);
            Files.createDirectories(destino.getParent());
            Files.write(destino, file.getBytes());
            return "/uploads/" + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagem", e);
        }
    }
}

