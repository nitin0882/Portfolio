/* ==========================================================================
   ANIMATION.JS
   Handles: particle/network canvas background, ripple button effect
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------- Particle / Data-Network Background ---------------- */
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let width, height;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function getParticleColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? '90, 90, 84' : '224, 163, 57';
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.8 + 0.6;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${getParticleColor()}, 0.4)`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(154, 154, 150, ${0.1 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();

  if (!prefersReducedMotion) {
    animateParticles();
  } else {
    // Draw a single static frame for reduced-motion users
    particles.forEach((p) => p.draw());
    connectParticles();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  /* ---------------- Ripple Button Effect ---------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--rx', x + '%');
    btn.style.setProperty('--ry', y + '%');
    btn.classList.remove('rippling');
    // force reflow to restart animation
    void btn.offsetWidth;
    btn.classList.add('rippling');
  });
})();
