package br.com.backend.backend.controller;

import br.com.backend.backend.model.Produto;
import br.com.backend.backend.model.ProdutoImagem;
import br.com.backend.backend.repository.ProdutoRepository;
import br.com.backend.backend.service.ProdutosService;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutosService ProdutosService;

    // Listar todos
    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> criarProdutoComUpload(
            @RequestParam("nome") String nome,
            @RequestParam("descricao") String descricao,
            @RequestParam("preco") Double preco,
            @RequestParam("avaliacao") Double avaliacao,
            @RequestParam("quantidadeEstoque") Integer quantidadeEstoque,
            @RequestParam("status") String status,
            @RequestParam("imagens") List<MultipartFile> imagens) {

        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setAvaliacao(avaliacao);
        produto.setQuantidadeEstoque(quantidadeEstoque);
        produto.setStatus(status);

        // Salva cada imagem e gera a URL
        for (MultipartFile arquivo : imagens) {
            String url = ProdutosService.salvarArquivo(arquivo);
            ProdutoImagem img = new ProdutoImagem(url, null, 0, false);
            produto.addImagem(img);
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
                    return produtoRepository.save(produto);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    // Atualizar apenas o status (PATCH)
    @PatchMapping("/{id}/status")
    public Produto atualizarStatus(@PathVariable Long id) {
        return produtoRepository.findById(id)
                .map(produto -> {
                    String novoStatus = produto.getStatus().equalsIgnoreCase("ativo") ? "inativo" : "ativo";
                    produto.setStatus(novoStatus);
                    return produtoRepository.save(produto);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    @PostMapping(value = "/com-imagens/{id}/adicionar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public Produto adicionarImagens(
            @PathVariable Long id,
            @RequestParam("imagens") List<MultipartFile> imagens) {

        return produtoRepository.findById(id)
                .map(produto -> {
                    for (MultipartFile arquivo : imagens) {

                        String url = ProdutosService.salvarArquivo(arquivo);
                        ProdutoImagem img = new ProdutoImagem(url, null, 0, false);
                        produto.addImagem(img);
                    }
                    return produtoRepository.save(produto);
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    @GetMapping("/{id}")
    public Optional<Produto> acharProId(@RequestParam("id") Long id) {
        return produtoRepository.findById(id);
    }

    @GetMapping("/por-pessoa/{idPessoa}")
    public ResponseEntity<List<Produto>> buscarPorPessoa(@PathVariable Long idPessoa) {
        List<Produto> produtos = produtoRepository.buscarPorIdPessoa(idPessoa);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/por-pedido/{idPedido}")
    public ResponseEntity<List<Produto>> buscarPorPedido(@PathVariable Long idPedido) {
        List<Produto> produtos = ProdutosService.buscarProdutosPorIdPedido(idPedido);
        return ResponseEntity.ok(produtos);
    }

}
