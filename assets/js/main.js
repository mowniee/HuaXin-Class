// main.js - page transitions + reveal animations + internal link fade-out
document.addEventListener('DOMContentLoaded', function() {

  // Set current year in footer
  const yearElement = document.getElementById('year');
  if(yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Page fade-in with smooth cubic-bezier easing
  const page = document.getElementById('page-content');
  if(page) {
    page.style.opacity = 0;
    page.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    requestAnimationFrame(() => page.style.opacity = 1);
  }

  // Reveal on scroll (slide-up with smooth easing)
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.15});

  reveals.forEach(r => io.observe(r));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if(href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isVisible = mobileNav.style.display === 'block';
      mobileNav.style.display = isVisible ? 'none' : 'block';
      this.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
    });

    // Close menu when clicking links
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileNav.style.display = 'none';
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.style.display === 'block') {
        mobileNav.style.display = 'none';
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Internal link fade-out (only for non-mobile-nav links)
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    // ignore anchor links, external targets, and mobile nav links
    if(href.startsWith('#') || a.target === '_blank' || a.parentElement?.id === 'mobileNav') return;
    // handle same-site relative links (e.g., home.php)
    if(href.match(/\.(php|html)$/) || href.startsWith('/')) {
      a.addEventListener('click', function(e) {
        // allow meta clicks
        if(e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        document.body.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
        document.body.style.opacity = 0;
        setTimeout(() => { window.location = href; }, 300);
      });
    }
  });

});

