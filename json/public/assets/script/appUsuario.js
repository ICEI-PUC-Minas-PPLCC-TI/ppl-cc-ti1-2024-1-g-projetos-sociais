const usuarioId = 1; // ID do usuário para o qual você deseja obter os projetos

// Função para obter os projetos associados a um usuário específico
async function obterProjetosDoUsuario(usuarioId) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
        const usuario = await response.json();
        const projetosIds = usuario.id_projetos;

        // Obter detalhes dos projetos
        const projetos = await Promise.all(projetosIds.map(async (projetoId) => {
            const response = await fetch(`http://localhost:3000/projetos/${projetoId}`);
            return await response.json();
        }));

        return projetos;
    } catch (error) {
        console.error('Erro ao obter projetos do usuário:', error);
        return [];
    }
}

// Função para preencher dinamicamente o HTML com as informações dos projetos
async function preencherProjetosNoHTML() {
    try {
        const projetos = await obterProjetosDoUsuario(usuarioId);

        // Selecionar o elemento onde os projetos serão inseridos
        const view1 = document.getElementById('view1');

        // Limpar o conteúdo atual, se houver
        view1.innerHTML = '';

        // Para cada projeto, criar e adicionar um elemento HTML com suas informações
        projetos.forEach(projeto => {
            const cardClone = criarCard(projeto);
            view1.appendChild(cardClone);
        });

    } catch (error) {
        console.error('Erro ao preencher projetos no HTML:', error);
    }
}

function criarCard(projeto) {
    const cardTemplate = document.getElementById('card_template');
    const cardClone = cardTemplate.content.cloneNode(true);

    // Preencher informações do projeto no card
    cardClone.querySelector('.anfitriao').textContent = projeto.nome_anfitriao;
    cardClone.querySelector('.projtitulo').textContent = projeto.nome_projeto;
    cardClone.querySelector('.temas').textContent = projeto.tema;
    cardClone.querySelector('.resumo').textContent = projeto.resumo;

    const checkboxes = cardClone.querySelectorAll('#div-avaliacao input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const divAvaliacao = checkbox.closest('#div-avaliacao').querySelector('#avaliacao');
            const valorCheckbox = checkbox.value;
            const estrelas = divAvaliacao.querySelectorAll(`i.estrela-${valorCheckbox}`);
            let estrelasHtml = '';
            estrelas.forEach(estrela => {
                estrelasHtml += estrela.outerHTML;
            });

            // Atualizar o texto de avaliação no HTML
            divAvaliacao.innerHTML = `Sua avaliação: ${estrelasHtml}`;

            // Criar e adicionar o botão de edição
            const botaoEditarNota = document.createElement('button');
            botaoEditarNota.id = 'btnEditarNota';
            botaoEditarNota.textContent = 'Editar Nota';
            divAvaliacao.appendChild(botaoEditarNota);

            // Configurar o botão de edição
            botaoEditarNota.addEventListener('click', function() {
                editarNota(projeto.id, valorCheckbox, divAvaliacao);
            });

            // Obter o ID do projeto a partir do objeto projeto
            const projetoId = parseInt(projeto.id);

            // Atualizar a classe notas do projeto no db.json com a nota selecionada
            atualizarNotasNoDB(projetoId, valorCheckbox);
        });
    });

    return cardClone;
}

// Função para atualizar a classe notas do projeto no db.json
async function atualizarNotasNoDB(projetoId, nota) {
    try {
        // Obter o projeto atual do servidor
        const response = await fetch(`http://localhost:3000/projetos/${projetoId}`);
        let projeto = await response.json();

        // Atualizar a propriedade notas do projeto
        projeto.notas.push(parseInt(nota)); // Adicionar nota à lista de notas

        // Enviar a atualização para o servidor
        const updateResponse = await fetch(`http://localhost:3000/projetos/${projetoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projeto)
        });

        if (!updateResponse.ok) {
            throw new Error('Erro ao atualizar notas no servidor.');
        }

        console.log(`Notas atualizadas com sucesso para o projeto ${projetoId} no db.json.`);
    } catch (error) {
        console.error('Erro ao atualizar notas no db.json:', error);
    }
}

// Função para editar a nota
async function editarNota(projetoId, nota, divAvaliacao) {
    try {
        // Obter o projeto atual do servidor
        const response = await fetch(`http://localhost:3000/projetos/${projetoId}`);
        let projeto = await response.json();

        // Remover a nota específica
        projeto.notas = projeto.notas.filter(n => n !== parseInt(nota));

        // Enviar a atualização para o servidor
        const updateResponse = await fetch(`http://localhost:3000/projetos/${projetoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projeto)
        });

        if (!updateResponse.ok) {
            throw new Error('Erro ao atualizar notas no servidor.');
        }

        console.log(`Nota removida com sucesso para o projeto ${projetoId} no db.json.`);

        // Restaurar as checkboxes no HTML utilizando o template fornecido
        preencherProjetosNoHTML();
        // Reconfigurar os checkboxes para permitir nova avaliação
        
    } catch (error) {
        console.error('Erro ao remover nota no db.json:', error);
    }
}

// Chamar a função para preencher os projetos no carregamento da página
window.addEventListener('load', preencherProjetosNoHTML);