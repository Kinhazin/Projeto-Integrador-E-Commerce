package br.senac.integrador.projeto.controller;

import br.senac.integrador.projeto.model.Produto;
import br.senac.integrador.projeto.model.ProdutoImagem;
import br.senac.integrador.projeto.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Listar todos
    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    // Buscar por nome (contém, case-insensitive)
    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }

    // Buscar por status
    @GetMapping("/status/{status}")
    public List<Produto> buscarPorStatus(@PathVariable String status) {
        return produtoRepository.findByStatus(status);
    }

    // Buscar por preço máximo
    @GetMapping("/preco/ate")
    public List<Produto> buscarPorPrecoMax(@RequestParam("valor") Double valor) {
        return produtoRepository.findByPrecoLessThanEqual(valor);
    }

    // Buscar por estoque maior que X
    @GetMapping("/estoque/maior-que")
    public List<Produto> buscarPorEstoqueMaiorQue(@RequestParam("quantidade") Integer quantidade) {
        return produtoRepository.findByQuantidadeEstoqueGreaterThan(quantidade);
    }

    // Criar produto
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        produto.setId(null); // garante que será insert
        if (produto.getStatus() == null || produto.getStatus().isBlank()) {
            produto.setStatus("ATIVO");
        }
        Produto salvo = produtoRepository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // Atualizar produto
    @PutMapping("/{id}")
    public Produto atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produto.setNome(produtoAtualizado.getNome());
                    produto.setAvaliacao(produtoAtualizado.getAvaliacao());
                    produto.setDescricao(produtoAtualizado.getDescricao());
                    produto.setPreco(produtoAtualizado.getPreco());
                    produto.setQuantidadeEstoque(produtoAtualizado.getQuantidadeEstoque());
                    produto.setStatus(produtoAtualizado.getStatus());
                    // Caso queira atualizar as imagens por PUT completo:
                    // produto.setImagens(produtoAtualizado.getImagens());
                    return produtoRepository.save(produto);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    // Atualizar apenas o status (PATCH)
    @PatchMapping("/{id}/status")
    public Produto atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    produto.setStatus(status);
                    return produtoRepository.save(produto);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    // Deletar produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado");
        }
        produtoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ------- Imagens por URL -------

    // Listar imagens do produto
    @GetMapping("/{id}/imagens")
    public List<ProdutoImagem> listarImagens(@PathVariable Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        return produto.getImagens();
    }

    // Adicionar várias imagens via URLs
    @PostMapping("/{id}/imagens/urls")
    public Produto adicionarImagensPorUrl(@PathVariable Long id, @RequestBody List<String> urls) {
        if (urls == null || urls.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "É necessário enviar ao menos uma URL");
        }

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        int ordemBase = produto.getImagens() != null ? produto.getImagens().size() : 0;
        boolean jaTemPrincipal = produto.getImagens().stream().anyMatch(ProdutoImagem::getPrincipal);

        for (int i = 0; i < urls.size(); i++) {
            String url = urls.get(i);
            if (url == null || url.isBlank()) continue;

            boolean principal = !jaTemPrincipal && i == 0; // define a primeira como principal se ainda não houver
            ProdutoImagem img = new ProdutoImagem(url, null, ordemBase + i, principal);
            produto.addImagem(img);
        }

        return produtoRepository.save(produto);
    }

    // Remover uma imagem específica do produto
    @DeleteMapping("/{id}/imagens/{imagemId}")
    public Produto removerImagem(@PathVariable Long id, @PathVariable Long imagemId) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        ProdutoImagem imagem = produto.getImagens().stream()
                .filter(i -> i.getId().equals(imagemId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem não encontrada"));

        produto.removeImagem(imagem);
        return produtoRepository.save(produto);
    }
}
