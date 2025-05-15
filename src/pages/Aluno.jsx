import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function Aluno() {
  const { id } = useParams();
  const [atividade, setAtividade] = useState(null);
  const [atividadeAdaptada, setAtividadeAdaptada] = useState(null);
  const [tipoAdaptacao, setTipoAdaptacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carrega a atividade original do localStorage
    const atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
    const atividadeAtual = atividades.find(a => a.id === id);
    if (atividadeAtual) {
      setAtividade(atividadeAtual);
    }
  }, [id]);

  const adaptarQuestao = async (tipo) => {
    if (!atividade) return;
    
    setLoading(true);
    setError(null);
    setTipoAdaptacao(tipo);

    try {
      const endpoint = tipo === 'TDAH' ? '/adaptar-tdah' : '/adaptar-dislexia';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        questao: atividade.questao
      });

      // Cria uma cópia da atividade original com a questão adaptada
      const atividadeAdaptada = {
        ...atividade,
        questao: response.data.questao_adaptada,
        tipoAdaptacao: tipo
      };

      setAtividadeAdaptada(atividadeAdaptada);
    } catch (err) {
      setError('Erro ao adaptar a questão. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestao = () => {
    const questaoAtual = atividadeAdaptada || atividade;
    if (!questaoAtual) return null;

    return (
      <div className="questao-container">
        <h2>{questaoAtual.titulo}</h2>
        <div className="questao-texto">
          {questaoAtual.questao}
        </div>
        {questaoAtual.opcoes && (
          <div className="opcoes">
            {questaoAtual.opcoes.map((opcao, index) => (
              <div key={index} className="opcao">
                <input
                  type={questaoAtual.tipo === 'multipla_escolha' ? 'radio' : 'checkbox'}
                  name="resposta"
                  value={opcao}
                  id={`opcao-${index}`}
                />
                <label htmlFor={`opcao-${index}`}>{opcao}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="aluno-container">
      <h1>Atividade</h1>
      
      {atividade && (
        <div className="botoes-adaptacao">
          <button 
            onClick={() => adaptarQuestao('TDAH')}
            disabled={loading}
            className={tipoAdaptacao === 'TDAH' ? 'ativo' : ''}
          >
            {loading && tipoAdaptacao === 'TDAH' ? 'Adaptando...' : 'Adaptar para TDAH'}
          </button>
          
          <button 
            onClick={() => adaptarQuestao('DISLEXIA')}
            disabled={loading}
            className={tipoAdaptacao === 'DISLEXIA' ? 'ativo' : ''}
          >
            {loading && tipoAdaptacao === 'DISLEXIA' ? 'Adaptando...' : 'Adaptar para Dislexia'}
          </button>
        </div>
      )}

      {error && <div className="erro">{error}</div>}
      
      {renderQuestao()}

      <style jsx>{`
        .aluno-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .botoes-adaptacao {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border: none;
          border-radius: 0.5rem;
          background: var(--undb-blue);
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          background: var(--undb-purple);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        button.ativo {
          background: var(--undb-pink);
        }

        .questao-container {
          background: var(--undb-card);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .questao-texto {
          font-size: 1.2rem;
          line-height: 1.6;
          margin: 1.5rem 0;
        }

        .opcoes {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .opcao {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .erro {
          color: red;
          margin: 1rem 0;
          padding: 1rem;
          background: #fee;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default Aluno; 