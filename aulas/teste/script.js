const botoesDias = document.querySelectorAll("#dias button")
const botoesRefeicoes = document.querySelectorAll("#refeicoes button")
const campoNome = document.querySelector("#nome-alimento")
const botaoAdicionar = document.querySelector("#adicionar")
const listaNaTela = document.querySelector("#lista")
const textoDia = document.querySelector("#dia-atual")
const textoRefeicao = document.querySelector("#refeicao-atual")
const totalDia = document.querySelector("#total-dia")

const chave = "miniPlanoDeRefeicoes"
const inicio = {
  segunda: { cafe: [], almoco: [] },
  terca: { cafe: [], almoco: [] },
}
let plano = JSON.parse(localStorage.getItem(chave)) || inicio
let diaAtual = "segunda"
let refeicaoAtual = "cafe"

function listaAtual() {
  return plano[diaAtual][refeicaoAtual]
}
function salvarPlano() {
  localStorage.setItem(chave, JSON.stringify(plano))
}

function desenharTela() {
  listaNaTela.innerHTML = ""

  for (const [indice, alimento] of listaAtual().entries()) {
    const item = document.createElement("li")
    const botao = document.createElement("button")

    botao.textContent = "Remover"

    botao.addEventListener("click", function () {
      listaAtual().splice(indice, 1)
      salvarPlano()
      desenharTela()
    })

    item.textContent = alimento.nome
    item.append(botao)

    listaNaTela.append(item)
  }

  for (const botao of botoesRefeicoes) {
    const nome = botao.dataset.refeicao
    const contador = botao.querySelector(".contador")
    contador.textContent = plano[diaAtual][nome].length
  }
  totalDia.textContent =
    plano[diaAtual].cafe.length + plano[diaAtual].almoco.length
}

for (const botao of botoesDias) {
  botao.addEventListener("click", function () {
    diaAtual = botao.dataset.dia
    atualizarSelecao()
    desenharTela()
  })
}
for (const botao of botoesRefeicoes) {
  botao.addEventListener("click", function () {
    refeicaoAtual = botao.dataset.refeicao
    atualizarSelecao()
    desenharTela()
  })
}

function atualizarSelecao() {
  textoDia.textContent = diaAtual
  textoRefeicao.textContent = refeicaoAtual

  for (const botao of botoesDias) {
    botao.classList.toggle("selecionado", botao.dataset.dia === diaAtual)
  }

  for (const botao of botoesRefeicoes) {
    botao.classList.toggle(
      "selecionado",
      botao.dataset.refeicao === refeicaoAtual,
    )
  }
}

botaoAdicionar.addEventListener("click", function () {
  const nome = campoNome.value.trim()
  if (nome === "") return

  listaAtual().push({ nome: nome })
  salvarPlano()
  campoNome.value = ""
  desenharTela()
})
