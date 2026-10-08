const campoDeBusca = document.querySelector("#busca")
const sugestoes = document.querySelector("#sugestoes")
const selecionados = document.querySelector("#selecionados")
const totais = document.querySelector("#totais")

function semAcento(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function buscarAlimentos() {
  sugestoes.innerHTML = ""

  const busca = semAcento(campoDeBusca.value)

  for (const alimento of alimentos) {
    if (!semAcento(alimento.nome).includes(busca) || busca === "") {
      continue
    }

    const opcao = document.createElement("li")
    opcao.textContent = alimento.nome

    opcao.onclick = function () {
      adicionarAlimento(alimento)
      campoDeBusca.value = ""
      sugestoes.innerHTML = ""
    }

    sugestoes.appendChild(opcao)
  }
}

function adicionarAlimento(alimento, quantidadeSalva = 100) {
  const item = document.createElement("li")
  item.dataset.nome = alimento.nome
  item.dataset.carboidratos = alimento.carboidratosPor100g
  item.dataset.proteinas = alimento.proteinasPor100g || 0

  const detalhes = document.createElement("div")
  detalhes.className = "detalhes-alimento"

  const nome = document.createElement("strong")
  nome.textContent = alimento.nome

  const textoGramas = document.createElement("label")
  textoGramas.className = "campo-gramas"
  textoGramas.textContent = "Gramas que comeu:"

  const gramas = document.createElement("input")
  gramas.type = "number"
  gramas.min = "0"
  gramas.value = quantidadeSalva
  textoGramas.appendChild(gramas)

  const resultado = document.createElement("p")
  resultado.className = "resultado-alimento"

  gramas.oninput = function () {
    const quantidade = Number(gramas.value) || 0
    const carboidratos = (alimento.carboidratosPor100g * quantidade) / 100
    const proteinas = ((alimento.proteinasPor100g || 0) * quantidade) / 100

    resultado.textContent =
      "Carboidratos: " +
      carboidratos.toFixed(1) +
      " g | Proteinas: " +
      proteinas.toFixed(1) +
      " g"
    calcularTotais()
  }

  const remover = document.createElement("button")
  remover.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" /></svg>'
  remover.setAttribute("aria-label", "Remover alimento")
  remover.onclick = function () {
    item.remove()
    calcularTotais()
  }

  detalhes.appendChild(nome)
  detalhes.appendChild(textoGramas)
  detalhes.appendChild(resultado)
  item.appendChild(detalhes)
  item.appendChild(remover)
  selecionados.appendChild(item)

  gramas.oninput()
}

function calcularTotais() {
  let carboidratos = 0
  let proteinas = 0

  for (const item of selecionados.children) {
    const gramas = Number(item.querySelector("input").value) || 0
    carboidratos += (Number(item.dataset.carboidratos) * gramas) / 100
    proteinas += (Number(item.dataset.proteinas) * gramas) / 100
  }

  totais.textContent =
    "Total: " +
    carboidratos.toFixed(1) +
    " g de carboidratos e " +
    proteinas.toFixed(1) +
    " g de proteinas"

  const refeicao = []

  for (const item of selecionados.children) {
    refeicao.push({
      nome: item.dataset.nome,
      gramas: item.querySelector("input").value,
    })
  }

  localStorage.setItem(
    "refeicao",
    JSON.stringify({ data: new Date().toDateString(), alimentos: refeicao }),
  )
}

campoDeBusca.oninput = buscarAlimentos

const refeicaoSalva = JSON.parse(localStorage.getItem("refeicao"))

if (refeicaoSalva && refeicaoSalva.data === new Date().toDateString()) {
  for (const itemSalvo of refeicaoSalva.alimentos) {
    const alimento = alimentos.find((item) => item.nome === itemSalvo.nome)

    if (alimento) {
      adicionarAlimento(alimento, itemSalvo.gramas)
    }
  }
} else {
  localStorage.removeItem("refeicao")
}
