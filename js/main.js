/**
 * gdocweb Landing Page Scripts
 */

(function () {
  'use strict';

  // Mobile navigation
  // --------------------------------------------------------
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.primary-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll reveal animations
  // --------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay;
            if (delay) {
              entry.target.style.transitionDelay = `${delay}ms`;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // How it works step switcher
  // --------------------------------------------------------
  function initStepSwitcher() {
    const stepCards = document.querySelectorAll('.step-card');
    const stepImage = document.getElementById('step-image');
    if (!stepCards.length || !stepImage) return;

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        // Update active state
        stepCards.forEach((c) => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');

        // Swap image with a fade
        const newSrc = card.dataset.image;
        const newAlt = card.querySelector('h3')?.textContent || '';
        if (!newSrc) return;

        stepImage.style.opacity = '0';
        setTimeout(() => {
          stepImage.src = newSrc;
          stepImage.alt = newAlt;
          stepImage.style.opacity = '1';
        }, 200);
      });
    });

    // Set initial state
    stepImage.style.transition = 'opacity 200ms ease';
  }

  // FAQ accordion
  // --------------------------------------------------------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        question.setAttribute('aria-expanded', String(isOpen));

        // Close other items
        if (isOpen) {
          faqItems.forEach((other) => {
            if (other !== item && other.classList.contains('open')) {
              other.classList.remove('open');
              const otherQuestion = other.querySelector('.faq-question');
              if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });
  }

  // Comparison slider
  // --------------------------------------------------------
  function initComparisonSlider() {
    const comparison = document.getElementById('comparison');
    const handle = document.getElementById('comparison-handle');
    if (!comparison || !handle) return;

    let isDragging = false;
    let currentSplit = 50;

    function setSplit(percentage) {
      currentSplit = Math.max(0, Math.min(100, percentage));
      comparison.style.setProperty('--split', `${currentSplit}%`);
    }

    function updateSlider(clientX) {
      const rect = comparison.getBoundingClientRect();
      const position = (clientX - rect.left) / rect.width;
      setSplit(position * 100);
    }

    function onPointerDown(e) {
      isDragging = true;
      e.preventDefault();
      handle.focus();
      updateSlider(e.clientX || e.touches?.[0]?.clientX);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      updateSlider(e.clientX || e.touches?.[0]?.clientX);
    }

    function onPointerUp() {
      isDragging = false;
    }

    // Mouse
    handle.addEventListener('mousedown', onPointerDown);
    comparison.addEventListener('mousedown', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      onPointerDown(e);
    });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch
    handle.addEventListener('touchstart', onPointerDown, { passive: false });
    comparison.addEventListener('touchstart', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      onPointerDown(e);
    }, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    // Keyboard support
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSplit(currentSplit - 5);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSplit(currentSplit + 5);
      }
    });
  }

  // Hero video poster
  // --------------------------------------------------------
  function initHeroVideo() {
    const poster = document.getElementById('video-poster');
    const container = document.getElementById('video-container');
    const iframe = container?.querySelector('iframe');
    if (!poster || !container || !iframe) return;

    poster.addEventListener('click', () => {
      iframe.src = iframe.dataset.src;
      poster.classList.add('is-hidden');
      container.hidden = false;
    });
  }

  // Footer year
  // --------------------------------------------------------
  function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  // Initialize
  // --------------------------------------------------------
  function init() {
    initMobileMenu();
    initScrollReveal();
    initStepSwitcher();
    initFaqAccordion();
    initComparisonSlider();
    initHeroVideo();
    initFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
