import Transacao from "../Model/TransacaoModel.js";

export async function GetTransacao(req, res) {
  const { id } = req.params;
  const userId = req.userId;
  const transacao = await Transacao.findOne({ where: { id, userId } });
  return res.status(200).json({ transacao });
}

export async function CadastrarTransacao(req, res) {
  try {
    const { descricao, valor, tipo, categoria } = req.body;

    if (!descricao || !valor || !tipo || !categoria) {
      return res
        .status(400)
        .json({ error: "É obrigatorio ter descrição, valor, tipo, categoria" });
    }

    if (isNaN(valor) || valor < 0) {
      return res
        .status(400)
        .json({ error: "Valor deve ser um número e maior que 0" });
    }

    if (descricao.length <= 2) {
      return res
        .status(400)
        .json({ error: "Descrição deve ter 3 ou mais caractere" });
    }

    const userId = req.userId;

    const transacao = await Transacao.create({
      descricao,
      valor,
      tipo,
      categoria,
      userId,
    });

    return res.status(200).json({ transacao });
  } catch (e) {
    return res.status(500).json({ error: "Erro Interno" });
  }
}

export async function EditarTransacao(req, res) {
  const id = parseInt(req.params.id);
  const { descricao, valor, tipo, categoria } = req.body;
  try {
    if (isNaN(valor) || valor < 0) {
      return res
        .status(400)
        .json({ error: "Valor deve ser um número e maior que 0" });
    }

    if (descricao.length <= 2) {
      return res
        .status(400)
        .json({ error: "Descrição deve ter 3 ou mais caractere" });
    }

    const transacao = await Transacao.update({ descricao, valor, tipo, categoria }, {
      where: { id, userId: req.userId },
    });

    return res.status(200).json({ transacao });
  } catch (e) {
    return res.status(500).json({ error: "Erro Interno" });
  }
}

export async function ApagarTransacao(req, res) {
  const id = parseInt(req.params.id);
  const userId = req.userId;
  try {
    const transacao = await Transacao.findOne({ where: { id } });
    if (!transacao) {
      return res.status(400).json({ error: "Transação não existe" });
    }
    if (transacao.userId !== userId) {
      return res.status(403).json({ error: "Não autorizado" });
    }
    await Transacao.destroy({ where: { id } });
    return res.status(200).json({ message: "Transação apagada com sucesso" });
  } catch (e) {
    return res.status(500).json({ error: "Erro Interno" });
  }
}
