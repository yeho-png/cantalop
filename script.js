/* ===== Navbar: Sticky + Border ===== */
(function () {
  var navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===== Mobile Hamburger Menu ===== */
(function () {
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', '메뉴 열기');
    });
  });

  document.addEventListener('click', function (e) {
    var navbar = document.getElementById('navbar');
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ===== Scroll Fade-in (Intersection Observer) ===== */
(function () {
  var elements = document.querySelectorAll('.fade-in');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)'));
      var index = siblings.indexOf(entry.target);
      var delay = Math.min(index * 90, 360);
      setTimeout(function () {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ===== Counter Count-up Animation ===== */
(function () {
  var counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  function formatNum(n) {
    return n >= 1000 ? Math.floor(n).toLocaleString('ko-KR') : Math.floor(n).toString();
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var fps = 60;
    var totalFrames = Math.round(duration / (1000 / fps));
    var frame = 0;

    var timer = setInterval(function () {
      frame++;
      var eased = 1 - Math.pow(1 - frame / totalFrames, 3);
      el.textContent = formatNum(target * eased) + suffix;
      if (frame >= totalFrames) {
        clearInterval(timer);
        el.textContent = formatNum(target) + suffix;
      }
    }, 1000 / fps);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach(function (el) { observer.observe(el); });
})();

/* ===== Smooth Scroll ===== */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var navH = document.getElementById('navbar').offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 12, behavior: 'smooth' });
    });
  });
})();
