import pkg from "jsonwebtoken";
const { verify, sign, decode } = pkg;
import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import Session from "../Model/SessionModel.js";

export async function LoginUser(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Falta email ou senha" });
  }
  const user = await UserModel.findOne({
    where: { email },
    raw: true,
    nest: true,
  });
  if (!user) {
    return res.status(400).json({
      erro: "Email ou senha inválido",
    });
  }
  if (!bcrypt.compareSync(senha, user.senha)) {
    return res.status(400).json({
      erro: "Email ou senha inválido",
    });
  }

  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const accesstoken = sign(
    { userId: user.id }, // payload
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const refreshtoken = sign(
    { userId: user.id }, // payload
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  await Session.create({
    userId: user.id,
    token: refreshtoken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
  });
  return res.json({ accesstoken, refreshtoken });
}

export async function Logout(req, res) {
  try {
    const userId = req.userId;
    const session = await Session.findOne({ where: { userId } });
    if (!session) {
      return res.status(400).json({ error: "Sessão não encontrada" });
    }

    await Session.destroy({ where: { userId } });

    return res.status(200).json({ error: "Sessão encerrada" });
  } catch (e) {
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "É obrigatorio o envio do token" });
    }
    const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    const session = await Session.findOne({ where: { userId } });
    if (!session) {
      return res.status(400).json({ error: "Sessão não encontrada" });
    }

    if (session.expiresAt <= new Date()) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    await Session.destroy({ where: { userId } });

    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    const accesstoken = sign(
      { userId: userId }, // payload
      JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    const refreshtoken = sign(
      { userId: userId }, // payload
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await Session.create({
      userId: userId,
      token: refreshtoken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    });

    return res.json({ accesstoken, refreshtoken });
  } catch (e) {
    return res.status(500).json({ error: "Erro interno" });
  }
}
