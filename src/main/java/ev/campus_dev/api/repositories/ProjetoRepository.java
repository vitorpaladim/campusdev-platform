package ev.campus_dev.api.repositories;


import ev.campus_dev.api.models.projeto.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    List<Projeto> findAllByOrderByDestaqueDescDataDeCadastroDesc();
}
