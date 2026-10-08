package ev.campus_dev.api.services;

import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class MatchingService {
    private final ProjetoRepository projetoRepository;
    private final DesenvolvedorRepository desenvolvedorRepository;

    public MatchingService(ProjetoRepository projetoRepository, DesenvolvedorRepository desenvolvedorRepository) {
        this.projetoRepository = projetoRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
    }

    public List<Desenvolvedor> ranquear(Long projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
        List<String> requisitos = termos(projeto.getLinguagemTecnologia());
        return desenvolvedorRepository.findAll().stream()
                .sorted(Comparator.comparingInt((Desenvolvedor dev) -> compatibilidade(requisitos, dev.getSkills()))
                        .reversed())
                .toList();
    }

    private int compatibilidade(List<String> requisitos, String skills) {
        if (requisitos.isEmpty() || skills == null || skills.isBlank()) {
            return 0;
        }
        List<String> disponiveis = termos(skills);
        long atendidas = requisitos.stream().filter(disponiveis::contains).count();
        return (int) ((atendidas * 100) / requisitos.size());
    }

    private List<String> termos(String valor) {
        if (valor == null || valor.isBlank()) {
            return List.of();
        }
        return Arrays.stream(valor.split("[,;]"))
                .map(item -> item.trim().toLowerCase(Locale.ROOT))
                .filter(item -> !item.isBlank())
                .toList();
    }
}
