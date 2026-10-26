(function initGuest() {
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to') || params.get('name');
  if (to) {
    const clean = decodeURIComponent(to).replace(/\+/g, ' ');
    document.getElementById('guestName').textContent = clean;
    document.getElementById('guestWrap').style.display = 'block';
    const nameInput = document.getElementById('wishName');
    if (nameInput) nameInput.value = clean;
  }
})();

// CREATE PETALS 
(function createPetals() {
  const colors = ['#f9c4d2','#f7b7c5','#e8a0b0','#fde8ef','#fcd4e0','#f5a0b8'];
  const container = document.getElementById('petals');
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (5 + Math.random() * 8) + 's';
    p.style.animationDelay    = (Math.random() * 8) + 's';
    p.style.width  = (8 + Math.random() * 10) + 'px';
    p.style.height = (10 + Math.random() * 12) + 'px';
    p.style.opacity = 0.5 + Math.random() * 0.4;
    container.appendChild(p);
  }
})();

// OPEN INVITATION 
let invitationOpened = false;

function openInvitation() {
  if (invitationOpened) return;
  invitationOpened = true;

  // Show main content first (hidden → visible)
  const main = document.getElementById('mainContent');
  main.classList.remove('hidden');

  // Slide out cover
  const cover = document.getElementById('cover');
  cover.classList.add('closed');

  // autoplay music
  tryPlayMusic();

  // After transition, completely remove cover from flow
  setTimeout(() => {
    cover.style.display = 'none';
  }, 900);

  // Init AOS observer
  initAOS();
}

// MUSIC
const audio = document.getElementById('bgMusic');

function tryPlayMusic() {
    audio.volume = 0.35;

    audio.play().catch((error) => {
        console.log('Musik gagal diputar:', error);
    });
}

// COPY TO CLIPBOARD 
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Tersalin ✓';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Salin Nomor';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Tersalin!');
  });
}

// LIGHTBOX 
(function initGallery() {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src));
  });
})();

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// AOS (Animate On Scroll)
function initAOS() {
  const targets = document.querySelectorAll('[data-aos]');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

// TOAST 
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '4.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a1200',
    color: '#e8d5a3',
    padding: '0.6rem 1.5rem',
    borderRadius: '50px',
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: '9999',
    border: '1px solid rgba(201,169,110,0.4)',
    transition: 'opacity 0.4s',
    whiteSpace: 'nowrap',
  });
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// INIT 
document.addEventListener('DOMContentLoaded', () => {
  renderWishes();
});
