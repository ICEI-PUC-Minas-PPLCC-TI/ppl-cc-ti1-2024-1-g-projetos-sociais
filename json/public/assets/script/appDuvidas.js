import { create, router as _router, defaults } from 'json-server'
const server = create()
const router = _router('./db/db.json')

// Para permitir que os dados sejam alterados, altere a linha abaixo
// colocando o atributo readOnly como false.
const middlewares = defaults()

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server está em execução!')
})
const urlDuvida = '/question'
let cidades = []

function carregaDadosJSONServer (func) {
    fetch(urlDuvida)
        .then (function (response) { return response.json() })
        .then (function (dados) {
            cidades = dados
            console.log ('Dados carregados!')
            func ()
        })
}
function carregaDadosJSONServer(func) {
    fetch(urlDuvidas)
        .then(function (response) { return response.json() })
        .then(function (dados) {
            cidades = dados
            console.log('Dados carregados!')
            func()
        })
}
function carregaDados() {
    let ulDuvidas = document.getElementById('ulDuvidas');
    strTextoHTML = '';

    for (let i = 0; i < question.length; i++) {
        let question = question[i];
        strTextoHTML += `<li>
                                    <a href="exibequestao.html?id=${question.id}">
                                        ${question.titulo} - ${question.texto} - ${question.duvida - relacionada}</a>
                                </li>`
    }

    ul.innerHTML = strTextoHTML;
}
carregaDadosJSONServer(carregaDados);
