/* =============================================
   PAGE LOADER
   ============================================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1500);
});

/* =============================================
   DARK MODE TOGGLE
   ============================================= */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const html        = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

/* =============================================
   HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  allLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink);

/* =============================================
   NAVBAR SHADOW ON SCROLL
   ============================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 30px rgba(0,0,0,0.12)'
    : '0 2px 20px rgba(0,0,0,0.08)';
});

/* =============================================
   BACK TO TOP BUTTON
   ============================================= */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   SCROLL FADE-IN ANIMATIONS
   ============================================= */
const fadeEls = document.querySelectorAll(
  '.stat-card, .timeline-content, .skill-category, .project-card, ' +
  '.contact-card, .contact-form, .soft-skills, .about-text, ' +
  '.service-card, .cert-card, .testimonial-card, .ref-card, ' +
  '.hobbies-card, .lang-bars, .references'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

/* =============================================
   SKILL BAR ANIMATION ON SCROLL
   ============================================= */
const skillFills = document.querySelectorAll('.skill-fill');

skillFills.forEach(fill => {
  const target = fill.style.width;
  fill.style.width = '0';

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { fill.style.width = target; }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  obs.observe(fill);
});

/* =============================================
   ANIMATED COUNTERS
   ============================================= */
const counters = document.querySelectorAll('.counter');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 40);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => countObserver.observe(c));

/* =============================================
   DYNAMIC YEAR IN FOOTER
   ============================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =============================================
   CONTACT FORM — saves to localStorage (admin inbox)
   ============================================= */
const form     = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      formNote.style.color = '#e74c3c';
      formNote.textContent = 'Please fill in all required fields.';
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('cvMessages') || '[]');
      messages.push({
        id:      'msg_' + Date.now(),
        name,
        email,
        subject: subject || '(No subject)',
        message,
        time:    Date.now(),
        read:    false
      });
      localStorage.setItem('cvMessages', JSON.stringify(messages));

      formNote.style.color = 'green';
      formNote.textContent = '✓ Message sent! I will get back to you shortly.';
      form.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }, 1200);
  });
}
