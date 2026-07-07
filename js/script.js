/* ==========================================================================
   SCRIPT.JS
   Core interactivity: loader, cursor, theme, nav, terminal typing,
   scroll reveal, skill bars, counters, project modal, form validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. LOADING SCREEN
  ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  const loaderBarFill = document.getElementById('loaderBarFill');
  const loaderPercent = document.getElementById('loaderPercent');

  function runLoader() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hide');
          document.body.style.overflow = '';
        }, 300);
      }
      loaderBarFill.style.width = progress + '%';
      loaderPercent.textContent = Math.floor(progress) + '%';
    }, 130);
  }
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => {
    setTimeout(runLoader, 200);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') runLoader();

  /* ------------------------------------------------------------------
     2. CUSTOM CURSOR
  ------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.querySelectorAll('a, button, .chip, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(2.2)');
      el.addEventListener('mouseleave', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* ------------------------------------------------------------------
     3. SCROLL PROGRESS + NAVBAR BLUR + ACTIVE LINK
  ------------------------------------------------------------------ */
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    navbar.classList.toggle('scrolled', scrollTop > 40);
    backToTop.classList.toggle('show', scrollTop > 500);

    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (scrollTop >= top) currentId = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ------------------------------------------------------------------
     4. HAMBURGER / MOBILE NAV
  ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });

  /* ------------------------------------------------------------------
     5. THEME TOGGLE (with persistence)
  ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('portfolio-theme', next);
  });

  /* ------------------------------------------------------------------
     6. HERO TERMINAL TYPING ANIMATION
  ------------------------------------------------------------------ */
  const terminalBody = document.getElementById('terminalBody');
  const terminalLines = [
    { prompt: '>>> ', text: 'import nitin as dev' },
    { prompt: '>>> ', text: 'dev.role' },
    { text: "'Python Developer & Data Analyst'", isOutput: true },
    { prompt: '>>> ', text: 'dev.currently_building' },
    { text: "'AI chatbots, data pipelines, web apps'", isOutput: true },
    { prompt: '>>> ', text: 'dev.status' },
    { text: "'Open to opportunities'", isOutput: true }
  ];

  function typeTerminal() {
    if (prefersReducedMotion) {
      terminalLines.forEach((line) => {
        const div = document.createElement('div');
        div.className = 't-line';
        if (line.isOutput) {
          div.textContent = line.text;
        } else {
          div.innerHTML = `<span class="prompt">${line.prompt}</span>${line.text}`;
        }
        terminalBody.appendChild(div);
      });
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
      if (lineIndex >= terminalLines.length) {
        // restart loop after a pause
        setTimeout(() => {
          terminalBody.innerHTML = '';
          lineIndex = 0;
          charIndex = 0;
          typeNextChar();
        }, 3200);
        return;
      }

      const line = terminalLines[lineIndex];
      let currentLineEl = terminalBody.querySelector('.t-line.typing');

      if (!currentLineEl) {
        currentLineEl = document.createElement('div');
        currentLineEl.className = 't-line typing';
        if (!line.isOutput) {
          const promptSpan = document.createElement('span');
          promptSpan.className = 'prompt';
          promptSpan.textContent = line.prompt;
          currentLineEl.appendChild(promptSpan);
        }
        const textSpan = document.createElement('span');
        currentLineEl.appendChild(textSpan);
        terminalBody.appendChild(currentLineEl);
      }

      const textSpan = currentLineEl.querySelector('span:last-child');

      if (charIndex < line.text.length) {
        textSpan.textContent += line.text.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, line.isOutput ? 12 : 38);
      } else {
        currentLineEl.classList.remove('typing');
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, line.isOutput ? 500 : 250);
      }
    }
    typeNextChar();
  }
  typeTerminal();

  /* ------------------------------------------------------------------
     7. SCROLL REVEAL (Intersection Observer)
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     8. SKILL BARS + CIRCULAR CHARTS (animate on scroll)
  ------------------------------------------------------------------ */
  const skillBars = document.querySelectorAll('.skill-bar-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        fill.style.width = entry.target.dataset.percent + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach((bar) => skillObserver.observe(bar));

  const circleCharts = document.querySelectorAll('.circle-chart');
  const CIRCUMFERENCE = 2 * Math.PI * 52;
  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const percent = parseFloat(entry.target.dataset.percent);
        const fill = entry.target.querySelector('.circle-fill');
        const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
        fill.style.strokeDasharray = CIRCUMFERENCE;
        fill.style.strokeDashoffset = offset;
        circleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  circleCharts.forEach((c) => circleObserver.observe(c));

  /* ------------------------------------------------------------------
     9. COUNTER ANIMATION
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const duration = 1400;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;
        const counterInterval = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counterInterval);
          }
          el.textContent = Math.floor(current);
        }, stepTime);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ------------------------------------------------------------------
     10. PROJECT MODAL
  ------------------------------------------------------------------ */
  const projectData = {
    bankbot: {
      title: 'BankBot AI — AI-Powered Banking Chatbot',
      tech: 'Python, Streamlit, Ollama, Phi-3 LLM, Pandas, SQLite',
      desc: 'An end-to-end AI chatbot built to resolve banking and finance queries, combining a locally-run LLM with a structured data layer for accurate, domain-restricted responses.',
      images: [
        'assets/images/projects/bankbot-1.png',
        'assets/images/projects/bankbot-2.png',
        'assets/images/projects/bankbot-3.png'
      ],
      features: [
        'Phi-3 LLM integration via Ollama for context-aware natural language responses',
        'Interactive Streamlit web interface for real-time user interaction',
        'Domain-restriction logic using Pandas & SQLite to filter and improve accuracy',
        'Full data pipeline: ingestion, preprocessing, SQLite storage, response orchestration',
        'Streamlit dashboard visualizing chatbot metrics and interaction trends'
      ],
      challenges: 'Coordinating the full data pipeline end-to-end — from ingestion through preprocessing to response orchestration — while keeping the chatbot restricted to accurate, domain-relevant answers.'
    },
    movix: {
      title: 'Movix — Movie Recommendation Web App',
      tech: 'JavaScript, HTML5, CSS3, TMDB REST API',
      desc: 'A fully responsive movie discovery application that fetches real-time data from the TMDB REST API to power search, trending sections, and ratings.',
      images: [
        'assets/images/projects/movix-1.png',
        'assets/images/projects/movix-2.png',
        'assets/images/projects/movix-3.png'
      ],
      features: [
        'Dynamic search with live results',
        'Trending sections and poster/rating display via JavaScript',
        'Mobile-first responsive UI built with HTML5 & CSS3',
        'Recommendation logic driven by trending content pattern analysis'
      ],
      challenges: 'Structuring real-time API data (ratings, genres, popularity) into a responsive, dynamic UI that stays fast and consistent across devices.'
    },
    fitnfight: {
      title: 'FIT-N-FIGHT — Fitness & Diet Management Website',
      tech: 'HTML5, CSS3, JavaScript',
      desc: 'A fitness platform offering subscription plans, workout tracking, and diet planning modules on a modular, extensible codebase.',
      images: [
        'assets/images/projects/fitnfight-1.png',
        'assets/images/projects/fitnfight-2.png',
        'assets/images/projects/fitnfight-3.png'
      ],
      features: [
        'Subscription plans with tiered access',
        'Workout tracking and diet planning modules',
        'Responsive layouts and interactive UI components',
        'Modular structure supporting easy feature extension'
      ],
      challenges: 'Structuring user fitness and diet data across subscription tiers with conditional logic, while keeping the codebase easy to extend.'
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const modalDots = document.getElementById('modalDots');
  const modalSliderEl = document.getElementById('modalSlider');

  let slideIndex = 0;
  let slideInterval;
  let currentSlideCount = 0;

  function buildSlides(data) {
    modalSliderEl.innerHTML = '';
    data.images.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'modal-slide' + (i === 0 ? ' active' : '');

      const fallback = document.createElement('span');
      fallback.className = 'slide-fallback';
      fallback.textContent = data.title.split(' — ')[0];
      slide.appendChild(fallback);

      const img = document.createElement('img');
      img.src = src;
      img.alt = data.title + ' — screenshot ' + (i + 1);
      img.loading = 'lazy';
      img.onerror = function () { this.remove(); }; // falls back to text label behind it
      slide.appendChild(img);

      modalSliderEl.appendChild(slide);
    });
    currentSlideCount = data.images.length;
  }

  function renderDots() {
    modalDots.innerHTML = '';
    for (let i = 0; i < currentSlideCount; i++) {
      const dot = document.createElement('span');
      if (i === slideIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      modalDots.appendChild(dot);
    }
  }

  function goToSlide(i) {
    const slides = modalSliderEl.querySelectorAll('.modal-slide');
    slides[slideIndex].classList.remove('active');
    slideIndex = i;
    slides[slideIndex].classList.add('active');
    renderDots();
  }

  function startSlider() {
    clearInterval(slideInterval);
    if (currentSlideCount <= 1) return;
    slideInterval = setInterval(() => {
      goToSlide((slideIndex + 1) % currentSlideCount);
    }, 2800);
  }

  document.querySelectorAll('.view-details').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      const data = projectData[key];
      if (!data) return;

      modalContent.innerHTML = `
        <h3>${data.title}</h3>
        <h4>Technologies Used</h4>
        <p>${data.tech}</p>
        <h4>Description</h4>
        <p>${data.desc}</p>
        <h4>Features</h4>
        <ul>${data.features.map((f) => `<li>${f}</li>`).join('')}</ul>
        <h4>Challenges</h4>
        <p>${data.challenges}</p>
      `;
      slideIndex = 0;
      buildSlides(data);
      renderDots();
      startSlider();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    clearInterval(slideInterval);
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ------------------------------------------------------------------
     11. CONTACT FORM VALIDATION
  ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    formName: (v) => v.trim().length >= 2 || 'Please enter your full name.',
    formEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    formSubject: (v) => v.trim().length >= 3 || 'Subject must be at least 3 characters.',
    formMessage: (v) => v.trim().length >= 10 || 'Message must be at least 10 characters.'
  };

  function validateField(id) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById('err' + id.replace('form', ''));
    const result = validators[id](input.value);
    const group = input.closest('.form-group');
    if (result === true) {
      group.classList.remove('invalid');
      errorEl.textContent = '';
      return true;
    } else {
      group.classList.add('invalid');
      errorEl.textContent = result;
      return false;
    }
  }

  Object.keys(validators).forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => validateField(id));
    input.addEventListener('input', () => {
      if (input.closest('.form-group').classList.contains('invalid')) validateField(id);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(validators).map(validateField).every(Boolean);
    if (!allValid) return;

    formSuccess.classList.add('show');
    showToast('Message sent successfully!');
    contactForm.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  });

  /* ------------------------------------------------------------------
     12. TOAST NOTIFICATIONS
  ------------------------------------------------------------------ */
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ------------------------------------------------------------------
     13. FOOTER YEAR
  ------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();
});
