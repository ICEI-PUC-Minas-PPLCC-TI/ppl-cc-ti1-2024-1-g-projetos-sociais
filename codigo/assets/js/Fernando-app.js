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
