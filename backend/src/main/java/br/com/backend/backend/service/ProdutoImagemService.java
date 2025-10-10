package br.com.backend.backend.service;

import br.com.backend.backend.model.ProdutoImagem;
import br.com.backend.backend.repository.ProdutoImagemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class ProdutoImagemService {

    private final ProdutoImagemRepository imagemRepo;
    private final Path pastaImagens; 

    public ProdutoImagemService(
            ProdutoImagemRepository imagemRepo,
            @Value("${storage.imagens.dir:uploads/produtos}") String dirImagens) {
        this.imagemRepo = imagemRepo;
        this.pastaImagens = Path.of(dirImagens);
    }

    @Transactional
    public void deletarImagem(Long imagemId) {
        ProdutoImagem imagem = imagemRepo.findByIdWithProduto(imagemId)
                .orElseThrow(() -> new RuntimeException("Imagem não encontrada: id=" + imagemId));

        Long produtoId = imagem.getProduto().getId();

        apagarArquivoSeLocal(imagem.getUrl());

        boolean eraPrincipal = Boolean.TRUE.equals(imagem.getPrincipal());
        imagemRepo.delete(imagem);

        reordenarImagens(produtoId);

        if (eraPrincipal) {
            promoverOutraComoPrincipal(produtoId);
        }
    }

    private void apagarArquivoSeLocal(String url) {
        if (url == null || url.isBlank()) return;

        String lower = url.toLowerCase();
        boolean ehExterno = lower.startsWith("http://") || lower.startsWith("https://");
        if (ehExterno) return;

        try {
            Path caminho = pastaImagens.resolve(url).normalize();
            Files.deleteIfExists(caminho);
        } catch (Exception e) {
            System.err.println("[WARN] Falha ao apagar arquivo físico: " + e.getMessage());
        }
    }

    private void reordenarImagens(Long produtoId) {
        List<ProdutoImagem> restantes = imagemRepo.findAllByProduto_IdOrderByOrdemAsc(produtoId);
        int ordem = 1;
        for (ProdutoImagem img : restantes) {
            img.setOrdem(ordem++);
        }
        imagemRepo.saveAll(restantes);
    }

    public void promoverOutraComoPrincipal(Long produtoId) {
        imagemRepo.findByIdWithProduto(produtoId).ifPresent(img -> {
            img.setPrincipal(true);
            imagemRepo.save(img);
        });
    }
}