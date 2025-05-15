import { Routes, Route, Navigate } from 'react-router-dom';
import ProfessorView from './pages/ProfessorView';
import StudentView from './pages/StudentView';
import SelectProfile from './pages/SelectProfile';
import ProfessorRespostas from './pages/ProfessorRespostas';
import ProfessorGerenciarAtividades from './pages/ProfessorGerenciarAtividades';
import './App.css';

function App() {
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