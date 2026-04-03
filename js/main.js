/* ========================================
   Main JavaScript — Граунд Landing Page
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------
     1. Intersection Observer — fade-in
     ----------------------------------------- */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '-50px' }
  );

  document.querySelectorAll('.fade-in:not(.stagger-container .fade-in)').forEach((el) => {
    fadeObserver.observe(el);
  });

  /* -----------------------------------------
     2. Staggered observer for grid children
     ----------------------------------------- */
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.fade-in');
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 100}ms`;
            child.classList.add('visible');
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '-30px' }
  );

  document.querySelectorAll('.stagger-container').forEach((el) => {
    staggerObserver.observe(el);
  });

  /* -----------------------------------------
     3. Header scroll effect
     ----------------------------------------- */
  const header = document.querySelector('.header');

  const hasHero = !!document.querySelector('.hero');

  function handleHeaderScroll() {
    if (!hasHero) {
      header.classList.add('scrolled');
      return;
    }
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* -----------------------------------------
     4. Burger menu
     ----------------------------------------- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.header__nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* -----------------------------------------
     5. Particle generator
     ----------------------------------------- */
  if (!prefersReducedMotion) {
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
      const particleCount = 42;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const slotWidth = 100 / particleCount;
        const left = i * slotWidth + Math.random() * slotWidth;
        const duration = 8 + Math.random() * 16;
        const delay = Math.random() * 4;
        const size = 3 + Math.random() * 5;
        const opacity = 0.15 + Math.random() * 0.35;

        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        particle.style.background = `rgba(74, 158, 175, ${opacity})`;

        particlesContainer.appendChild(particle);
      }
    }
  }

  /* -----------------------------------------
     6. Count-up animation
     ----------------------------------------- */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCountUp(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const isDecimal = element.dataset.decimal === 'true';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = target * easedProgress;

      if (isDecimal) {
        const formatted = currentValue.toFixed(1).replace('.', ',');
        element.textContent = formatted + suffix;
      } else {
        element.textContent = Math.round(currentValue) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.classList.add('counting');
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.stat__number');
          numbers.forEach((num) => {
            if (!num.dataset.animated) {
              num.dataset.animated = 'true';
              animateCountUp(num);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* -----------------------------------------
     7. Smooth scroll for anchor links
     ----------------------------------------- */
  /* -----------------------------------------
     8. Pricing period toggle
     ----------------------------------------- */
  const toggleBtns = document.querySelectorAll('.pricing__toggle-btn');
  const premiumPrice = document.getElementById('premium-price');
  const premiumAlt = document.getElementById('premium-alt');

  if (toggleBtns.length && premiumPrice) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('pricing__toggle-btn--active'));
        btn.classList.add('pricing__toggle-btn--active');

        if (btn.dataset.period === 'month') {
          premiumPrice.innerHTML = '399 \u20BD <span>/ \u043C\u0435\u0441</span>';
          premiumAlt.textContent = '';
        } else {
          premiumPrice.innerHTML = '999 \u20BD <span>/ 4 \u043C\u0435\u0441</span>';
          premiumAlt.textContent = '249,75 \u20BD/\u043C\u0435\u0441';
        }
      });
    });
  }

  /* -----------------------------------------
     9. Smooth scroll for anchor links
     ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
