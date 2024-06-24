const questionCardTemplate=document.querySelector("[data-question-template]")
const questionCardContainer=document.querySelector("[data-question-card-container]")
const searchInput=document.querySelector("[data-search]")
searchInput.addEventListener("input",(e)=> { const value = e.target.value
console.log(questions)
})
let question = []
fetch('assets/java/question.json')
 .then(res => res.json())
 .then(data => {
    questions = data.array.forEach(element =>{
        const card = questionCardTemplate.content.cloneNode(true).children[0]
        const header = card.querySelector("[data-header]")
        const body = card.querySelector("[data-body]")
        header.textContent = question.titulo
        body.textContent = question.texto
        questionCardContainer.append(card)
        return { titulo: question.titulo, texto: question.texto, element: card }
    });
 })