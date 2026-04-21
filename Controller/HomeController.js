import Transacao from "../Model/TransacaoModel.js";
import User from "../Model/UserModel.js";
export default async function home(req, res) {
  const user = await User.findOne({ where: { id: req.userId } });

  const transacoes = await Transacao.findAll({
    where: {
      userId: user.id,
    },
    raw: true,
    nest: true,
  });

  let despesaMesAtual = 0;
  let receitaMesAtual = 0;
  let despesaTotal = 0;
  let receitaTotal = 0;
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const dadosCategoria = {};

  for (let i = 0; i < transacoes.length; i++) {
    let dataTransacao = new Date(transacoes[i].data);

    if (
      dataTransacao.getMonth() === mesAtual &&
      dataTransacao.getFullYear() === anoAtual
    ) {
      //CALCULAR RECEITAS E DESPESAS DO MES ATUAL
      if (transacoes[i].tipo === "Despesa") {
        despesaMesAtual += transacoes[i].valor;

        const categoria = transacoes[i].categoria;
        const valor = transacoes[i].valor;
        // Se a categoria já existe no objeto, adiciona o valor.
        if (dadosCategoria[categoria]) {
          dadosCategoria[categoria] += valor;
        } else {
          // Se não existe, inicializa com o valor atual.
          dadosCategoria[categoria] = valor;
        }
      } else if (transacoes[i].tipo === "Receita") {
        receitaMesAtual += transacoes[i].valor;
      }

      //INFOS GRAFICO PIZZA
    }

    //CALCULAR SALDO
    if (transacoes[i].tipo === "Despesa") {
      despesaTotal += transacoes[i].valor;
    } else if (transacoes[i].tipo === "Receita") {
      receitaTotal += transacoes[i].valor;
    }
  }
  let saldo = receitaTotal - despesaTotal;

  //VE OS ULTIMOS 6 MESES
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const ultimos6Meses = [];
  for (let i = 5; i >= 0; i--) {
    let d = new Date();
    d.setMonth(d.getMonth() - i);
    ultimos6Meses.push({ mes: d.getMonth(), ano: d.getFullYear() });
  }

  const dados6meses = {};
  let receita = 0;
  let despesa = 0;

  //PEGA AS INFOS DE RECEITA E DESPESA DOS ULTIMOS 6 MESES
  for (let mes of ultimos6Meses) {
    for (let i = 0; i < transacoes.length; i++) {
      let dataTransacao = new Date(transacoes[i].data);
      if (
        mes.mes === dataTransacao.getMonth() &&
        mes.ano === dataTransacao.getFullYear()
      ) {
        if (transacoes[i].tipo === "Despesa") {
          despesa += transacoes[i].valor;
        }
        if (transacoes[i].tipo === "Receita") {
          receita += transacoes[i].valor;
        }
      }
    }
    dados6meses[meses[mes.mes]] = { receita, despesa };
    receita = 0;
    despesa = 0;
  }

  return res.json({
    receitaMesAtual: receitaMesAtual.toFixed(2),
    despesaMesAtual: despesaMesAtual.toFixed(2),
    saldo: saldo.toFixed(2),
    dados6meses,
    dadosCategoria,
    user,
  });
}
