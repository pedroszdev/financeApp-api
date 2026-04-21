export default async function AuthGuard(req, res, next) {
  const userLogado = req.userId;
  console.log(userLogado);
  const { id } = req.params;
  console.log(Number.parseInt(id));
  if (!(userLogado === Number.parseInt(id))) {
    return res
      .status(403)
      .json({ error: "Você não tem autorização para acessar" });
  }
  next();
}
