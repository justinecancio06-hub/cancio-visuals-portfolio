(function () {
  'use strict';

  var WORKS = {
    drawings: {
      label: 'Drawings',
      hint: 'Character drawings, portraits & illustrations.',
      files: [
        'Asta.jpg',
        'Cancio _ Lady Warden.jpg',
        'Curl.jpg',
        'Denji.jpg',
        'Eye.jpg',
        'Gojo.jpg',
        'Kai.jpg',
        'Kokushibo.jpg',
        'LANDSCAPES_ratioLuffy.jpg',
        'LANDSCAPE_ratioMadara.jpg',
        'Liu Zhigang.jpg',
        'Luffy LA.jpg',
        'Mikasa.jpg',
        'Perlas.jpg',
        'Reze.jpg',
        'ShoreKeeper.jpg',
        'Tanjiro.jpg',
        'Tengen.jpg',
        'Yu Zhong.jpg'
      ]
    },
    graphicsdesign: {
      label: 'Graphics Design',
      hint: 'Posters, magazines & graphic design pieces.',
      files: [
        'cANCInternationalMagazine.jpg',
        'GD_LANDSCAPE1.jpg',
        'GD_LANDSCAPE2.jpg',
        'GD_LANDSCAPE3.jpg',
        'GD_LANDSCAPE4.jpg',
        'GD_LANDSCAPE5.jpg',
        'JOSHUA.jpg',
        'LocalMagazine.jpg',
        'loki ni gelly.jpg',
        'MEET THE OFFICERS.jpg',
        'moviePosterCancio.jpg',
        'SPORT.jpg',
        'SunsetPainting.jpg',
        'Untitled223_20250523231123.jpg',
        'VexelGelly.jpg',
        'VexelGtaVibe.jpg',
        'VexelKorean.jpg',
        'VexelSG.jpg'
      ]
    },
    photography: {
      label: 'Photography',
      hint: 'Photos & landscapes shot on camera.',
      files: [
        'Cat.jpe',
        'CG.jpg',
        'DSC00116.png',
        'IMG_7494253337131388166_4_v2.jpg',
        'LANDSCAPE1.jpe',
        'LANDSCAPE2.jpe',
        'LANDSCAPE3.jpe',
        'LANDSCAPE4.jpe',
        'LANDSCAPE5.jpg',
        'motor.jpg'
      ]
    },
    certificate: {
      label: 'Certificates',
      hint: 'Certificates & achievements.',
      files: [
        'BALAGTASAN.jpg',
        'DICT.png',
        'DOST.png',
        'NCII.png',
        'MC.jpg',
        'JJK CERT.jpg',
        'SL.jpg'
      ]
    }
  };

  var grid = document.getElementById('galleryGrid');
  var hint = document.getElementById('galleryHint');
  var tabs = document.querySelectorAll('.gallery__tab');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var currentFolder = 'drawings';
  var currentIndex = 0;
  var currentFiles = [];

  function prettyName(file) {
    var base = file.replace(/\.[^.]+$/, '');
    return base
      .replace(/[_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); })
      .trim();
  }

  function renderGallery() {
    var folder = WORKS[currentFolder];
    var files = folder.files.slice();
    if (currentFolder === 'graphicsdesign') {
      files.sort(function (a, b) {
        return (isVexel(b) ? 1 : 0) - (isVexel(a) ? 1 : 0);
      });
    }
    currentFiles = files;
    hint.textContent = folder.hint;

    var frag = document.createDocumentFragment();
    currentFiles.forEach(function (file, i) {
      var figure = document.createElement('figure');
      figure.className = 'gallery__item';
      figure.style.animationDelay = (i * 40) + 'ms';

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = encodeURI('images/' + currentFolder + '/' + file);
      img.alt = prettyName(file);

      var caption = document.createElement('figcaption');
      caption.textContent = prettyName(file);

      figure.appendChild(img);
      figure.appendChild(caption);
      figure.addEventListener('click', function () {
        openLightbox(i);
      });
      frag.appendChild(figure);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);
  }

  function isVexel(file) {
    return /^Vexel/i.test(file);
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    var folder = WORKS[currentFolder];
    var file = folder.files[currentIndex];
    lightboxImg.src = encodeURI('images/' + currentFolder + '/' + file);
    lightboxCaption.textContent = prettyName(file);
  }

  function stepLightbox(dir) {
    currentIndex = (currentIndex + dir + currentFiles.length) % currentFiles.length;
    updateLightbox();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      currentFolder = tab.dataset.folder;
      renderGallery();
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', function () { stepLightbox(-1); });
  document.getElementById('lightboxNext').addEventListener('click', function () { stepLightbox(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.querySelectorAll('.cert-card__img, .cert-extra__img').forEach(function (img) {
    img.addEventListener('click', function () {
      var file = img.dataset.file;
      var idx = WORKS.certificate.files.indexOf(file);
      if (idx !== -1) {
        currentFolder = 'certificate';
        renderGalleryFiles(WORKS.certificate.files);
        openLightbox(idx);
      } else {
        currentFiles = [file];
        currentFolder = 'certificate';
        openLightbox(0);
      }
    });
  });

  function renderGalleryFiles(files) {
    currentFiles = files;
  }

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  /* ---------- Nav ---------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');

  navToggle.addEventListener('click', function () {
    var open = navList.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navList.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navList.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---------- Active nav section highlight ---------- */
  var sectionLinks = Array.prototype.filter.call(
    document.querySelectorAll('.nav__list a[href^="#"]'),
    function (link) { return !link.classList.contains('nav__cta'); }
  );
  var trackedSections = sectionLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var href = '#' + entry.target.id;
      sectionLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === href);
      });
    });
  }, { rootMargin: '-38% 0px -56% 0px', threshold: 0 });

  trackedSections.forEach(function (sec) { sectionObserver.observe(sec); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.section__head, .exp-card, .contact__card, .edu-card, .cert-card, .cert-extra__card, .skill-card, .lang-list, .programming-panel, .hero__inner');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var htmlEl = document.documentElement;

  function setThemeAttr(theme, persist) {
    htmlEl.setAttribute('data-theme', theme);
    htmlEl.classList.toggle('dark-theme', theme === 'dark');
    htmlEl.classList.toggle('light-theme', theme === 'light');
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
  }

  setThemeAttr(htmlEl.getAttribute('data-theme') || 'dark', false);

  themeToggle.addEventListener('click', function () {
    var current = htmlEl.getAttribute('data-theme');
    setThemeAttr(current === 'dark' ? 'light' : 'dark', true);
  });

  /* ---------- Custom cursor ---------- */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (finePointer) {
    var cursorDot = document.querySelector('.cursor-dot');
    var cursorRing = document.querySelector('.cursor-ring');
    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var ringPos = { x: mouse.x, y: mouse.y };
    var cursorShown = false;
    var rafId = null;

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursorDot.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
      if (!cursorShown) {
        cursorShown = true;
        ringPos.x = e.clientX;
        ringPos.y = e.clientY;
        htmlEl.classList.add('cursor-on');
      }
      if (rafId === null && !reducedMotion) {
        rafId = requestAnimationFrame(cursorLoop);
      }
    });

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .gallery__item, [role="button"], label, input, textarea, select')) {
        document.body.classList.add('cursor-hovering');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .gallery__item, [role="button"], label, input, textarea, select')) {
        document.body.classList.remove('cursor-hovering');
      }
    });

    htmlEl.addEventListener('mouseleave', function () { htmlEl.classList.remove('cursor-on'); });
    htmlEl.addEventListener('mouseenter', function () { htmlEl.classList.add('cursor-on'); });

    function cursorLoop() {
      ringPos.x += (mouse.x - ringPos.x) * 0.22;
      ringPos.y += (mouse.y - ringPos.y) * 0.22;
      cursorRing.style.transform = 'translate(' + ringPos.x + 'px, ' + ringPos.y + 'px) translate(-50%, -50%)';
      rafId = requestAnimationFrame(cursorLoop);
    }

    if (reducedMotion) {
      window.addEventListener('mousemove', function (e) {
        cursorRing.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
      });
    } else {
      rafId = requestAnimationFrame(cursorLoop);
    }
  }

  renderGallery();
})();