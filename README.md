# FinanceApp 💰
O FinanceApp é uma aplicação web completa para gestão financeira pessoal. O sistema permite que os usuários controlem suas finanças registrando receitas e despesas, visualizem o saldo atual e analisem seus hábitos de consumo através de gráficos interativos.

## 🚀 Funcionalidades
  - Autenticação de Usuários: Sistema seguro de cadastro e login (com senhas criptografadas via bcrypt).
  - Dashboard Interativo: Visão geral do saldo total, receitas e despesas do mês atual.
  - Gestão de Transações:
  - Adicionar novas receitas ou despesas.
  - Editar ou excluir transações existentes.
  - Categorização automática (Alimentação, Transporte, etc.).
  - Filtros e Pesquisa: Pesquise transações por descrição, filtre por categoria ou tipo (Receita/Despesa).
  - Visualização de Dados:
  - Gráfico de Linha: Comparativo de Receitas vs. Despesas dos últimos 6 meses.
  - Gráfico de Pizza: Distribuição de despesas por categoria no mês atual.
  - Design Responsivo: Interface adaptável para desktop e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas
O projeto foi desenvolvido utilizando a arquitetura MVC (Model-View-Controller) com as seguintes tecnologias:

-Back-end:

  - Node.js - Ambiente de execução JS.
  - Express - Framework web.
  - Sequelize - ORM para banco de dados.
  - PostgreSQL - Banco de dados relacional (via pg).

- Front-end:

  - EJS - Motor de visualização (Template Engine).
  - CSS3 (Customizado e Responsivo).
  - Chart.js - Biblioteca para gráficos.

- Utilitários:

  - bcrypt: Para hash de senhas.
  - dotenv: Gerenciamento de variáveis de ambiente.
  - express-session & connect-flash: Gerenciamento de sessões e mensagens temporárias.
