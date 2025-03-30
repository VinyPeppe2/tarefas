let nameTarefa = document.getElementById('entryList');
let botaoTarefa = document.getElementById('buttonList');
let tarefas = document.getElementById('listTarefa');

// Carregar tarefas salvas ao abrir a página
document.addEventListener('DOMContentLoaded', carregarTarefas);

botaoTarefa.addEventListener('click', () => {
    if (nameTarefa.value.trim() === '') {
        alert('Digite a nova tarefa!');
        nameTarefa.focus();
    } else {
        adicionarTarefa(nameTarefa.value.trim().toUpperCase());
        nameTarefa.value = ''; // Limpar o campo de input
    }
});

function adicionarTarefa(texto) {
    // Criar elemento de tarefa
    let div = document.createElement('div');
    div.classList.add('tarefas');

    let p = document.createElement('p');
    p.textContent = texto;

    let img = document.createElement('img');
    img.src = "lixeira.png";
    img.alt = "Deletar Tarefa";
    img.classList.add('lixeira');

    // Adiciona evento para deletar ao clicar na lixeira
    img.addEventListener('click', function () {
        div.remove();
        salvarTarefas(); // Atualizar LocalStorage ao remover
    });

    div.appendChild(p);
    div.appendChild(img);
    tarefas.appendChild(div);

    salvarTarefas(); // Salvar após adicionar nova tarefa
}

function salvarTarefas() {
    let listaTarefas = [];
    document.querySelectorAll('.tarefas p').forEach(tarefa => {
        listaTarefas.push(tarefa.textContent);
    });
    localStorage.setItem('tarefas', JSON.stringify(listaTarefas));
}

function carregarTarefas() {
    let tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
        JSON.parse(tarefasSalvas).forEach(tarefa => {
            adicionarTarefa(tarefa);
        });
    }
}

/*
let nameTarefa = document.getElementById('entryList');
let botaoTarefa = document.getElementById('buttonList');
let tarefas = document.getElementById('listTarefa');

botaoTarefa.addEventListener('click', () =>{
    if (nameTarefa.value.trim() == ''){
        alert('Digite a nova tarefa!')
    }
    else{
        tarefas.innerHTML += 
        `<div class="tarefas">
            <p id="addTarefa">
                ${nameTarefa.value.trim().toUpperCase()}
            </p>
            <img class="lixeira" src="lixeira.png" alt="Deletar Tarefa">
        </div>`;
        //Chamada para deletar
        deletarItem();
    }
})

function deletarItem(){
    let apagar = document.querySelectorAll('.lixeira');
    for (let i=0; i < apagar.length; i++){
        apagar[i].addEventListener('click', function(){
            this.parentNode.remove();
            nameTarefa.value = '';
            nameTarefa.focus();
        });
    }
}*/



/*
let nameTarefa = document.getElementById('entryList');
let botaoTarefa = document.getElementById('buttonList');
let tarefas = document.getElementById('listTarefa');

botaoTarefa.addEventListener('click', () => {
    if (nameTarefa.value.trim() == '') {
        alert('Digite a nova tarefa!');
    } else {
        // Criando um container para a tarefa
        let tarefaDiv = document.createElement('div');
        tarefaDiv.classList.add('tarefas');

        // Criando o elemento de texto da tarefa
        let tarefaTexto = document.createElement('p');
        tarefaTexto.textContent = nameTarefa.value.trim().toUpperCase();
        tarefaTexto.id = "addTarefa";

        // Criando o botão de deletar
        let botaoDeletar = document.createElement('img');
        botaoDeletar.src = "lixeira.png";
        botaoDeletar.alt = "Deletar Tarefa";
        botaoDeletar.classList.add('lixeira');

        // Adicionando evento de remoção diretamente ao botão de deletar
        botaoDeletar.addEventListener('click', function () {
            tarefaDiv.remove();
        });

        // Adicionando elementos à div da tarefa
        tarefaDiv.appendChild(tarefaTexto);
        tarefaDiv.appendChild(botaoDeletar);

        // Adicionando a tarefa à lista
        tarefas.appendChild(tarefaDiv);

        // Limpando o campo de entrada
        nameTarefa.value = '';
        nameTarefa.focus();
    }
});*/
