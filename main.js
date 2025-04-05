const nameTarefa = document.getElementById('entryList');
const botaoTarefa = document.getElementById('buttonList');
const tarefas = document.getElementById('listTarefa');
const totalTarefas = document.getElementById('totalTarefas');
const tarefasConcluidas = document.getElementById('tarefasConcluidas');
const barraProgresso = document.getElementById('barraProgresso');
const toggleDarkMode = document.getElementById('toggleDarkMode');

document.addEventListener('DOMContentLoaded', () => {
  carregarTarefas();
  adicionarBotaoExportar();
  aplicarPreferenciaDarkMode();
  nameTarefa.focus();
});

botaoTarefa.addEventListener('click', () => {
  const texto = nameTarefa.value.trim().toUpperCase();
  if (texto === '') {
    alert('Digite a nova tarefa!');
    nameTarefa.focus();
  } else if (verificarDuplicada(texto)) {
    alert('Esta tarefa já foi adicionada!');
  } else {
    adicionarTarefa(texto);
    nameTarefa.value = '';
  }
});

nameTarefa.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') botaoTarefa.click();
});

toggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('modoEscuro', document.body.classList.contains('dark'));
});

function aplicarPreferenciaDarkMode() {
  const modoEscuroAtivo = localStorage.getItem('modoEscuro') === 'true';
  if (modoEscuroAtivo) {
    document.body.classList.add('dark');
  }
}

function verificarDuplicada(texto) {
  const tarefasExistentes = document.querySelectorAll('.tarefas p');
  return Array.from(tarefasExistentes).some(p => p.textContent === texto);
}

function adicionarTarefa(texto, concluida = false) {
  const div = document.createElement('div');
  div.classList.add('tarefas');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = concluida;

  const p = document.createElement('p');
  p.textContent = texto;
  if (concluida) p.classList.add('concluida');

  checkbox.addEventListener('change', () => {
    p.classList.toggle('concluida');
    salvarTarefas();
    atualizarContador();
  });

  const btnEditar = document.createElement('button');
  btnEditar.textContent = "✏️";
  btnEditar.classList.add('editar');
  btnEditar.title = "Editar tarefa";
  btnEditar.style.border = '0.1px solid black'

  btnEditar.addEventListener('click', () => {
    const novoTexto = prompt("Edite a tarefa:", p.textContent);
    if (novoTexto && novoTexto.trim() !== "") {
      p.textContent = novoTexto.trim().toUpperCase();
      salvarTarefas();
    }
  });

  const img = document.createElement('img');
  img.src = "lixeira.png";
  img.alt = "Deletar Tarefa";
  img.classList.add('lixeira');
  img.style.border = '0.1px solid black';
  img.style.borderRadius = '30px'

  img.addEventListener('click', () => {
    if (confirm("Deseja excluir esta tarefa?")) {
      div.remove();
      salvarTarefas();
      atualizarContador();
    }
  });

  div.appendChild(checkbox);
  div.appendChild(p);

  const divBotoes = document.createElement('div');
  divBotoes.classList.add('botoes');
  divBotoes.appendChild(btnEditar);
  divBotoes.appendChild(img);

  div.appendChild(divBotoes);
  tarefas.appendChild(div);

  salvarTarefas();
  atualizarContador();
}

function salvarTarefas() {
  const listaTarefas = [];

  document.querySelectorAll('.tarefas').forEach(div => {
    const texto = div.querySelector('p').textContent;
    const concluida = div.querySelector('input[type="checkbox"]').checked;
    listaTarefas.push({ texto, concluida });
  });

  localStorage.setItem('tarefas', JSON.stringify(listaTarefas));
}

function carregarTarefas() {
  const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefasSalvas.forEach(({ texto, concluida }) => {
    adicionarTarefa(texto, concluida);
  });
}

function atualizarContador() {
  const total = document.querySelectorAll('.tarefas').length;
  const concluidas = document.querySelectorAll('.tarefas input[type="checkbox"]:checked').length;

  totalTarefas.textContent = total;
  tarefasConcluidas.textContent = concluidas;

  const porcentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);
  barraProgresso.style.width = `${porcentagem}%`;
}

function adicionarBotaoExportar() {
  const btnExportar = document.createElement('button');
  btnExportar.textContent = 'Exportar Lista 📄';
  btnExportar.style.marginTop = '15px';
  btnExportar.style.width = '100%';
  btnExportar.style.padding = '10px';
  btnExportar.style.backgroundColor = '#28a745';
  btnExportar.style.color = '#fff';
  btnExportar.style.border = '1px solid black';
  btnExportar.style.borderRadius = '5px';
  btnExportar.style.cursor = 'pointer';

  btnExportar.addEventListener('click', exportarParaPDF);
  document.querySelector('.container').appendChild(btnExportar);
}

async function exportarParaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
  const hora = dataAtual.toLocaleTimeString('pt-BR');

  const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const concluidas = tarefasSalvas.filter(t => t.concluida);
  const pendentes = tarefasSalvas.filter(t => !t.concluida);

  let y = 10;

  doc.setFontSize(14);
  doc.text(`Lista de Tarefas - ${dataFormatada} ${hora}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Total: ${tarefasSalvas.length}`, 10, y);
  doc.text(`Concluídas: ${concluidas.length}`, 80, y);
  doc.text(`Pendentes: ${pendentes.length}`, 150, y);
  y += 10;

  doc.setFontSize(13);
  doc.text("Tarefas Concluídas:", 10, y);
  y += 8;
  concluidas.forEach((tarefa, index) => {
    doc.text(`${index + 1}. ${tarefa.texto}`, 12, y);
    y += 8;
  });

  if (concluidas.length === 0) {
    doc.text("Nenhuma tarefa concluída.", 12, y);
    y += 8;
  }

  y += 5;
  doc.setFontSize(13);
  doc.text("Tarefas Pendentes:", 10, y);
  y += 8;
  pendentes.forEach((tarefa, index) => {
    doc.text(`${index + 1}. ${tarefa.texto}`, 12, y);
    y += 8;
  });

  if (pendentes.length === 0) {
    doc.text("Nenhuma tarefa pendente.", 12, y);
  }

  doc.save(`lista_tarefas_${dataAtual.toISOString().slice(0,10)}.pdf`);
}
