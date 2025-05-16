import { Routes, Route, Navigate } from 'react-router-dom';
import ProfessorView from './pages/ProfessorView';
import StudentView from './pages/StudentView';
import SelectProfile from './pages/SelectProfile';
import ProfessorRespostas from './pages/ProfessorRespostas';
import ProfessorGerenciarAtividades from './pages/ProfessorGerenciarAtividades';
import './App.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = 'Projeto Educacional com IA';
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = '/images/logo-undb.png';
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = '/images/logo-undb.png';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SelectProfile />} />
      <Route path="/professor" element={<ProfessorView />} />
      <Route path="/aluno" element={<StudentView />} />
      <Route path="/professor/respostas" element={<ProfessorRespostas />} />
      <Route path="/professor/gerenciar" element={<ProfessorGerenciarAtividades />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;