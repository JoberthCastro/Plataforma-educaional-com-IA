import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentView() {
  // Perfil do aluno mocado
  const alunoId = 'aluno1';
  const alunoNome = 'Ana Souza';
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [atividadeAdaptada, setAtividadeAdaptada] = useState(null);
  const [loadingAdaptacao, setLoadingAdaptacao] = useState(false);

  // Buscar atividades atribuídas ao aluno mocado
  useEffect(() => {
    const listaIds = JSON.parse(localStorage.getItem(`atividades_aluno_${alunoId}`) || '[]');
    const atividadesDetalhes = listaIds.map(atividadeId => {
      const atividade = localStorage.getItem(`atividade_${atividadeId}`);
      return atividade ? JSON.parse(atividade) : null;
    }).filter(Boolean);
    setAtividades(atividadesDetalhes);
  }, []);

  // Handler para selecionar uma atividade
  const handleSelecionarAtividade = (atividade) => {
    setAtividadeSelecionada(atividade);
    setAtividadeAdaptada(null); // Sempre volta para o original ao selecionar
    // Inicializa respostas vazias
    const respostasIniciais = {};
    atividade.campos.forEach(campo => {
      if (campo.tipo === 'checkbox') {
        respostasIniciais[campo.id] = [];
      } else {
        respostasIniciais[campo.id] = '';
      }
    });
    setRespostas(respostasIniciais);
  };

  // Handler para responder campos
  const handleResposta = (campoId, valor) => {
    setRespostas(prev => ({ ...prev, [campoId]: valor }));
  };

  // Handler para checkbox
  const handleCheckbox = (campoId, opcao) => {
    setRespostas(prev => {
      const atual = prev[campoId] || [];
      if (atual.includes(opcao)) {
        return { ...prev, [campoId]: atual.filter(v => v !== opcao) };
      } else {
        return { ...prev, [campoId]: [...atual, opcao] };
      }
    });
  };

  // Handler para enviar respostas
  const handleEnviar = () => {
    localStorage.setItem(`respostas_${alunoId}_${atividadeSelecionada.id}`, JSON.stringify(respostas));
    alert('Respostas enviadas com sucesso!');
    setAtividadeSelecionada(null);
    setAtividadeAdaptada(null);
  };

  // Função para adaptar atividade
  async function adaptarAtividade(tipo) {
    setLoadingAdaptacao(true);
    try {
      const campos = atividadeSelecionada.campos;
      const camposAdaptados = [];
      for (const campo of campos) {
        const endpoint = tipo === 'TDAH' ? '/adaptar-tdah' : '/adaptar-dislexia';
        const response = await axios.post('http://localhost:8000' + endpoint, {
          questao: campo.label
        });
        camposAdaptados.push({ ...campo, label: response.data.questao_adaptada });
      }
      setAtividadeAdaptada({ ...atividadeSelecionada, campos: camposAdaptados });
    } catch (e) {
      alert('Erro ao adaptar atividade');
    }
    setLoadingAdaptacao(false);
  }

  if (atividadeSelecionada) {
    // Verifica se já respondeu
    const respostaSalva = localStorage.getItem(`respostas_${alunoId}_${atividadeSelecionada.id}`);
    if (respostaSalva) {
      return (
        <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '98vw', maxWidth: 1800, padding: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/images/logo-undb.png" alt="Logo UNDB" style={{ width: 80, height: 80, borderRadius: 18, marginBottom: 24 }} />
            <h2 style={{ fontWeight: 700, fontSize: 48, color: '#2563eb', marginBottom: 24, textAlign: 'center' }}>{atividadeSelecionada.titulo}</h2>
            <div style={{ color: '#d946ef', fontSize: 32, marginBottom: 40, textAlign: 'center', fontWeight: 600 }}>Você já respondeu esta atividade.</div>
            <button onClick={() => setAtividadeSelecionada(null)} style={{ background: '#e5e7eb', color: '#333', padding: '24px 80px', border: 'none', borderRadius: 14, fontWeight: 600, fontSize: 28, cursor: 'pointer', transition: 'background 0.2s' }}>Voltar</button>
          </div>
        </div>
      );
    }
    // Exibir datas se existirem
    const dataAtividade = atividadeSelecionada.campos.find(c => c.data)?.data || atividadeSelecionada.data;
    const dataLimite = atividadeSelecionada.campos.find(c => c.dataLimite)?.dataLimite || atividadeSelecionada.dataLimite;
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '98vw', maxWidth: 1800, padding: 0 }}>
          {/* Cabeçalho da prova */}
          <div style={{ background: '#2563eb', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '48px 100px 32px 100px', color: '#fff', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <img src="/images/logo-undb.png" alt="Logo UNDB" style={{ width: 80, height: 80, borderRadius: 18, marginBottom: 10 }} />
            <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center' }}>{atividadeSelecionada.titulo}</div>
            <div style={{ fontSize: 26, fontWeight: 400, textAlign: 'center', marginBottom: 6 }}>Aluno: <b>{alunoNome}</b></div>
            {dataAtividade && <div style={{ fontSize: 22 }}>Data da Atividade: {dataAtividade}</div>}
            {dataLimite && <div style={{ fontSize: 22 }}>Data Limite: {dataLimite}</div>}
          </div>
          {/* Instruções */}
          <div style={{ padding: '48px 100px 0 100px' }}>
            {atividadeSelecionada.descricao && (
              <div style={{ color: '#2563eb', fontSize: 28, marginBottom: 48, background: '#e0e7ff', borderRadius: 12, padding: 32, fontWeight: 600, textAlign: 'center', border: '2px solid #2563eb' }}>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>Instruções: </span>{atividadeSelecionada.descricao}
              </div>
            )}
            {/* Botões de adaptação */}
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', margin: '32px 0' }}>
              <button
                onClick={() => adaptarAtividade('TDAH')}
                disabled={loadingAdaptacao}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  padding: '18px 48px',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 22,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px #2563eb22',
                  transition: 'background 0.2s'
                }}
              >
                {loadingAdaptacao ? 'Adaptando...' : 'Adaptar para TDAH'}
              </button>
              <button
                onClick={() => adaptarAtividade('DISLEXIA')}
                disabled={loadingAdaptacao}
                style={{
                  background: '#d946ef',
                  color: '#fff',
                  padding: '18px 48px',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 22,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px #e6007e22',
                  transition: 'background 0.2s'
                }}
              >
                {loadingAdaptacao ? 'Adaptando...' : 'Adaptar para Dislexia'}
              </button>
              {atividadeAdaptada && (
                <button
                  onClick={() => setAtividadeAdaptada(null)}
                  style={{
                    background: '#e5e7eb',
                    color: '#333',
                    padding: '12px 32px',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: 'pointer',
                    marginLeft: 16
                  }}
                >
                  Voltar para original
                </button>
              )}
            </div>
          </div>
          {/* Questões */}
          <form onSubmit={e => { e.preventDefault(); handleEnviar(); }} style={{ padding: '0 100px 100px 100px' }}>
            {(atividadeAdaptada ? atividadeAdaptada.campos : atividadeSelecionada.campos).map((campo, idx) => (
              <div key={campo.id} style={{ background: '#f9fafb', borderRadius: 18, boxShadow: '0 4px 24px #2563eb22', marginBottom: 64, padding: '56px 56px 38px 56px', display: 'flex', flexDirection: 'column', gap: 28, border: '2px solid #d946ef' }}>
                <div style={{ fontWeight: 700, fontSize: 36, marginBottom: 16, textAlign: 'center', color: '#d946ef' }}>Questão {idx + 1}</div>
                <div style={{ fontWeight: 600, fontSize: 28, marginBottom: 24, textAlign: 'center', color: '#222' }}>{campo.label}</div>
                {(campo.tipo === 'texto' || campo.tipo === 'paragrafo' || campo.tipo === 'parágrafo') && (
                  <textarea
                    value={respostas[campo.id] || ''}
                    onChange={e => handleResposta(campo.id, e.target.value)}
                    style={{ width: '100%', padding: 32, borderRadius: 12, border: '2px solid #b3b3b3', minHeight: 260, fontSize: 26, resize: 'vertical', background: '#f7f9fa', marginTop: 8, lineHeight: 1.7 }}
                    placeholder="Digite sua resposta aqui..."
                  />
                )}
                {campo.tipo === 'numero' && (
                  <input
                    type="number"
                    value={respostas[campo.id] || ''}
                    onChange={e => handleResposta(campo.id, e.target.value)}
                    style={{ width: 340, padding: 22, borderRadius: 12, border: '2px solid #b3b3b3', fontSize: 26, background: '#f7f9fa', marginTop: 8 }}
                    placeholder="Digite um número"
                  />
                )}
                {campo.tipo === 'multipla' && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {campo.opcoes.map(op => (
                      <label key={op.id} style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 26, fontWeight: 500, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={campo.id}
                          value={op.text}
                          checked={respostas[campo.id] === op.text}
                          onChange={() => handleResposta(campo.id, op.text)}
                          style={{ accentColor: '#2563eb', width: 36, height: 36 }}
                        /> {op.text}
                      </label>
                    ))}
                  </div>
                )}
                {campo.tipo === 'checkbox' && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {campo.opcoes.map(op => (
                      <label key={op.id} style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 26, fontWeight: 500, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          value={op.text}
                          checked={respostas[campo.id]?.includes(op.text)}
                          onChange={() => handleCheckbox(campo.id, op.text)}
                          style={{ accentColor: '#2563eb', width: 36, height: 36 }}
                        /> {op.text}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 60, justifyContent: 'center', marginTop: 64 }}>
              <button type="submit" style={{ background: '#d946ef', color: '#fff', padding: '32px 100px', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 32, cursor: 'pointer', boxShadow: '0 2px 12px #e6007e22', letterSpacing: 0.5, transition: 'background 0.2s' }}>Enviar Respostas</button>
              <button type="button" onClick={() => setAtividadeSelecionada(null)} style={{ background: '#e5e7eb', color: '#333', padding: '32px 100px', border: 'none', borderRadius: 14, fontWeight: 600, fontSize: 32, cursor: 'pointer', transition: 'background 0.2s' }}>Voltar</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
      <div style={{ width: '100%' }}>
        <h2 style={{ fontWeight: 700, fontSize: 54, color: '#2563eb', marginBottom: 28, textAlign: 'center' }}>Olá, {alunoNome}!</h2>
        <h3 style={{ fontWeight: 600, fontSize: 38, color: '#d946ef', marginBottom: 60, textAlign: 'center', letterSpacing: 0.5 }}>Suas Atividades</h3>
        {atividades.length === 0 ? (
          <p style={{ color: '#888', fontSize: 32, textAlign: 'center' }}>Nenhuma atividade disponível no momento.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 44 }}>
            {atividades.map(atividade => (
              <li key={atividade.id} style={{ border: '3px solid #d946ef', borderRadius: 18, padding: 60, background: '#fafbfc', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 2px 18px #d946ef11', fontSize: 32, fontWeight: 600, textAlign: 'center' }} onClick={() => handleSelecionarAtividade(atividade)}>
                <b style={{ fontSize: 38 }}>{atividade.titulo}</b>
                <div style={{ color: '#888', fontSize: 24, marginTop: 18 }}>{atividade.descricao}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentView; 