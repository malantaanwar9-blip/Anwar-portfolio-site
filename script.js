/* ============================================================
   ABDULLAHI MUSA — PORTFOLIO SCRIPTS
   Features: Loader, Cursor, Typing, Canvas, Scroll Reveal,
             Counter, Skill Bars, Circles, Carousel, Filter,
             Contact Form, Navbar
   ============================================================ */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      triggerHeroReveal();
    }, 2000);
  });
  document.body.style.overflow = 'hidden';

  function triggerHeroReveal() {
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }

  // ===== CURSOR (desktop only) =====
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let trailX = 0, trailY = 0;
  let curX = 0, curY = 0;

  if (window.innerWidth > 768 && cursor && cursorTrail) {
    document.addEventListener('mousemove', e => {
      curX = e.clientX; curY = e.clientY;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
    });

    // Smooth trail with rAF
    function animateTrail() {
      trailX += (curX - trailX) * 0.12;
      trailY += (curY - trailY) * 0.12;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top  = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover effects
    const hoverEls = document.querySelectorAll(
      'a, button, .service-card, .project-card, .filter-btn, .tech-tag'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorTrail.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursorTrail.classList.remove('hovered');
      });
    });
  }

  // ===== NAVBAR =====
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else                     navbar.classList.remove('scrolled');
    highlightNav();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav highlight
  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  // ===== HERO CANVAS (particle field) =====
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.05;
        this.r = Math.random() * 1.5 + 0.4;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== TYPING ANIMATION =====
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'beautiful web apps',
      'stunning UI/UX designs',
      'scalable backends',
      'mobile experiences',
      'digital solutions'
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
      const phrase = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = phrase.substring(0, --charIndex);
      } else {
        typingEl.textContent = phrase.substring(0, ++charIndex);
      }

      let delay = isDeleting ? 50 : 95;

      if (!isDeleting && charIndex === phrase.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 1800);
  }

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    // Skip hero elements — those are handled by triggerHeroReveal
    if (!el.closest('.hero')) revealObserver.observe(el);
  });

  // ===== COUNTERS =====
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('.stat-number, .stat-big-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  // ===== SKILL BARS =====
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => barObserver.observe(bar));

  // ===== CIRCULAR PROGRESS =====
  const circles = document.querySelectorAll('.circle-progress');
  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct   = parseInt(entry.target.dataset.pct, 10);
        const circ  = 2 * Math.PI * 50; // r=50
        const offset = circ - (pct / 100) * circ;
        entry.target.style.strokeDashoffset = offset;
        circleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  circles.forEach(c => circleObserver.observe(c));

  // ===== PROJECT FILTER =====
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px) scale(0.97)';
        setTimeout(() => {
          card.classList.toggle('hidden', !match);
          if (match) {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = '';
            });
          }
        }, 180);
      });
    });
  });

  // ===== TESTIMONIALS CAROUSEL =====
  const track     = document.getElementById('carouselTrack');
  const dotsWrap  = document.getElementById('carouselDots');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');

  if (track && dotsWrap) {
    const cards       = track.querySelectorAll('.testimonial-card');
    const total       = cards.length;
    let current       = 0;
    let autoPlay      = null;
    let cardWidth     = 0;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function getCardWidth() {
      return cards[0].getBoundingClientRect().width + 24; // gap
    }

    function updateCarousel() {
      cardWidth = getCardWidth();
      const isMobile = window.innerWidth <= 768;
      const slidesToShow = isMobile ? 1 : 2;
      const maxIndex = total - slidesToShow;
      const safeIndex = Math.min(current, maxIndex);
      track.style.transform = `translateX(-${safeIndex * cardWidth}px)`;

      const dots = dotsWrap.querySelectorAll('.dot');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function goTo(index) {
      const isMobile = window.innerWidth <= 768;
      const max = isMobile ? total - 1 : total - 2;
      current = (index + total) % total;
      if (current > max) current = 0;
      updateCarousel();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

    function resetAutoPlay() {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => goTo(current + 1), 5000);
    }
    resetAutoPlay();

    window.addEventListener('resize', () => {
      updateCarousel();
    }, { passive: true });

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
      resetAutoPlay();
    }, { passive: true });
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = contactForm.querySelector('#name').value.trim();
      const email   = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) return;

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        formSuccess.classList.add('visible');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1600);
    });
  }

  // ===== FOOTER YEAR =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== SMOOTH SCROLL (for older browsers) =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== NAV CTA =====
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    navCta.addEventListener('click', () => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== PROJECT CARDS — keyboard accessibility =====
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.querySelector('.project-btn')?.focus();
      }
    });
  });

  // ===== PARALLAX (subtle, desktop only) =====
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroPhoto = document.querySelector('.hero-photo');
      if (heroPhoto) {
        heroPhoto.style.transform = `translateY(${scrollY * 0.08}px)`;
      }
    }, { passive: true });
  }

  console.log('%c Abdullahi Musa Abdullahi — Portfolio ', 
    'background:#c9a84c;color:#0a0b0f;font-family:serif;font-size:14px;padding:8px 16px;border-radius:4px;font-weight:bold');
  console.log('%c malantaanwar9@gmail.com | @anwarmalanta', 
    'color:#c9a84c;font-size:11px;');
});
