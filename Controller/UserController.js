import User from "../Model/UserModel.js";

export async function GetUser(req, res) {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  return res.status(200).json({ user });
}

export async function CadastroUser(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !senha || !email) {
      return res
        .status(400)
        .json({ error: "É obrigatorio o envio do nome, email, senha" });
    }

    if (nome.length < 3) {
      return res
        .status(400)
        .json({ error: "Seu nome precisa ter pelo menos 3 caractere" });
    }

    const emailExiste = await User.findOne({
      where: { email },
    });

    if (emailExiste) {
      return res
        .status(400)
        .json({ error: "Já existe uma conta com esse email" });
    }

    const validatorPassowrd =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!%$*&@#])(?:([0-9a-zA-Z!%$*&@#])(?!\1)){8,}$/i;
    if (!validatorPassowrd.test(senha)) {
      return res.status(400).json({
        error:
          "Senha precisa ter no mínimo 8 caracteres, 1 letra maiúscula no mínimo, 1 número no mínimo, 1 caracter especial no mínimo e não é permitido sequência igual (aa, bb, 44, etc)me, email, senha",
      });
    }

    const user = await User.create({ nome, email, senha });

    return res.status(200).json({ data: { user } });
  } catch (e) {
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function EditarUser(req, res) {
  try {
    const { nome } = req.body;
    const id = req.userId;

    if (!nome) {
      return res.status(400).json({ error: "É obrigatorio o envio do nome" });
    }

    if (nome.length < 3) {
      return res
        .status(400)
        .json({ error: "Seu nome precisa ter pelo menos 3 caractere" });
    }

    const user = await User.update({ nome: nome }, { where: { id } });
    return res.status(200).json({ message: "Usuario Alterado com sucesso" });
  } catch (e) {
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function ApagarUser(req, res) {
  const id = parseInt(req.params.id);
  const idUser = req.userId;
  try {
    if ((id === idUser)) {
      const user = await User.destroy({ where: { id } });
      return res.status(202).json({ message: "Usuario apagado com sucesso" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Erro interno" });
  }
}
