import React, { useState } from 'react';
import FieldTypeSelector from './FieldTypeSelector';
import styles from './ActivityForm.module.css';

const alunosFicticios = [
  { id: 'aluno1', nome: 'Ana Souza' },
];

function getInitials(nome) {
  return nome.split(' ').map(n => n[0]).join('').toUpperCase();
}

const defaultOption = () => ({ id: Date.now() + Math.random(), text: '' });

const tiposComRespostaCorreta = ['numero'];

function ActivityForm() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [campos, setCampos] = useState([]);
  const [novoCampo, setNovoCampo] = useState({ tipo: 'texto', label: '', resposta: '', opcoes: [defaultOption()] });
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Atualiza tipo e reseta opções se necessário
  const handleTipoChange = (tipo) => {
    setNovoCampo((prev) => ({
      ...prev,
      tipo,
      opcoes: (tipo === 'multipla' || tipo === 'checkbox') ? [defaultOption()] : [],
      resposta: '',
    }));
    setShowTypeSelector(false);
  };

  // Adiciona campo
  const handleAddCampo = () => {
    if (!novoCampo.label.trim()) return;
    // Para multipla/checkbox, salva as respostas corretas
    let respostasCorretas = [];
    if (novoCampo.tipo === 'multipla' || novoCampo.tipo === 'checkbox') {
      respostasCorretas = novoCampo.opcoes.filter(op => op.correta).map(op => op.text);
    }
    setCampos([
      ...campos,
      { ...novoCampo, id: `campo${campos.length + 1}`, respostasCorretas },
    ]);
    setNovoCampo({ tipo: 'texto', label: '', resposta: '', opcoes: [defaultOption()] });
    setShowTypeSelector(false);
  };

  // Editar campo
  const handleEditCampo = (idx) => {
    setEditIndex(idx);
    setNovoCampo({ ...campos[idx] });
    setShowTypeSelector(false);
  };
  const handleSaveEditCampo = () => {
    if (!novoCampo.label.trim()) return;
    let respostasCorretas = [];
    if (novoCampo.tipo === 'multipla' || novoCampo.tipo === 'checkbox') {
      respostasCorretas = novoCampo.opcoes.filter(op => op.correta).map(op => op.text);
    }
    setCampos(campos.map((c, i) => (i === editIndex ? { ...novoCampo, respostasCorretas } : c)));
    setEditIndex(null);
    setNovoCampo({ tipo: 'texto', label: '', resposta: '', opcoes: [defaultOption()] });
    setShowTypeSelector(false);
  };
  const handleRemoveCampo = (idx) => {
    setCampos(campos.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  };

  // Opções dinâmicas para multipla/checkbox
  const handleOptionChange = (idx, value) => {
    setNovoCampo((prev) => {
      const opcoes = prev.opcoes.map((op, i) => i === idx ? { ...op, text: value } : op);
      return { ...prev, opcoes };
    });
  };
  const handleAddOption = () => {
    setNovoCampo((prev) => ({ ...prev, opcoes: [...prev.opcoes, defaultOption()] }));
  };
  const handleRemoveOption = (idx) => {
    setNovoCampo((prev) => ({ ...prev, opcoes: prev.opcoes.filter((_, i) => i !== idx) }));
  };

  const handleAlunoChange = (id) => {
    setAlunosSelecionados(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSalvar = () => {
    const atividadeId = `atividade-${Date.now()}`;
    const atividade = {
      id: atividadeId,
      titulo,
      descricao,
      campos,
      alunosSelecionados,
    };

    // 1. Salvar o objeto completo da atividade no localStorage
    localStorage.setItem(`atividade_${atividadeId}`, JSON.stringify(atividade));

    // 2. Para cada aluno selecionado, adicionar o ID desta atividade à sua lista de atividades
    alunosSelecionados.forEach(alunoId => {
      const chaveListaAtividadesAluno = `atividades_aluno_${alunoId}`;
      const listaAtividadesJSON = localStorage.getItem(chaveListaAtividadesAluno);
      let listaAtividades = [];

      if (listaAtividadesJSON) {
        listaAtividades = JSON.parse(listaAtividadesJSON);
      }

      // Adiciona o novo ID da atividade se ainda não estiver na lista
      if (!listaAtividades.includes(atividadeId)) {
        listaAtividades.push(atividadeId);
      }
      localStorage.setItem(chaveListaAtividadesAluno, JSON.stringify(listaAtividades));
    });

    // Feedback para o professor (pode ser melhorado depois)
    alert(`Atividade "${atividade.titulo || 'Nova Atividade'}" salva e atribuída para ${alunosSelecionados.length} aluno(s).`);

    // Opcional: Limpar campos do formulário após salvar
    // setTitulo('');
    // setDescricao('');
    // setCampos([]);
    // setAlunosSelecionados([]);
    // setNovoCampo({ tipo: 'texto', label: '', resposta: '', opcoes: [defaultOption()] });
  };

  // Renderiza opções se tipo multipla/checkbox
  const renderOpcoes = () => {
    if (novoCampo.tipo !== 'multipla' && novoCampo.tipo !== 'checkbox') return null;
    return (
      <div style={{ width: '100%' }}>
        {novoCampo.opcoes.map((op, idx) => (
          <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {/* Input da opção */}
            <input
              className={styles.formInput}
              style={{ width: 180 }}
              placeholder={`Opção ${idx + 1}`}
              value={op.text}
              onChange={e => handleOptionChange(idx, e.target.value)}
            />
            {/* Marcar como correta */}
            {novoCampo.tipo === 'multipla' ? (
              <input
                type="radio"
                name="respostaCorreta"
                checked={!!op.correta}
                onChange={() => {
                  setNovoCampo(prev => ({
                    ...prev,
                    opcoes: prev.opcoes.map((o, i) => ({ ...o, correta: i === idx }))
                  }));
                }}
                title="Marcar como correta"
              />
            ) : (
              <input
                type="checkbox"
                checked={!!op.correta}
                onChange={() => {
                  setNovoCampo(prev => ({
                    ...prev,
                    opcoes: prev.opcoes.map((o, i) => i === idx ? { ...o, correta: !o.correta } : o)
                  }));
                }}
                title="Marcar como correta"
              />
            )}
            <span style={{ fontSize: 13, color: '#888' }}>{novoCampo.tipo === 'multipla' ? 'Correta' : 'Correta(s)'}</span>
            {/* Remover opção */}
            {novoCampo.opcoes.length > 1 && (
              <button type="button" onClick={() => handleRemoveOption(idx)} style={{ color: 'var(--undb-pink)', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} title="Remover opção">✗</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddOption} style={{ color: 'var(--undb-pink)', background: 'none', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 2 }}>
          + Adicionar opção
        </button>
      </div>
    );
  };

  // Renderiza resposta correta se aplicável
  const renderRespostaCorreta = () => {
    if (novoCampo.tipo !== 'numero') return null;
    return (
      <input
        placeholder="Ex: 33"
        value={novoCampo.resposta}
        onChange={e => setNovoCampo({ ...novoCampo, resposta: e.target.value })}
        className={styles.formInput}
        style={{ width: 180 }}
        aria-label="Resposta correta"
      />
    );
  };

  // Renderiza campos já adicionados com edição inline
  const renderCamposAdicionados = () => (
    <ul className={styles.fieldsList}>
      {campos.map((campo, idx) => (
        <li key={campo.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <b>{`Campo ${idx + 1}: ${campo.label}`}</b> <span style={{ color: '#888' }}>({campo.tipo})</span>
            <button type="button" onClick={() => handleEditCampo(idx)} style={{ color: 'var(--undb-blue)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
            <button type="button" onClick={() => handleRemoveCampo(idx)} style={{ color: 'var(--undb-pink)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Remover</button>
          </div>
          {campo.tipo === 'multipla' || campo.tipo === 'checkbox' ? (
            <div style={{ marginLeft: 8, marginTop: 2 }}>
              {campo.opcoes && campo.opcoes.map((op, i) => (
                <div key={op.id} style={{ color: '#888', fontSize: 14 }}>
                  {campo.tipo === 'multipla' ? '•' : '•'} {op.text}
                </div>
              ))}
            </div>
          ) : null}
          {tiposComRespostaCorreta.includes(campo.tipo) && campo.resposta && (
            <div style={{ marginLeft: 8, color: 'var(--undb-blue)', fontSize: 13 }}>Resposta correta: {campo.resposta}</div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.activityFormWrapper} style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        {/* <img src="/images/logo-undb.png" alt="Logo UNDB" style={{ width: 80, height: 80, borderRadius: 18, marginBottom: 8 }} /> */}
        <h1 style={{ fontWeight: 700, fontSize: 40, color: '#d946ef', margin: 0, textAlign: 'center', marginBottom: 8 }}>Criar Nova Atividade</h1>
        <p style={{ color: '#2563eb', fontSize: 22, background: '#e0e7ff', borderRadius: 10, padding: 18, margin: 0, textAlign: 'center', border: '1.5px solid #2563eb', fontWeight: 600, marginBottom: 18, maxWidth: 700 }}>
          Preencha os detalhes abaixo para configurar uma nova atividade educacional.
        </p>
      </div>
      {/* Card: Título e Descrição */}
      <section className={styles.card} style={{ background: '#f9fafb', borderRadius: 14, boxShadow: '0 4px 24px #2563eb22', marginBottom: 44, padding: '38px 38px 28px 38px', border: '1.5px solid #d946ef' }}>
        <div className={styles.cardTitle} style={{ fontSize: 28, fontWeight: 700, color: '#d946ef', marginBottom: 24 }}><span className="step">1</span> Informações da Atividade</div>
        <div className={styles.formGroup} style={{ marginBottom: 28 }}>
          <label className={styles.formLabel} htmlFor="titulo" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Título</label>
          <input id="titulo" value={titulo} onChange={e => setTitulo(e.target.value)} className={styles.formInput} placeholder="Ex: Questionário sobre Iluminismo" autoComplete="off" style={{ fontSize: 22, padding: '18px 20px', borderRadius: 10, border: '1.5px solid #b3b3b3', marginBottom: 18, width: '100%', background: '#f7f9fa' }} />
        </div>
        <div className={styles.formGroup} style={{ marginBottom: 28 }}>
          <label className={styles.formLabel} htmlFor="descricao" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Descrição / Instruções</label>
          <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} className={styles.formTextarea} placeholder="Forneça instruções claras, objetivos e contexto para esta atividade." rows={3} style={{ fontSize: 22, padding: '18px 20px', borderRadius: 10, border: '1.5px solid #b3b3b3', marginBottom: 18, width: '100%', minHeight: 120, background: '#f7f9fa' }} />
        </div>
      </section>

      {/* Card: Campos da Atividade */}
      <section className={styles.card} style={{ background: '#f9fafb', borderRadius: 14, boxShadow: '0 4px 24px #2563eb22', marginBottom: 44, padding: '38px 38px 28px 38px', border: '1.5px solid #d946ef' }}>
        <div className={styles.cardTitle} style={{ fontSize: 28, fontWeight: 700, color: '#d946ef', marginBottom: 24 }}>
          <span className="step">2</span> Campos da Atividade
          {editIndex === null ? (
            <button type="button" onClick={handleAddCampo} className={styles.addFieldBtn} aria-label="Adicionar campo" style={{ fontSize: 20, padding: '12px 32px', borderRadius: 10, background: '#d946ef', color: '#fff', fontWeight: 700, marginLeft: 24, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #e6007e22' }}>
              + Adicionar Campo
            </button>
          ) : (
            <button type="button" onClick={handleSaveEditCampo} className={styles.addFieldBtn} aria-label="Salvar edição" style={{ fontSize: 20, padding: '12px 32px', borderRadius: 10, background: '#10b981', color: '#fff', fontWeight: 700, marginLeft: 24, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #05966922' }}>
              Salvar Edição
            </button>
          )}
        </div>
        <div>
          {campos.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#aaa', border: '2px dashed #d946ef', borderRadius: 14, padding: 40, background: '#fafbfc', margin: '24px 0', fontSize: 22 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <div style={{ fontWeight: 600, fontSize: 22 }}>Nenhum campo adicionado ainda.</div>
              <div style={{ fontSize: 18, color: '#bbb' }}>Clique em "Adicionar Campo" para começar a montar sua atividade.</div>
            </div>
          ) : (
            renderCamposAdicionados()
          )}
        </div>
        <div className={styles.fieldsRow} style={{ marginTop: 32, gap: 32, alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: 220, display: 'flex', alignItems: 'center', height: '100%' }}>
            <button
              type="button"
              style={{ padding: '18px 24px', borderRadius: 10, border: '1.5px solid #b3b3b3', background: '#f7f9fa', cursor: 'pointer', fontWeight: 700, fontSize: 20, minWidth: 180 }}
              onClick={() => setShowTypeSelector(!showTypeSelector)}
              aria-haspopup="listbox"
              aria-expanded={showTypeSelector}
            >
              Tipo: <b>{novoCampo.tipo.charAt(0).toUpperCase() + novoCampo.tipo.slice(1)}</b>
            </button>
            {showTypeSelector && (
              <div style={{ position: 'absolute', zIndex: 10, top: 60, left: 0 }}>
                <FieldTypeSelector value={novoCampo.tipo} onChange={handleTipoChange} />
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className={styles.formLabel} htmlFor="pergunta" style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Pergunta</label>
            <textarea
              id="pergunta"
              placeholder="Ex: Qual a capital da França?"
              value={novoCampo.label}
              onChange={e => setNovoCampo({ ...novoCampo, label: e.target.value })}
              className={styles.formTextarea}
              style={{ fontSize: 22, padding: '18px 20px', borderRadius: 10, border: '1.5px solid #b3b3b3', marginBottom: 18, width: '100%', minHeight: 60, background: '#f7f9fa' }}
              aria-label="Pergunta"
              rows={2}
            />
          </div>
          {renderRespostaCorreta()}
        </div>
        {renderOpcoes()}
      </section>

      {/* Card: Seleção de Alunos */}
      <section className={styles.card} style={{ background: '#f9fafb', borderRadius: 14, boxShadow: '0 4px 24px #2563eb22', marginBottom: 44, padding: '38px 38px 28px 38px', border: '1.5px solid #d946ef' }}>
        <div className={styles.cardTitle} style={{ fontSize: 28, fontWeight: 700, color: '#d946ef', marginBottom: 24 }}><span className="step">3</span> Enviar para:</div>
        <div className={styles.alunosList} style={{ display: 'flex', gap: 32 }}>
          {alunosFicticios.map(aluno => {
            const selected = alunosSelecionados.includes(aluno.id);
            return (
              <div
                key={aluno.id}
                className={styles.alunoCard + (selected ? ' ' + styles.selected : '')}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                onClick={() => handleAlunoChange(aluno.id)}
                onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && handleAlunoChange(aluno.id)}
                style={{ fontSize: 22, padding: '18px 32px', borderRadius: 12, border: selected ? '2.5px solid #d946ef' : '1.5px solid #b3b3b3', background: selected ? '#f3e8ff' : '#f7f9fa', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18 }}
              >
                <span className={styles.alunoAvatar} aria-hidden style={{ fontSize: 26, marginRight: 12 }}>{getInitials(aluno.nome)}</span>
                <span>{aluno.nome}</span>
                {selected && <span style={{ color: '#d946ef', fontWeight: 700, fontSize: 26, marginLeft: 10 }}>✓</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Card: Ação principal */}
      <section className={styles.card} style={{ boxShadow: 'none', border: 'none', padding: 0, background: 'transparent', alignItems: 'stretch', display: 'flex', justifyContent: 'center' }}>
        <button type="button" onClick={handleSalvar} className={styles.saveBtn} aria-label="Salvar atividade" style={{ background: '#d946ef', color: '#fff', padding: '20px 60px', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px #e6007e22', letterSpacing: 0.5, transition: 'background 0.2s', margin: '0 auto' }}>
          Salvar Atividade
        </button>
      </section>
    </div>
  );
}

export default ActivityForm; 