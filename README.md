# 🧠 ReactJSBFD  
> Repositório criado com o objetivo de **aprender e praticar ReactJS** na construção de componentes reutilizáveis e interfaces modernas.  
> Desenvolvido com **Vite** para um ambiente leve e rápido.

---

## 🎯 Objetivo do projeto  
Este projeto foi desenvolvido como um laboratório de estudos em **ReactJS**, com foco em:  
- Compreender a estrutura e o fluxo de uma aplicação React moderna.  
- Criar e estilizar **componentes reutilizáveis** (botões, inputs, labels, etc).  
- Explorar o uso de **CSS modularizado** e **Ant Design**.  
- Comparar diferentes abordagens de construção de UI dentro do mesmo projeto.  
- Consolidar o aprendizado de conceitos fundamentais como **props**, **estado**, **componentização** e **renderização declarativa**.

---

## 🧩 Tecnologias e ferramentas  
| Categoria | Tecnologias |
|------------|--------------|
| Framework | [ReactJS](https://react.dev/) |
| Bundler / Dev Server | [Vite](https://vitejs.dev/) |
| Estilos | CSS puro e [Ant Design](https://ant.design/) |
| Qualidade de código | ESLint |
| Gerenciador de pacotes | npm |

---

## 📁 Estrutura do projeto  
```
/
├─ public/                  # Arquivos públicos e estáticos
├─ src/
│  ├─ components/
│  │   ├─ CSS/              # Componentes estilizados manualmente com CSS
│  │   └─ antd/             # Versões dos componentes usando Ant Design
│  ├─ App.jsx               # Componente principal da aplicação
│  ├─ main.jsx              # Ponto de entrada
│  └─ index.css             # Estilos globais
├─ eslint.config.js         # Regras do ESLint
├─ vite.config.js           # Configuração do Vite
└─ package.json
```

---

## 🚀 Como executar o projeto

### 🧱 Pré-requisitos  
- Node.js (>= 14)  
- npm (ou yarn)

### ⚙️ Instalação  
```bash
git clone https://github.com/vaguettibfd/ReactJSBFD.git
cd ReactJSBFD
npm install
```

### ▶️ Executar em modo de desenvolvimento  
```bash
npm run dev
```
O Vite iniciará um servidor local (geralmente em `http://localhost:5173`).

---

## 🧠 O que você vai aprender aqui  

✅ Estrutura básica de um projeto React  
✅ Criação de componentes funcionais  
✅ Comunicação entre componentes via **props**  
✅ Uso de **CSS modularizado** e comparação com bibliotecas de UI  
✅ Integração de bibliotecas externas (Ant Design)  
✅ Diferenças entre componentes customizados e componentes prontos  

---

## 🧩 Exemplos de componentes  

- **Button** — criado em duas versões:  
  - `src/components/CSS/Button.jsx` → feito manualmente com CSS  
  - `src/components/antd/Button.jsx` → usando Ant Design  

- **InputText**, **InputPassword**, **Label**, **LabelTitle** — seguem o mesmo padrão, facilitando comparação e reuso.

---

## 💡 Ideias de extensão do aprendizado  
- Migrar o projeto para **TypeScript**.  
- Adicionar **React Router** para navegar entre páginas.  
- Criar **testes unitários** com Jest e React Testing Library.  
- Usar **Context API** ou **Redux** para gerenciar estado global.  
- Implementar um pequeno **formulário de login funcional** com validações.

---

## 🤝 Contribuindo  
Contribuições são bem-vindas!  
Este é um projeto de aprendizado aberto — sinta-se à vontade para sugerir melhorias, correções ou novos componentes.  

1. Faça um fork do repositório.  
2. Crie uma branch para sua modificação:  
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```  
3. Faça commit das alterações e envie:  
   ```bash
   git push origin feature/nova-funcionalidade
   ```  
4. Abra um Pull Request.

---

## 📜 Licença  
Este projeto está sob a licença [MIT](LICENSE).
