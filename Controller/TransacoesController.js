import Transacao from "../Model/TransacaoModel.js";
import Categoria from "../Model/CategoriaModel.js";
import { Op } from "sequelize";
import User from "../Model/UserModel.js";

export async function homeTransacoes(req, res) {
  const { search } = req.query;
  const tipoPesquisada = req.query.tipo || "";
  const categoriaPesquisada = req.query.categoria || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const user = await User.findOne({ where: { id: req.userId } });
  let condicao = { userId: user.id };

  if (search) {
    condicao.descricao = { [Op.iLike]: `%${search}%` };
  }

  if (categoriaPesquisada && categoriaPesquisada !== "todas") {
    condicao.categoria = categoriaPesquisada;
  }

  if (tipoPesquisada && tipoPesquisada !== "todas") {
    condicao.tipo = tipoPesquisada;
  }
  const { count, rows: transacoes } = await Transacao.findAndCountAll({
    where: condicao,
    order: [["data", "DESC"]],
    raw: true,
    nest: true,
    limit: limit,
    offset: offset,
  });
  const categoria = await Categoria.findAll({ raw: true, nest: true });
  const totalPages = Math.ceil(count / limit);
  return res.json({
    transacoes,
    search,
    categoria,
    currentPage: page,
    totalPages,
    tipoPesquisada,
    categoriaPesquisada,
    user,
  });
}
