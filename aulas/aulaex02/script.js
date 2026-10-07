const formulario = document.getElementById("form")
const campoIdade = document.getElementById("idade")
const resultado = document.getElementById("res")

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault()

  const idade = Number(campoIdade.value)

  if (!Number.isInteger(idade) || idade < 0) {
    resultado.textContent = "Digite uma idade válida."
    return
  }

  resultado.textContent =
    idade >= 18 ? "Você é maior de idade." : "Você é menor de idade."
})
