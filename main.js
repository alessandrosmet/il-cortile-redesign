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
      const section = entry.target;
      section.classList.add('is-visible');
      section.addEventListener('transitionend', () => {
        section.style.willChange = 'auto';
      }, { once: true });
      revealObserver.unobserve(section);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.section-reveal').forEach((section) => revealObserver.observe(section));

let glowTargetX = window.innerWidth / 2;
let glowTargetY = window.innerHeight / 2;
let glowX = glowTargetX;
let glowY = glowTargetY;
let glowRafId = null;

function animateGlow() {
  glowX = lerp(glowX, glowTargetX, 0.14);
  glowY = lerp(glowY, glowTargetY, 0.14);
  cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

  if (Math.abs(glowTargetX - glowX) > 0.1 || Math.abs(glowTargetY - glowY) > 0.1) {
    glowRafId = requestAnimationFrame(animateGlow);
  } else {
    glowRafId = null;
  }
}

window.addEventListener('mousemove', (event) => {
  if (!cursorGlow) return;
  glowTargetX = event.clientX;
  glowTargetY = event.clientY;
  cursorGlow.style.opacity = '1';
  if (glowRafId === null) {
    glowRafId = requestAnimationFrame(animateGlow);
  }
});

const bookingForm = document.getElementById('bookingForm');
const bookingMessage = document.getElementById('bookingMessage');
const bookingModal = document.getElementById('bookingModal');
const bookingModalClose = document.getElementById('bookingModalClose');
const bookingSummary = document.getElementById('bookingSummary');
const bookingCameraField = document.getElementById('bookingCameraField');
const bookingOspitiField = document.getElementById('bookingOspitiField');
const bookingArrivoField = document.getElementById('bookingArrivoField');
const bookingPartenzaField = document.getElementById('bookingPartenzaField');
const bookingContactForm = document.getElementById('bookingContactForm');

function toggleBookingModal(forceState) {
  if (!bookingModal) return;
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !bookingModal.classList.contains('is-open');

  bookingModal.classList.toggle('is-open', shouldOpen);
  document.body.classList.toggle('menu-open', shouldOpen);
  bookingModal.setAttribute('aria-hidden', String(!shouldOpen));
}

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

  bookingMessage.textContent = '';

  const summary = `${camera} · ${ospiti} · dal ${formatDate(arrivo)} al ${formatDate(partenza)}`;
  if (bookingSummary) bookingSummary.textContent = summary;
  if (bookingCameraField) bookingCameraField.value = camera;
  if (bookingOspitiField) bookingOspitiField.value = ospiti;
  if (bookingArrivoField) bookingArrivoField.value = formatDate(arrivo);
  if (bookingPartenzaField) bookingPartenzaField.value = formatDate(partenza);

  toggleBookingModal(true);
});

bookingModalClose?.addEventListener('click', () => toggleBookingModal(false));

bookingModal?.addEventListener('click', (event) => {
  if (event.target === bookingModal) toggleBookingModal(false);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') toggleBookingModal(false);
});

bookingContactForm?.addEventListener('submit', () => {
  const submitButton = bookingContactForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = 'Invio in corso';
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
