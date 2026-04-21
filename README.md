# FinanceApp — API 💰

API REST do FinanceApp, sistema de gestão financeira pessoal. Permite
cadastrar receitas/despesas, consultar saldo, filtrar transações e obter
os dados agregados usados pelos gráficos do dashboard.

Hospedada em **https://sistema-financero-js.onrender.com**.

O frontend React que consome esta API vive em
[`../financeapp-frontend/`](../financeapp-frontend) (projeto irmão).

## 🚀 Funcionalidades

- **Autenticação JWT** — access token (15 min) + refresh token (7 dias),
  sessão persistida em tabela própria. Senhas com hash bcrypt.
- **CRUD de transações** com filtros por descrição, tipo e categoria, mais
  paginação server-side (20 por página).
- **Dashboard agregado** — saldo total, receitas/despesas do mês,
  série mensal dos últimos 6 meses e distribuição por categoria, tudo num
  único endpoint.
- **CRUD de usuário** — cadastro, leitura, edição e remoção.

## 🛠️ Stack

- **Node.js** + **Express 5**
- **Sequelize 6** (+ `pg` / `pg-hstore`) sobre **PostgreSQL** (Neon)
- **jsonwebtoken** para JWT, **express-bearer-token** para extração do header
- **bcrypt** para hash de senha
- **dotenv** para variáveis de ambiente
- **nodemon** (dev)

> Observação: versões anteriores usavam EJS + express-session + connect-flash.
> A API atual é puramente JSON com autenticação JWT por header
> `Authorization: Bearer`. Não há mais rendering server-side.

## 📦 Como rodar localmente

Pré-requisitos: Node.js 18+ e uma string de conexão PostgreSQL.

```bash
git clone git@github.com:pedroszdev/Sistema-financero-js.git
cd Sistema-financero-js
npm install
cp .env.example .env   # se não existir, crie manualmente — ver abaixo
npm run dev            # nodemon index.js
```

A API sobe em `http://localhost:3000`.

### Variáveis de ambiente

Arquivo `.env` na raiz:

```
DATABASE_URL=postgresql://USER:PASS@HOST/DBNAME?sslmode=require
JWT_ACCESS_SECRET=troque-por-uma-string-aleatoria-longa
JWT_REFRESH_SECRET=outra-string-aleatoria-diferente-da-anterior
```

### Primeira execução (criar as tabelas)

Em `index.js`, a linha `// sincronizarTabelas();` está **comentada por
padrão**. Na primeira execução contra um banco novo, descomente-a uma vez
para criar as tabelas `Users`, `Transacaos` e `Sessions`. Depois pode
comentar novamente — `sequelize.sync({ alter: true })` em produção é
arriscado.

## 🔐 Autenticação

Todas as rotas marcadas com 🔒 exigem o header:

```
Authorization: Bearer <accesstoken>
```

Fluxo esperado pelo cliente:
1. `POST /login` → guarda `accesstoken` e `refreshtoken`.
2. Envia `Bearer <accesstoken>` nas chamadas subsequentes.
3. Quando receber **401**, chama `POST /refresh` com `{ refreshToken }`
   para obter novo par de tokens.
4. Se o refresh também falhar, redireciona o usuário para o login.

### Regras de senha (cadastro)

Validadas por regex em `Controller/UserController.js`:

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula, 1 minúscula e 1 dígito
- Pelo menos 1 caractere especial entre `! % $ * & @ #`
- **Sem caracteres repetidos em sequência** (`aa`, `11`, etc.)

Exemplo válido: `Senha@12`.

## 🌐 Endpoints

### Usuário

| Método | Rota | Auth | Body | Resposta |
|---|---|---|---|---|
| POST | `/user` | — | `{ nome, email, senha }` | `200 { data: { user } }` |
| GET | `/user/:id` | 🔒 (dono) | — | `200 { user }` |
| PUT | `/user/:id` | 🔒 (dono) | `{ nome }` | `200 { message }` |
| DELETE | `/user/delete/:id` | 🔒 (dono) | — | `202 { message }` |

### Sessão

| Método | Rota | Auth | Body | Resposta |
|---|---|---|---|---|
| POST | `/login` | — | `{ email, senha }` | `200 { accesstoken, refreshtoken }` · erro `400 { erro }` |
| POST | `/refresh` | — | `{ refreshToken }` | `200 { accesstoken, refreshtoken }` |
| GET | `/logout` | 🔒 | — | `200 { error: "Sessão encerrada" }` |

