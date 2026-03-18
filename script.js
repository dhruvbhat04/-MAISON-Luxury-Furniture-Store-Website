/* =============================================
   MAISON — Luxury Furniture Store
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. LOADER
  ========================================= */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 2200);
  });

  // Fallback in case load event already fired
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }, 3500);


  /* =========================================
     2. CUSTOM CURSOR
  ========================================= */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverTargets = document.querySelectorAll(
    'a, button, .collection-card, .product-card, .tab-btn, .t-dot, .color-dot'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hover');
      cursorRing.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hover');
      cursorRing.classList.remove('is-hover');
    });
  });


  /* =========================================
     3. NAVBAR SCROLL
  ========================================= */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* =========================================
     4. SCROLL REVEAL
  ========================================= */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));


  /* =========================================
     5. PRODUCT TABS
  ========================================= */
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // In a real site, filter products here
    });
  });


  /* =========================================
     6. TESTIMONIAL SLIDER
  ========================================= */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.t-dot');
  let current  = 0;
  let autoplayTimer;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoplayTimer);
      goToSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  startAutoplay();


  /* =========================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
  ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* =========================================
     8. PARALLAX HERO ELEMENTS
  ========================================= */
  const heroGlow = document.querySelector('.hero-glow');
  const heroCircles = document.querySelectorAll('.hero-accent-circle');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroGlow) {
      heroGlow.style.transform = `translateY(${sy * 0.15}px)`;
    }
    heroCircles.forEach((c, i) => {
      c.style.transform = `translateY(${sy * (0.05 + i * 0.04)}px) rotate(${sy * 0.02}deg)`;
    });
  }, { passive: true });


  /* =========================================
     9. PRODUCT CARD — ADD TO CART FEEDBACK
  ========================================= */
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.style.background = 'var(--brown)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
      }, 1800);
    });
  });


  /* =========================================
     10. NEWSLETTER SUBSCRIBE
  ========================================= */
  window.handleSubscribe = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-primary span');
    if (btn) {
      btn.textContent = 'Subscribed ✓';
      setTimeout(() => { btn.textContent = 'Subscribe'; }, 3000);
    }
  };


  /* =========================================
     11. COLOR DOT ACTIVE STATE
  ========================================= */
  document.querySelectorAll('.product-colors').forEach(group => {
    group.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        group.querySelectorAll('.color-dot').forEach(d => d.style.outline = 'none');
        dot.style.outline = '2px solid var(--gold)';
        dot.style.outlineOffset = '2px';
      });
    });
  });


  /* =========================================
     12. COLLECTION CARD — STAGGER ENTRANCE
  ========================================= */
  const collectionCards = document.querySelectorAll('.collection-card');
  const cardObserver = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      collectionCards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100);
      });
      cardObserver.disconnect();
    }
  }, { threshold: 0.1 });

  collectionCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity .7s cubic-bezier(0.19, 1, 0.22, 1), transform .7s cubic-bezier(0.19, 1, 0.22, 1)';
  });

  if (collectionCards.length) cardObserver.observe(collectionCards[0]);


  /* =========================================
     13. HOVER CURSOR RE-OBSERVE after dynamic changes
  ========================================= */
  // Ensure any newly rendered interactive elements also get cursor treatment
  function addCursorToEl(el) {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hover');
      cursorRing.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hover');
      cursorRing.classList.remove('is-hover');
    });
  }

  document.querySelectorAll('.btn-add, .product-action-btn, .social-btn').forEach(addCursorToEl);

});
