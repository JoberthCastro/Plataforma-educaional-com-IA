# Plataforma Educacional com IA

Este projeto é uma plataforma educacional desenvolvida em React, utilizando Vite para um ambiente de desenvolvimento rápido e moderno. O objetivo é fornecer uma base para aplicações educacionais, com suporte a múltiplos perfis (aluno, professor) e integração de componentes reutilizáveis.

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [ESLint](https://eslint.org/)

## 📦 Estrutura do Projeto

```
├── public/
│   ├── index.html
│   ├── vite.svg
│   └── activities/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

- **public/**: Arquivos estáticos e HTML principal.
- **src/assets/**: Imagens e recursos visuais.
- **src/components/**: Componentes reutilizáveis (ex: formulários, seletores).
- **src/pages/**: Páginas principais (ex: StudentView, ProfessorView, SelectProfile).
- **src/**: Arquivos de entrada e configuração do React.

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```
   O projeto estará disponível em [http://localhost:5173](http://localhost:5173) (ou outra porta indicada no terminal).

4. **Build para produção:**
   ```sh
   npm run build
   ```

5. **Preview do build de produção:**
   ```sh
   npm run preview
   ```

## 🧹 Lint

Para verificar problemas de lint no código:
```sh
npm run lint
```

## 👤 Perfis e Páginas

- **StudentView**: Visualização para alunos.
- **ProfessorView**: Visualização para professores.
- **SelectProfile**: Seleção de perfil ao entrar na plataforma.

## 📝 Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b minha-feature`).
3. Commit suas alterações (`git commit -m 'feat: Minha nova feature'`).
4. Push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
