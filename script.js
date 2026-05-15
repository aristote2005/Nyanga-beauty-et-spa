/* =============================================
   NYANGA BEAUTY & SPA — script.js
   ============================================= */

/* ---- CURSOR ---- */
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .social-card, .service-card, .about-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    follower.style.width = '56px'; follower.style.height = '56px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px'; cursor.style.height = '10px';
    follower.style.width = '36px'; follower.style.height = '36px';
  });
});

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});
document.body.style.overflow = 'hidden';

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const sections = ['accueil','apropos','services','reservation','contact'];
  const scrollPos = window.scrollY + 120;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (sec && link) {
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      link.classList.toggle('active', scrollPos >= top && scrollPos < bot);
    }
  });
}

/* ---- SCROLL TO SECTION ---- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---- PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 6}s;
      width: ${1 + Math.random() * 2.5}px;
      height: ${1 + Math.random() * 2.5}px;
      opacity: ${0.2 + Math.random() * 0.6};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- SERVICE TABS ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.service-cat').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`.service-cat[data-cat="${cat}"]`).classList.add('active');
    // re-trigger scroll reveals for newly visible cards
    document.querySelectorAll('.service-cat.active .reveal-up').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => revealObserver.observe(el), 50);
    });
  });
});

/* ---- RESERVATION FORM ---- */
function submitReservation() {
  const name    = document.getElementById('resa-name').value.trim();
  const phone   = document.getElementById('resa-phone').value.trim();
  const service = document.getElementById('resa-service').value;
  const date    = document.getElementById('resa-date').value;
  const time    = document.getElementById('resa-time').value;
  const message = document.getElementById('resa-message').value.trim();

  if (!name)    return showToast('⚠ Veuillez entrer votre nom.', 'error');
  if (!phone)   return showToast('⚠ Veuillez entrer votre numéro.', 'error');
  if (!service) return showToast('⚠ Veuillez choisir un service.', 'error');
  if (!date)    return showToast('⚠ Veuillez choisir une date.', 'error');
  if (!time)    return showToast('⚠ Veuillez choisir un créneau.', 'error');

  // Compose WhatsApp message
  const text = encodeURIComponent(
    `✦ Demande de RDV — Nyanga Beauty & Spa\n\n` +
    `👤 Nom : ${name}\n` +
    `📞 Téléphone : ${phone}\n` +
    `💆 Service : ${service}\n` +
    `📅 Date souhaitée : ${date}\n` +
    `⏰ Créneau : ${time}\n` +
    (message ? `📝 Message : ${message}` : '')
  );

  const btn = document.getElementById('submitBtn');
  btn.querySelector('span').textContent = 'Envoi en cours...';
  btn.disabled = true;

  setTimeout(() => {
    showToast('✦ Demande envoyée ! Redirection WhatsApp…', 'success');
    window.open(`https://wa.me/33664297767?text=${text}`, '_blank');
    btn.querySelector('span').textContent = 'Envoyer ma demande';
    btn.disabled = false;
    // Reset form
    ['resa-name','resa-phone','resa-message'].forEach(id => document.getElementById(id).value = '');
    ['resa-service','resa-time'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('resa-date').value = '';
  }, 800);
}

/* Set min date for reservation */
const dateInput = document.getElementById('resa-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

/* ---- TOAST ---- */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.className = 'toast', 3500);
}

/* ---- HERO TITLE ANIMATION ---- */
document.querySelectorAll('.hero-title .line').forEach((line, i) => {
  line.style.animation = `lineReveal 0.8s ${0.4 + i * 0.2}s both`;
});

const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes lineReveal {
    from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
    to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
  }
`;
document.head.appendChild(styleTag);

/* ---- PARALLAX HERO BG (subtle) ---- */
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.2}px)`;
  }
});

/* ---- SMOOTH LINK INTERCEPTION ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ---- CARDS TILT EFFECT ---- */
document.querySelectorAll('.service-card, .about-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = -(y / rect.height) * 6;
    const ry =  (x / rect.width)  * 6;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
