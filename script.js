/* ==================== CUSTOM CURSOR ==================== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverElements = document.querySelectorAll('a, button, .link-item, .ctrl-btn, .music-btn, .social-icon');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ==================== PARTICLE BACKGROUND ==================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.color = Math.random() > 0.5 ? '0, 198, 255' : '196, 113, 237';
    this.opacity = Math.random() * 0.5 + 0.2;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }
  draw() {
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    if (mouse.x && mouse.y) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        this.x -= dx / dist * force * 3;
        this.y -= dy / dist * force * 3;
      }
    }

    particles.forEach(p => {
      if (p === this) return;
      let dx = this.x - p.x;
      let dy = this.y - p.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.strokeStyle = `rgba(0, 198, 255, ${0.15 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor(window.innerWidth / 15));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==================== TYPING EFFECT ==================== */
const typingText = document.getElementById('typing-text');
const phrases = [
  'MUA FILE LIÊN HỆ ADMIN',
  'BẠN MUỐN FILE GÌ CÓ',
  'QUANG TRỌNG BẠN CÓ TIỀN HAY KO',
  'CÓ THÌ BẠN MÚC LUÔN KHÔNG',
  '🌟 Follow để ủng hộ mình nhé!'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typingText.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }
  setTimeout(typeEffect, speed);
}
typeEffect();

/* ==================== COUNTER ANIMATION ==================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased).toLocaleString('vi-VN');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counters = document.querySelectorAll('.stat-value');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ==================== THEME TOGGLE ==================== */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  showToast(next === 'dark' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng');
});

/* ==================== MUSIC PLAYER ==================== */
const musicToggle = document.getElementById('music-toggle');
const musicIcon = musicToggle.querySelector('i');
const bgMusic = document.getElementById('bg-music');
const visualizer = document.getElementById('visualizer');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    musicIcon.className = 'fas fa-play';
    visualizer.classList.add('paused');
    showToast('⏸️ Đã tạm dừng nhạc');
  } else {
    bgMusic.play().catch(() => showToast('⚠️ Không thể phát nhạc'));
    musicIcon.className = 'fas fa-pause';
    visualizer.classList.remove('paused');
    showToast('🎵 Đang phát nhạc Lofi');
  }
  isPlaying = !isPlaying;
});

/* ==================== RIPPLE + NAVIGATE ==================== */
document.querySelectorAll('.link-item, .social-icon').forEach(el => {
  el.addEventListener('click', function(e) {
    const url = this.dataset.url || '#';
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    if (url !== '#') {
      e.preventDefault();
      setTimeout(() => window.open(url, '_blank'), 300);
    }
  });
});

/* ==================== SHARE MODAL ==================== */
const shareModal = document.getElementById('share-modal');
const shareBtn = document.getElementById('share-btn');
const modalClose = document.getElementById('modal-close');
const shareUrlInput = document.getElementById('share-url-input');
const copyBtn = document.getElementById('copy-btn');
let qrGenerated = false;

function openShareModal() {
  shareModal.classList.add('active');
  const currentUrl = window.location.href;
  shareUrlInput.value = currentUrl;
  if (!qrGenerated) {
    new QRCode(document.getElementById('qr-code'), {
      text: currentUrl, width: 180, height: 180,
      colorDark: '#0b0f1a', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    qrGenerated = true;
  }
}
shareBtn.addEventListener('click', openShareModal);
modalClose.addEventListener('click', () => shareModal.classList.remove('active'));
shareModal.addEventListener('click', (e) => { if (e.target === shareModal) shareModal.classList.remove('active'); });

copyBtn.addEventListener('click', () => {
  shareUrlInput.select();
  document.execCommand('copy');
  showToast('✅ Đã sao chép link!');
});

document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.share;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out my VIP vionchu! ✨');
    let shareUrl = '';
    switch(type) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
      case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
});

/* ==================== CONFETTI ==================== */
const confettiBtn = document.getElementById('confetti-btn');
const confettiColors = ['#00c6ff', '#c471ed', '#f64f59', '#22c55e', '#fbbf24', '#ffffff'];

function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.classList.add('confetti');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      c.style.width = (Math.random() * 8 + 6) + 'px';
      c.style.height = (Math.random() * 8 + 6) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.animationDuration = (Math.random() * 2 + 2) + 's';
      c.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 30);
  }
  showToast('Chúc mừng! Bạn thật là chó!');
}
confettiBtn.addEventListener('click', launchConfetti);

/* ==================== TOAST ==================== */
const toast = document.getElementById('toast');
let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ==================== 3D TILT ==================== */
const card = document.getElementById('card');
card.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -4;
  const rotateY = ((x - centerX) / centerX) * 4;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});
card.addEventListener('mouseleave', () => {
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
});

/* ==================== KEYBOARD SHORTCUTS ==================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') shareModal.classList.remove('active');
  if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); musicToggle.click(); }
  if (e.key.toLowerCase() === 'c' && e.target === document.body) launchConfetti();
});

/* ==================== AUTO CONFETTI ON LOAD ==================== */
setTimeout(() => launchConfetti(), 1500);
