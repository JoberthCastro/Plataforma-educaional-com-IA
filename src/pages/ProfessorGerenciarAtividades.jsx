import React, { useEffect, useState } from 'react';

const alunosFicticios = [
  { id: 'aluno1', nome: 'Ana Souza' },
  { id: 'aluno2', nome: 'Carlos Lima' },
];

function ProfessorGerenciarAtividades() {
  const [atividades, setAtividades] = useState([]);

  // Carregar todas as atividades do localStorage
  useEffect(() => {
    const atividadesKeys = Object.keys(localStorage).filter(k => k.startsWith('atividade_'));
    const atividadesList = atividadesKeys.map(k => JSON.parse(localStorage.getItem(k)));
    setAtividades(atividadesList);
  }, []);

  // Função para apagar uma atividade
  const handleApagar = (atividadeId) => {
    // Remover do localStorage
    localStorage.removeItem(`atividade_${atividadeId}`);
    // Remover da lista de atividades de cada aluno
    alunosFicticios.forEach(aluno => {
      const chave = `atividades_aluno_${aluno.id}`;
      const lista = JSON.parse(localStorage.getItem(chave) || '[]');
      const novaLista = lista.filter(id => id !== atividadeId);
      localStorage.setItem(chave, JSON.stringify(novaLista));
    });
    // Remover respostas dos alunos para essa atividade
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('respostas_') && k.endsWith(`_${atividadeId}`)) {
        localStorage.removeItem(k);
      }
    });
    // Atualizar lista na tela
    setAtividades(prev => prev.filter(a => a.id !== atividadeId));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '90vw', maxWidth: 1600, minHeight: 600, padding: '60px 80px', margin: 40 }}>
        <h2 style={{ fontWeight: 700, fontSize: 44, color: '#2563eb', marginBottom: 40, textAlign: 'center' }}>Gerenciar Atividades</h2>
        {atividades.length === 0 ? (
          <p style={{ color: '#888', fontSize: 28, textAlign: 'center' }}>Nenhuma atividade cadastrada.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 40 }}>
            {atividades.map(atividade => (
              <li key={atividade.id} style={{ border: '2.5px solid #d946ef', borderRadius: 16, padding: 48, background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px #d946ef11', fontSize: 26 }}>
                <div>
                  <b style={{ fontSize: 32 }}>{atividade.titulo}</b>
                  <div style={{ color: '#888', fontSize: 22, marginTop: 12 }}>{atividade.descricao}</div>
                </div>
                <button onClick={() => handleApagar(atividade.id)} style={{ background: '#d946ef', color: '#fff', padding: '20px 60px', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 26, cursor: 'pointer', boxShadow: '0 2px 8px #e6007e22', transition: 'background 0.2s' }}>Apagar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProfessorGerenciarAtividades; 