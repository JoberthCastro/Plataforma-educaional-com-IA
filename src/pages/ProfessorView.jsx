import React from 'react';
import ActivityForm from '../components/ActivityForm';
import { useNavigate } from 'react-router-dom';

function ProfessorView() {
  const nomeProfessor = localStorage.getItem('professor_nome') || '';
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '90vw', maxWidth: 1600, minHeight: 600, padding: '60px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <img src="/images/logo-undb.png" alt="Logo UNDB" style={{ width: 100, height: 100, borderRadius: 18 }} />
          <span style={{ fontWeight: 700, fontSize: 36, color: 'var(--undb-pink, #d946ef)' }}>{nomeProfessor && `Professor(a): ${nomeProfessor}`}</span>
        </div>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <ActivityForm />
        </div>
        <div style={{ display: 'flex', gap: 36, marginTop: 40 }}>
          <button
            onClick={() => navigate('/professor/respostas')}
            style={{
              background: '#2563eb',
              color: '#fff',
              padding: '24px 56px',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 26,
              cursor: 'pointer',
              boxShadow: '0 2px 12px #2563eb22',
              transition: 'background 0.2s'
            }}
          >
            Corrigir Respostas dos Alunos
          </button>
          <button
            onClick={() => navigate('/professor/gerenciar')}
            style={{
              background: '#d946ef',
              color: '#fff',
              padding: '24px 56px',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 26,
              cursor: 'pointer',
              boxShadow: '0 2px 12px #e6007e22',
              transition: 'background 0.2s'
            }}
          >
            Gerenciar Atividades
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessorView;