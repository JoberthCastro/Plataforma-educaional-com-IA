import React from 'react';
import { useNavigate } from 'react-router-dom';

function SelectProfile() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 32px rgba(0,0,0,0.10)', width: '90vw', maxWidth: 1600, minHeight: 600, padding: '60px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 40 }}>
        <img src="/undb-logo.png" alt="Logo UNDB" style={{ width: 100, height: 100, borderRadius: 18, marginBottom: 32 }} />
        <h1 style={{ fontWeight: 700, fontSize: 48, color: '#d946ef', marginBottom: 18, textAlign: 'center' }}>Bem-vindo!</h1>
        <p style={{ color: '#888', fontSize: 28, marginBottom: 48, textAlign: 'center' }}>Selecione seu perfil para acessar a plataforma:</p>
        <div style={{ display: 'flex', gap: 60, width: '100%', justifyContent: 'center' }}>
          <button onClick={() => navigate('/professor')} style={{ padding: '32px 80px', borderRadius: 16, background: '#d946ef', color: '#fff', fontWeight: 700, fontSize: 32, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px #e6007e22', transition: 'background 0.2s' }}>Professor</button>
          <button onClick={() => navigate('/aluno')} style={{ padding: '32px 80px', borderRadius: 16, background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 32, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px #2563eb22', transition: 'background 0.2s' }}>Estudante</button>
        </div>
      </div>
    </div>
  );
}

export default SelectProfile; 