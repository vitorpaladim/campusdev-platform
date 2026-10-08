package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.projetos_dto.AtualizacaoProjeto;
import ev.campus_dev.api.dtos.projetos_dto.CadastroProjeto;
import ev.campus_dev.api.models.cliente.Cliente;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.repositories.ClienteRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final ClienteRepository clienteRepository;

    public ProjetoService(ProjetoRepository projetoRepository, ClienteRepository clienteRepository) {
        this.projetoRepository = projetoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public Projeto cadastrar(Long clienteId, CadastroProjeto dados) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        Projeto projeto = new Projeto(dados);
        projeto.setCliente(cliente);
        return projetoRepository.save(projeto);
    }

    public List<Projeto> listar() {
        return projetoRepository.findAll();
    }

    public Optional<Projeto> buscar(Long id) {
        return projetoRepository.findById(id);
    }

    @Transactional
    public Optional<Projeto> atualizar(Long id, AtualizacaoProjeto dados) {
        return projetoRepository.findById(id)
                .map(projeto -> {
                    projeto.atualizarProjeto(dados);
                    return projetoRepository.save(projeto);
                });
    }

    @Transactional
    public boolean deletar(Long id) {
        return projetoRepository.findById(id)
                .map(projeto -> {
                    projetoRepository.delete(projeto);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public Optional<Projeto> alterarStatus(Long id, String novoStatus) {
        return projetoRepository.findById(id).map(projeto -> {
            String atual = projeto.getStatus();
            if (!transicaoPermitida(atual, novoStatus)) {
                throw new BusinessException("Transição de status inválida: " + atual + " -> " + novoStatus);
            }
            projeto.setStatus(novoStatus);
            return projetoRepository.save(projeto);
        });
    }

    private boolean transicaoPermitida(String atual, String novoStatus) {
        return ("ABERTO".equals(atual) && "EM_SELECAO".equals(novoStatus))
                || ("EM_SELECAO".equals(atual) && "EM_ANDAMENTO".equals(novoStatus))
                || ("EM_ANDAMENTO".equals(atual) && "FINALIZADO".equals(novoStatus))
                || ("ABERTO".equals(atual) && "CANCELADO".equals(novoStatus))
                || ("EM_SELECAO".equals(atual) && "CANCELADO".equals(novoStatus));
    }
}
