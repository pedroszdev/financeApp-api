import express from "express";
import HomeController from "./Controller/HomeController.js";
import { homeTransacoes } from "./Controller/TransacoesController.js";
import {
  CadastrarTransacao,
  EditarTransacao,
  ApagarTransacao,
  GetTransacao,
} from "./Controller/TransacaoController.js";
import {
  CadastroUser,
  EditarUser,
  ApagarUser,
  GetUser,
} from "./Controller/UserController.js";
import { LoginUser, Logout, refresh } from "./Controller/LoginController.js";
import LoginRequired from "./Middleware/LoginRequired.js";
import AuthGuard from "./Middleware/AuthUser.js";

const route = express.Router();
//Home
route.get("/", LoginRequired, HomeController);

//ListaTransacoes
route.get("/transacoes", LoginRequired, homeTransacoes);

//CRUD transacao
route.post("/transacao", LoginRequired, CadastrarTransacao);
route.get("/transacao/:id", LoginRequired, GetTransacao);
route.put("/transacao/edit/:id", LoginRequired, EditarTransacao);
route.delete("/transacao/delete/:id", LoginRequired, ApagarTransacao);

//CRUD User
route.post("/user", CadastroUser);
route.get("/user/:id", LoginRequired, AuthGuard, GetUser);
route.put("/user/:id", LoginRequired, AuthGuard, EditarUser);
route.delete("/user/delete/:id", LoginRequired, AuthGuard, ApagarUser);

//LoginUser
route.post("/login", LoginUser);
route.get("/logout", LoginRequired, Logout);
route.post("/refresh", refresh);

export default route;
