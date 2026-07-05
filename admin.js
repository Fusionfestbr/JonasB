var STORAGE_KEY = 'meus-ingressos-data';
var ingressosList = document.getElementById('ingressos-list');
var btnAdd = document.getElementById('btnAdd');
var btnSave = document.getElementById('btnSave');
var btnPreview = document.getElementById('btnPreview');
var toast = document.getElementById('toast');

var camposTemplate = [
  { key: 'setor',     label: 'SETOR',     placeholder: 'Ex: Cadeira Superior' },
  { key: 'acesso',    label: 'ACESSO',    placeholder: 'Ex: Portão B' },
  { key: 'titular',   label: 'TITULAR',   placeholder: 'Ex: Camila Souza - 121.714.481-87' },
  { key: 'taxa',      label: 'TAXA',      placeholder: 'Ex: INTEIRA - R$380,00' },
  { key: 'secao',     label: 'SEÇÃO',     placeholder: 'Ex: CADEIRA SUPERIOR' },
  { key: 'fileira',   label: 'FILEIRA',   placeholder: 'Ex: Não numerado' },
  { key: 'abertura',  label: 'ABERTURA',  placeholder: 'Ex: 16:00' },
  { key: 'inicio',    label: 'INÍCIO',    placeholder: 'Ex: 19:30' }
];

// --- Renderiza um card de ingresso ---
function criarCardIngresso(dados, index) {
  var card = document.createElement('div');
  card.className = 'ingresso-card';

  var header = document.createElement('div');
  header.className = 'ingresso-header';

  var num = document.createElement('span');
  num.className = 'ingresso-num';
  num.textContent = 'Ingresso ' + (index + 1);

  var btnRem = document.createElement('button');
  btnRem.className = 'btn-remove';
  btnRem.textContent = '✕ Remover';
  btnRem.addEventListener('click', function() {
    card.remove();
    renumerar();
  });

  header.appendChild(num);
  header.appendChild(btnRem);
  card.appendChild(header);

  // linha 1: setor + acesso
  var row1 = document.createElement('div');
  row1.className = 'row';
  row1.appendChild(criarCampo(camposTemplate[0], dados));
  row1.appendChild(criarCampo(camposTemplate[1], dados));
  card.appendChild(row1);

  // titular (full width)
  card.appendChild(criarCampo(camposTemplate[2], dados));

  // taxa (full width)
  card.appendChild(criarCampo(camposTemplate[3], dados));

  // linha 2: seção + fileira
  var row2 = document.createElement('div');
  row2.className = 'row';
  row2.appendChild(criarCampo(camposTemplate[4], dados));
  row2.appendChild(criarCampo(camposTemplate[5], dados));
  card.appendChild(row2);

  // linha 3: abertura + início
  var row3 = document.createElement('div');
  row3.className = 'row';
  row3.appendChild(criarCampo(camposTemplate[6], dados));
  row3.appendChild(criarCampo(camposTemplate[7], dados));
  card.appendChild(row3);

  return card;
}

function criarCampo(campo, dados) {
  var div = document.createElement('div');
  div.className = 'field';

  var label = document.createElement('label');
  label.textContent = campo.label;

  var input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('data-key', campo.key);
  input.placeholder = campo.placeholder;
  if (dados && dados[campo.key]) {
    input.value = dados[campo.key];
  }

  div.appendChild(label);
  div.appendChild(input);
  return div;
}

function renumerar() {
  var cards = ingressosList.querySelectorAll('.ingresso-card');
  cards.forEach(function(card, i) {
    card.querySelector('.ingresso-num').textContent = 'Ingresso ' + (i + 1);
  });
}

// --- Carrega dados salvos ---
function carregarDados() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function preencherFormulario(dados) {
  if (!dados) return;

  if (dados.evento) {
    document.getElementById('evNome').value = dados.evento.nome || '';
    document.getElementById('evData').value = dados.evento.data || '';
    document.getElementById('evHora').value = dados.evento.hora || '';
    document.getElementById('evLocal').value = dados.evento.local || '';
  }

  if (dados.ingressos && dados.ingressos.length > 0) {
    dados.ingressos.forEach(function(ing, i) {
      var card = criarCardIngresso(ing, i);
      ingressosList.appendChild(card);
    });
  } else {
    // adiciona um vazio
    adicionarIngresso();
  }
}

// --- Adiciona ingresso vazio ---
function adicionarIngresso(dados) {
  var index = ingressosList.querySelectorAll('.ingresso-card').length;
  var card = criarCardIngresso(dados || {}, index);
  ingressosList.appendChild(card);
}

// --- Salvar ---
function salvar() {
  var dados = {
    evento: {
      nome: document.getElementById('evNome').value.trim(),
      data: document.getElementById('evData').value.trim(),
      hora: document.getElementById('evHora').value.trim(),
      local: document.getElementById('evLocal').value.trim()
    },
    ingressos: []
  };

  var cards = ingressosList.querySelectorAll('.ingresso-card');
  cards.forEach(function(card) {
    var ing = {};
    card.querySelectorAll('input').forEach(function(input) {
      var key = input.getAttribute('data-key');
      if (key) ing[key] = input.value.trim();
    });
    dados.ingressos.push(ing);
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));

  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 2000);
}

// --- Eventos ---
btnAdd.addEventListener('click', function() {
  adicionarIngresso();
});

btnSave.addEventListener('click', function() {
  salvar();
});

btnPreview.addEventListener('click', function() {
  salvar();
  window.location.href = 'ingresso.html';
});

// --- Init ---
var dadosSalvos = carregarDados();
preencherFormulario(dadosSalvos);
