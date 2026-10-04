/* Animaciones de entrada (hero al cargar, secciones al hacer scroll).
   Sin librerías. Si algo falla o no aplica, el contenido queda visible. */
(function () {
  'use strict';
  var root = document.documentElement;

  // Modo captura: todo en su estado final, sin animaciones
  if (/[?&]captura=1(&|$)/.test(location.search)) { root.classList.add('captura'); return; }
  if (!('IntersectionObserver' in window) || !window.matchMedia) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Héroe: [selector, retraso ms]. Texto primero, luego imagen.
  var HERO = [
    ['#view-desktop #inicio > div:last-child > .grid > div:nth-child(1)', 0],
    ['#view-desktop #inicio > div:last-child > .grid > div:nth-child(2)', 250],
    ['#view-mobile #m-inicio > :nth-child(1)', 0],
    ['#view-mobile #m-inicio > :nth-child(2)', 100],
    ['#view-mobile #m-inicio > :nth-child(3)', 300],
    ['#view-mobile #m-inicio > :nth-child(4)', 450],
    ['#view-mobile #m-inicio > :nth-child(5)', 550]
  ];
  // Al hacer scroll: [selector, escalonado?]
  var REVEAL = [
    ['#view-desktop #sobre-el-doctor > div', false],
    ['#view-desktop #servicios > div > .text-center', false],
    ['#view-desktop #servicios > div > .grid > div', true],
    ['#view-desktop #confianza > div > .text-center', false],
    ['#view-desktop #confianza > div > .grid > div', true],
    ['#view-desktop main > div > section:nth-child(5) > div:last-child', false],
    ['#view-desktop #horarios-y-ubicacion > div > .text-center', false],
    ['#view-desktop #horarios-y-ubicacion > div > .grid > div', true],
    ['#view-desktop main > div > section:last-child > div', false],
    ['#view-desktop > footer > div', false],
    ['#view-mobile #m-sobre-el-doctor > div', false],
    ['#view-mobile #m-servicios > div:first-child', false],
    ['#view-mobile #m-servicios > .grid > div', true],
    ['#view-mobile #m-confianza > div:first-child', false],
    ['#view-mobile #m-confianza > div:last-child > div', true],
    ['#view-mobile main > div > section:nth-child(5) > div', false],
    ['#view-mobile #m-horarios > div', true],
    ['#view-mobile main > div > section:last-child > div', true],
    ['#view-mobile main > footer', false]
  ];

  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  try {
    var heroEls = [], items = [];
    HERO.forEach(function (h) {
      all(h[0]).forEach(function (el) { el.setAttribute('data-reveal', 'hero'); el.style.setProperty('--anim-delay', h[1] + 'ms'); heroEls.push(el); });
    });
    REVEAL.forEach(function (r) {
      all(r[0]).forEach(function (el) {
        if (el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal', '');
        if (r[1]) el.setAttribute('data-stagger', '');
        items.push(el);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries
        .sort(function (a, b) { return a.target.compareDocumentPosition(b.target) & 4 ? -1 : 1; })
        .forEach(function (en) {
          var el = en.target;
          if (en.isIntersecting) {
            if (el.hasAttribute('data-stagger')) el.style.setProperty('--anim-delay', Math.min(k++, 5) * 100 + 'ms');
            el.classList.add('is-in');
            io.unobserve(el);
          } else if (en.boundingClientRect.top < 0) {
            // ya quedó por encima del viewport (recarga a media página): mostrar sin animar
            el.classList.add('is-in', 'is-instant');
            io.unobserve(el);
          }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    root.classList.add('js-anim');
    items.forEach(function (el) { io.observe(el); });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroEls.forEach(function (el) { el.classList.add('is-in'); }); });
    });
  } catch (e) {
    // ante cualquier error, todo visible
    root.classList.remove('js-anim');
    all('[data-reveal]').forEach(function (el) { el.removeAttribute('data-reveal'); });
  }
})();
