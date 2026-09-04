const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, progress) => start + (end - start) * progress;

const logo = document.querySelector('.floating-logo');
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel = document.querySelector('.menu-panel');
const menuLinks = document.querySelectorAll('.menu-panel a');
const cursorGlow = document.querySelector('.cursor-glow');

function updateLogoPosition() {
  if (!logo) return;

  const isMobile = window.innerWidth < 640;
  const headerHeight = isMobile ? 70 : 78;
  const logoTop = isMobile ? 17 : 16;
  const logoScale = isMobile ? 0.45 : 0.42;

  if (siteHeader) {
    siteHeader.style.height = `${headerHeight}px`;
    siteHeader.classList.add('is-compact');
  }

  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  logo.style.top = `${logoTop}px`;
  logo.style.left = '50%';
  logo.style.transform = `translateX(-50%) scale(${logoScale})`;
}

function toggleMenu(forceState) {
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !menuPanel.classList.contains('is-open');

  menuPanel.classList.toggle('is-open', shouldOpen);
  menuToggle.classList.toggle('is-open', shouldOpen);
  document.body.classList.toggle('menu-open', shouldOpen);
  menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  menuPanel.setAttribute('aria-hidden', String(!shouldOpen));
}

menuToggle?.addEventListener('click', () => toggleMenu());

menuPanel?.addEventListener('click', (event) => {
  if (event.target === menuPanel) toggleMenu(false);
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') toggleMenu(false);
});

window.addEventListener('resize', updateLogoPosition);
updateLogoPosition();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.section-reveal').forEach((section) => revealObserver.observe(section));

window.addEventListener('mousemove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const arrivo = formData.get('arrivo');
  const partenza = formData.get('partenza');
  const ospiti = formData.get('ospiti');
  const camera = formData.get('camera');

  if (!arrivo || !partenza || !ospiti || !camera) {
    bookingMessage.textContent = 'Compila tutti i campi per continuare';
    return;
  }

  if (new Date(partenza) <= new Date(arrivo)) {
    bookingMessage.textContent = 'La data di partenza deve essere successiva alla data di arrivo';
    return;
  }

  bookingMessage.textContent = `Richiesta pronta: ${camera}, ${ospiti}, dal ${formatDate(arrivo)} al ${formatDate(partenza)}. Puoi collegare questo pulsante a email, WhatsApp o booking engine`;
  bookingForm.reset();
});

function formatDate(dateString) {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString));
}

const commentForm = document.getElementById('commentForm');

commentForm?.addEventListener('submit', () => {
  const submitButton = commentForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = 'Invio in corso';
});