> ⚠️ Nas rotas de login, o campo de erro vem como **`erro`** (sem "r").
> As demais rotas usam `error`.

### Transações

Tipo sempre `"Receita"` ou `"Despesa"` (capitalizado, em português).

| Método | Rota | Auth | Body | Resposta |
|---|---|---|---|---|
| POST | `/transacao` | 🔒 | `{ descricao, valor, tipo, categoria }` | `200 { transacao }` |
| GET | `/transacao/:id` | 🔒 | — | `200 { transacao }` |
| PUT | `/transacao/edit/:id` | 🔒 | `{ descricao, valor, tipo, categoria }` | `200 { transacao: [count] }` |
| DELETE | `/transacao/delete/:id` | 🔒 | — | `200 { message }` |
| GET | `/transacoes` | 🔒 | query: `search`, `tipo`, `categoria`, `page` | `200 { transacoes, categoria, currentPage, totalPages, ... }` |

Observações:
- `PUT /transacao/edit/:id` retorna o **número de linhas afetadas**, não o
  objeto atualizado. Cliente deve refazer `GET` se precisar do registro.
- `GET /transacoes` é paginado (limit 20). Aceita `tipo=todas` e
  `categoria=todas` para ignorar o filtro correspondente.
- `valor` precisa ser numérico e > 0; `descricao` precisa ter 3+ caracteres.

### Dashboard

| Método | Rota | Auth | Resposta |
|---|---|---|---|
| GET | `/` | 🔒 | `{ receitaMesAtual, despesaMesAtual, saldo, dados6meses, dadosCategoria, user }` |

Shapes:
- `receitaMesAtual`, `despesaMesAtual`, `saldo` são strings com 2 casas
  decimais (ex.: `"1234.56"`).
- `dados6meses` é `{ "Jan": { receita, despesa }, "Fev": { ... }, ... }`
  já ordenado, cobrindo os últimos 6 meses.
- `dadosCategoria` é `{ "Alimentação": 350.9, "Transporte": 120, ... }`
  referente ao mês atual.

## 🗂️ Categorias

Não há endpoint de categorias e o frontend hardcoda o conjunto abaixo
(as mesmas que a UI aceita na criação de transações):

`Alimentação · Transporte · Saúde · Educação · Lazer · Moradia · Vestuário · Outros`

A tabela `Categoria` existe no modelo (`Model/CategoriaModel.js`) e é
retornada por `GET /transacoes`, mas não é populada automaticamente.

## 🏗️ Estrutura do projeto

```
Api-sistema-financero-js/
├── index.js              # entrypoint (Express + bearer token + router)
├── router.js             # mapa de rotas
├── Controller/
│   ├── HomeController.js        # GET /  (dashboard agregado)
│   ├── LoginController.js       # /login, /refresh, /logout
│   ├── TransacaoController.js   # CRUD de 1 transação
│   ├── TransacoesController.js  # listagem paginada
│   └── UserController.js        # CRUD de usuário
├── Middleware/
│   ├── LoginRequired.js         # valida access token
│   └── AuthUser.js              # garante dono do recurso
└── Model/
    ├── db.js                    # conexão Sequelize
    ├── index.js                 # sincronização + associações
    ├── UserModel.js             # bcrypt hook no beforeSave
    ├── TransacaoModel.js
    ├── SessionModel.js
    └── CategoriaModel.js
```

## ⚠️ Notas operacionais

- **CORS não está configurado.** SPAs servidos em outro domínio são
  bloqueados pelo browser no preflight. Em dev, o frontend usa o proxy do
  Vite para contornar isso. Para expor a API a um frontend em produção
  hospedado em outro domínio, adicione o middleware `cors` em `index.js`.
- Quando hospedada no Render free tier, a API pode ter **cold start de
  ~20s** após período ocioso.
- A rota `DELETE /user/delete/:id` só responde se `id` == `req.userId`;
  caso contrário, o `try` cai no final da função sem resposta explícita
  (resulta em timeout do lado do cliente).

## 🧪 Exemplo rápido (curl)

```bash
# 1. Cadastro
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"nome":"Fulano","email":"fulano@teste.com","senha":"Senha@12"}'

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fulano@teste.com","senha":"Senha@12"}' | jq -r .accesstoken)

# 3. Criar transação
curl -X POST http://localhost:3000/transacao \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"descricao":"Mercado","valor":350.90,"tipo":"Despesa","categoria":"Alimentação"}'

# 4. Dashboard
curl http://localhost:3000/ -H "Authorization: Bearer $TOKEN"
```

## 📄 Licença

MIT — ver `LICENSE`.
