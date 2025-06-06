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

## 🚀 Como rodar o backend (FastAPI)

1. Abra o terminal e navegue até a pasta `backend`:
   ```sh
   cd backend
   ```
2. Instale as dependências do backend:
   ```sh
   pip install -r requirements.txt
   ```
3. (Opcional, mas recomendado) Crie um arquivo `.env` na pasta `backend` com sua chave da API Google Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor FastAPI com recarregamento automático:
   ```sh
   python -m uvicorn main:app --reload
   ```
   O backend estará disponível em [http://localhost:8000](http://localhost:8000).

   > Se aparecer erro de comando não encontrado, tente:
   > ```sh
   > python -m uvicorn main:app --reload
   > ```

### Possíveis problemas e soluções
- **Erro `ModuleNotFoundError: No module named 'google.generativeai'`**
  > Execute: `pip install google-generativeai`
- **Erro `uvicorn : O termo 'uvicorn' não é reconhecido...`**
  > Use: `python -m uvicorn main:app --reload`
- **Problemas de PATH no Windows**
  > Sempre prefira o comando acima com `python -m ...` para evitar problemas de PATH.

## 🚀 Como rodar o frontend (React)

1. Abra o terminal e navegue até a pasta raiz do projeto:
   ```sh
   cd Plataforma-educaional-com-IA
   ```
2. Instale as dependências do frontend:
   ```sh
   npm install
   ```
3. Inicie o servidor de desenvolvimento React:
   ```sh
   npm run dev
   ```
   O frontend estará disponível em [http://localhost:5173](http://localhost:5173) (ou outra porta indicada no terminal).

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

## Adaptação de Questões para TDAH e Dislexia

Este projeto inclui uma funcionalidade no backend (`backend/main.py`) para adaptar questões educacionais utilizando a API do Google Gemini, visando facilitar a leitura e compreensão para alunos com Transtorno do Déficit de Atenção com Hiperatividade (TDAH) e Dislexia.

As instruções (prompts) fornecidas à inteligência artificial foram refinadas para melhor atender às necessidades desses alunos:

### Adaptação para TDAH

Para alunos com TDAH, o prompt agora orienta a IA a:
- Adaptar o texto para ser claro e direto.
- Quebrar frases longas e complexas em sentenças mais curtas e fáceis de processar.
- Apresentar as informações de forma linear, clara e concisa.
- Manter todos os dados numéricos e fatos essenciais da questão original.
- Garantir que a pergunta final seja clara e única, evitando induzir a múltiplas respostas intermediárias.

### Adaptação para Dislexia

Para alunos com Dislexia, o prompt agora orienta a IA a:
- Adaptar o texto para ser fácil de ler.
- Usar vocabulário simples e frases curtas.
- Apresentar as informações de forma direta, utilizando quebras de linha para separar ideias se necessário.
- Manter o conteúdo original e a pergunta final da questão.

Essas instruções, juntamente com exemplos específicos no código, ajudam a garantir que as questões adaptadas sejam mais acessíveis sem perder o sentido ou o desafio original.

As questões de exemplo utilizadas para teste desta funcionalidade podem ser encontradas neste documento: [PERGUNTAS TESTE PARA SISTEMA DE TDAH E DISLEXIA](https://docs.google.com/document/d/1iBTRJ2CwOeDuB_oNx-a4vrX8sSDvalX7yGejg60fJJ8/edit?usp=sharing)