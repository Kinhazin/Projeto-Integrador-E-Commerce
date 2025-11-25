package br.com.backend.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import br.com.backend.backend.model.Produto;

import java.io.InputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import br.com.backend.backend.repository.ProdutoRepository;

@Service
public class ProdutosService {

    private final Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");

    @Autowired
    private ProdutoRepository produtoRepository;

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

    public Produto buscarPorId(Long id) {
        Optional<Produto> resultado = produtoRepository.findById(id);

        // A forma correta de usar o Optional
        return resultado.orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
    }

    public List<Produto> buscarProdutosPorIdPedido(Long idPedido) {
        List<Produto> produtos = produtoRepository.buscarPorIdPedido(idPedido);

        if (produtos.isEmpty()) {
            throw new RuntimeException("Nenhum produto encontrado para o pedido " + idPedido);
        }
        return produtos;
    }

}
