import React, { useEffect, useState } from 'react';

// Lista de alunos fictícios (igual ao do formulário)
const alunosFicticios = [
  { id: 'aluno1', nome: 'Ana Souza' },
];

function ProfessorRespostas() {
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [respostasAlunos, setRespostasAlunos] = useState([]);

  // Buscar todas as atividades criadas
  useEffect(() => {
    // Busca todas as chaves de atividades no localStorage
    const atividadesKeys = Object.keys(localStorage).filter(k => k.startsWith('atividade_'));
    const atividadesList = atividadesKeys.map(k => JSON.parse(localStorage.getItem(k)));
    setAtividades(atividadesList);
  }, []);

  // Quando uma atividade é selecionada, buscar respostas dos alunos
  useEffect(() => {
    if (!atividadeSelecionada) return;
    const respostas = [];
    alunosFicticios.forEach(aluno => {
      const respostaJSON = localStorage.getItem(`respostas_${aluno.id}_${atividadeSelecionada.id}`);
      if (respostaJSON) {
        respostas.push({ aluno, resposta: JSON.parse(respostaJSON) });
      }
    });
    setRespostasAlunos(respostas);
  }, [atividadeSelecionada]);

  // Função para comparar respostas do aluno com o gabarito
  function compararRespostas(campo, respostaAluno) {
    if (campo.tipo === 'multipla') {
      return campo.respostasCorretas && campo.respostasCorretas[0] === respostaAluno;
    }
    if (campo.tipo === 'checkbox') {
      if (!Array.isArray(respostaAluno)) return false;
      const corretas = campo.respostasCorretas || [];
      return (
        corretas.length === respostaAluno.length &&
        corretas.every(r => respostaAluno.includes(r))
      );
    }
    if (campo.tipo === 'numero') {
      return campo.resposta && String(campo.resposta) === String(respostaAluno);
    }
    // Para texto, não há gabarito automático
    return null;
  }

  if (!atividadeSelecionada) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '90vw', maxWidth: 1600, minHeight: 600, padding: '60px 80px', margin: 40 }}>
          <h2 style={{ fontWeight: 700, fontSize: 44, color: '#2563eb', marginBottom: 40, textAlign: 'center' }}>Respostas dos Alunos</h2>
          <h3 style={{ fontWeight: 600, fontSize: 32, color: '#d946ef', marginBottom: 40, textAlign: 'center' }}>Selecione uma atividade:</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 40 }}>
            {atividades.map(atividade => (
              <li key={atividade.id} style={{ border: '2.5px solid #d946ef', borderRadius: 16, padding: 48, background: '#fafbfc', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 2px 12px #d946ef11', fontSize: 28, fontWeight: 600, textAlign: 'center' }} onClick={() => setAtividadeSelecionada(atividade)}>
                <b style={{ fontSize: 34 }}>{atividade.titulo}</b>
                <div style={{ color: '#888', fontSize: 22, marginTop: 12 }}>{atividade.descricao}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '90vw', maxWidth: 1600, minHeight: 600, padding: '60px 80px', margin: 40 }}>
        <button onClick={() => setAtividadeSelecionada(null)} style={{ marginBottom: 36, background: '#e5e7eb', color: '#333', padding: '20px 60px', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 26, cursor: 'pointer', transition: 'background 0.2s' }}>Voltar</button>
        <h2 style={{ fontWeight: 700, fontSize: 44, color: '#2563eb', marginBottom: 24 }}>{atividadeSelecionada.titulo}</h2>
        <p style={{ color: '#888', fontSize: 28, marginBottom: 40 }}>{atividadeSelecionada.descricao}</p>
        <h3 style={{ fontWeight: 600, fontSize: 32, color: '#d946ef', marginBottom: 40 }}>Respostas dos Alunos</h3>
        {respostasAlunos.length === 0 ? (
          <p style={{ color: '#888', fontSize: 28 }}>Nenhum aluno respondeu esta atividade ainda.</p>
        ) : (
          respostasAlunos.map(({ aluno, resposta }) => (
            <div key={aluno.id} style={{ border: '2.5px solid #2563eb', borderRadius: 16, padding: 48, marginBottom: 40, background: '#f9fafb', boxShadow: '0 2px 12px #2563eb11' }}>
              <b style={{ fontSize: 30 }}>{aluno.nome}</b>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 18, display: 'flex', flexDirection: 'column', gap: 24 }}>
                {atividadeSelecionada.campos.map(campo => {
                  const respostaAluno = resposta[campo.id];
                  const resultado = compararRespostas(campo, respostaAluno);
                  return (
                    <li key={campo.id} style={{ marginBottom: 10, background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px #0001', fontSize: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: 26, color: '#d946ef', marginBottom: 8 }}>{campo.label}</div>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ color: '#2563eb', fontWeight: 600 }}>Resposta do aluno: </span>
                        {campo.tipo === 'checkbox'
                          ? (Array.isArray(respostaAluno) ? respostaAluno.join(', ') : '-')
                          : (respostaAluno || '-')}
                      </div>
                      {resultado === true && <span style={{ color: 'green', fontWeight: 700, fontSize: 22 }}>✔ Correto</span>}
                      {resultado === false && <span style={{ color: 'red', fontWeight: 700, fontSize: 22 }}>✗ Incorreto</span>}
                      {resultado === null && <span style={{ color: '#888', fontSize: 20 }}>Resposta aberta</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfessorRespostas; 