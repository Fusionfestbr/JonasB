// ===== RENDERIZAÇÃO DINÂMICA =====

var STORAGE_KEY = 'meus-ingressos-data';

var fallbackDados = {
  evento: {
    nome: "ENHYPEN WORLD TOUR 'BLOOD SAGA' IN SÃO PAULO",
    data: "04/07/2026",
    hora: "19:30hs",
    local: "Nubank Parque"
  },
  ingressos: [
    { setor:"Cadeira Superior",  acesso:"Portão B", titular:"Camila Souza - 121.714.481-87", taxa:"INTEIRA - R$380,00", secao:"CADEIRA SUPERIOR",  fileira:"Não numerado", abertura:"16:00", inicio:"19:30" },
    { setor:"Pista Premium",     acesso:"Portão B", titular:"Camila Souza - 121.714.481-87", taxa:"INTEIRA - R$800,00", secao:"PISTA PREMIUM",     fileira:"Não numerado", abertura:"16:00", inicio:"19:30" },
    { setor:"Pista",             acesso:"Portão A", titular:"Camila Souza - 121.714.481-87", taxa:"INTEIRA - R$420,00", secao:"PISTA",             fileira:"Não numerado", abertura:"16:00", inicio:"19:30" },
    { setor:"Cadeira Inferior",  acesso:"Portão C", titular:"Camila Souza - 121.714.481-87", taxa:"INTEIRA - R$500,00", secao:"CADEIRA INFERIOR",  fileira:"Não numerado", abertura:"16:00", inicio:"19:30" }
  ]
};

function carregarDados() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function renderizarPagina(dados) {
  // header
  var ev = dados.evento;
  document.getElementById('evTitulo').textContent = ev.nome || '';
  document.getElementById('evSubtitulo').textContent = (ev.data || '') + (ev.hora ? ' - ' + ev.hora : '') + (ev.local ? ' - ' + ev.local : '');

  // ingressos
  var track = document.getElementById('carouselTrack');
  track.innerHTML = '';

  dados.ingressos.forEach(function(ing) {
    var w = document.createElement('div');
    w.className = 'ticket-wrapper';
    w.innerHTML =
      '<div class="ticketmaster-img"><img src="assets/ticketmaster.png"></div>' +
      '<div class="progress-container"><div class="progress-bar"></div></div>' +
      '<div class="ticket-card top-card">' +
        '<div class="ticket-top">' +
          '<div class="qr-area"><img src="assets/qr1.png" class="qr-img"></div>' +
          '<div class="ticket-side">' +
            '<div class="side-block"><span class="mini-label">SETOR</span><span class="sector-name">' + (ing.setor || '') + '</span></div>' +
            '<div class="side-block acesso"><span class="mini-label">ACESSO</span><span class="sector-name acesso-value">' + (ing.acesso || '') + '</span></div>' +
            '<button class="more-info-btn">Mais informação</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ticket-card info-card">' +
        '<div class="info-full"><span class="mini-label">TITULAR</span><span class="info-value">' + (ing.titular || '') + '</span></div>' +
        '<div class="info-full"><span class="mini-label">TAXA</span><span class="info-value">' + (ing.taxa || '') + '</span></div>' +
        '<div class="info-row"><div><span class="mini-label">SEÇÃO</span><span class="info-value">' + (ing.secao || '') + '</span></div><div><span class="mini-label">FILEIRA</span><span class="info-value">' + (ing.fileira || '') + '</span></div></div>' +
        '<div class="info-row"><div><span class="mini-label">ABERTURA</span><span class="info-value">' + (ing.abertura || '') + '</span></div><div><span class="mini-label">INICIO</span><span class="info-value">' + (ing.inicio || '') + '</span></div></div>' +
      '</div>';
    track.appendChild(w);
  });
}

// Renderiza antes de tudo
var dadosSalvos = carregarDados() || fallbackDados;
renderizarPagina(dadosSalvos);


// ===== QR DINÂMICO =====

var qrImages = [
  "assets/qr1.png",
  "assets/qr2.png",
  "assets/qr3.png",
  "assets/qr4.png",
  "assets/qr5.png"
];

var qrIndex = 0;

function updateQR(){
  qrIndex = (qrIndex + 1) % qrImages.length;

  document.querySelectorAll(".qr-img").forEach(function(img) {
    img.src = qrImages[qrIndex];
  });

  document.querySelectorAll(".progress-bar").forEach(function(bar) {
    bar.style.animation = "none";
    void bar.getBoundingClientRect();
    requestAnimationFrame(function() {
      bar.style.animation = "";
    });
  });
}

setInterval(updateQR, 20000);


// ===== SWIPE CARROSSEL (Pointer Events — iOS + Android + Desktop) =====

var carousel  = document.querySelector('.carousel');
var track     = document.querySelector('.carousel-track');
var wrappers  = document.querySelectorAll('.ticket-wrapper');
var total     = wrappers.length;

var currentIndex = 0;

function moveCarousel() {
  var slideWidth = carousel.offsetWidth;
  track.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";
}

var pointerStartX  = 0;
var pointerStartY  = 0;
var isPointerDown  = false;
var isHorizontal   = null;

track.addEventListener('pointerdown', function(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  isPointerDown = true;
  isHorizontal  = null;

  track.setPointerCapture(e.pointerId);
}, { passive: true });

track.addEventListener('pointermove', function(e) {
  if (!isPointerDown) return;

  var diffX = e.clientX - pointerStartX;
  var diffY = e.clientY - pointerStartY;

  if (isHorizontal === null) {
    if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      isHorizontal = Math.abs(diffX) >= Math.abs(diffY);
    }
  }

  if (isHorizontal === true) {
    e.preventDefault();
  }
}, { passive: false });

track.addEventListener('pointerup', function(e) {
  if (!isPointerDown) return;
  isPointerDown = false;

  var diffX = e.clientX - pointerStartX;

  if (isHorizontal === true && Math.abs(diffX) > 40) {
    if (diffX < 0) {
      currentIndex = Math.min(currentIndex + 1, total - 1);
    } else {
      currentIndex = Math.max(currentIndex - 1, 0);
    }
    moveCarousel();
  }

  isHorizontal = null;
}, { passive: true });

track.addEventListener('pointercancel', function() {
  isPointerDown = false;
  isHorizontal  = null;
});
