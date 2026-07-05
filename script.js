// ===== QR DINÂMICO =====

const qrImages = [
  "assets/qr1.png",
  "assets/qr2.png",
  "assets/qr3.png",
  "assets/qr4.png",
  "assets/qr5.png"
];

let qrIndex = 0;

function updateQR(){
  qrIndex = (qrIndex + 1) % qrImages.length;

  document.querySelectorAll(".qr-img").forEach(img => {
    img.src = qrImages[qrIndex];
  });

  // reinicia animação da barra de forma estável no iOS Safari
  document.querySelectorAll(".progress-bar").forEach(bar => {
    bar.style.animation = "none";
    void bar.getBoundingClientRect();
    requestAnimationFrame(() => {
      bar.style.animation = "";
    });
  });
}

setInterval(updateQR, 20000);


// ===== SWIPE CARROSSEL (Pointer Events — funciona iOS + Android + Desktop) =====

const carousel  = document.querySelector('.carousel');
const track     = document.querySelector('.carousel-track');
const wrappers  = document.querySelectorAll('.ticket-wrapper');
const total     = wrappers.length;

let currentIndex = 0;

function moveCarousel() {
  const slideWidth = carousel.offsetWidth;
  track.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";
}

let pointerStartX  = 0;
let pointerStartY  = 0;
let isPointerDown  = false;
let isHorizontal   = null;

track.addEventListener('pointerdown', function(e) {
  // ignora cliques duplicados (dblclick no iOS)
  if (e.pointerType === 'mouse' && e.button !== 0) return;

  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  isPointerDown = true;
  isHorizontal  = null;

  // captura o ponteiro para receber move/up mesmo fora do elemento
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