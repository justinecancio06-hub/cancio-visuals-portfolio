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
  var lightboxOrg = document.getElementById('lightboxOrg');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxYear = document.getElementById('lightboxYear');
  var lightboxDesc = document.getElementById('lightboxDesc');
  var lightboxOrgRow = document.getElementById('lightboxOrgRow');
  var lightboxTitleRow = document.getElementById('lightboxTitleRow');
  var lightboxYearRow = document.getElementById('lightboxYearRow');
  var lightboxDescRow = document.getElementById('lightboxDescRow');
  var lightboxTrigger = null;
  var splitMode = false;
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
      figure.className = currentFolder === 'certificate' ? 'gallery__item gallery__item--cert' : 'gallery__item';
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

      if (currentFolder === 'certificate') {
        var more = document.createElement('button');
        more.type = 'button';
        more.className = 'cert-card__more';
        more.textContent = 'Click for more detail';
        more.addEventListener('click', function (e) {
          e.stopPropagation();
          lightboxTrigger = more;
          openLightbox(i, true);
        });
        figure.appendChild(more);
      }

      if (currentFolder !== 'certificate') {
        figure.addEventListener('click', function () {
          openLightbox(i);
        });
      }
      frag.appendChild(figure);
    });

    grid.innerHTML = '';
    grid.appendChild(frag);
  }

  function isVexel(file) {
    return /^Vexel/i.test(file);
  }

  function openLightbox(index, split) {
    currentIndex = index;
    splitMode = !!split;
    updateLightbox();
    lightbox.classList.toggle('lightbox--split', splitMode && currentFolder === 'certificate');
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lightboxTrigger) {
      if (lightboxTrigger.focus) lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }

  function updateLightbox() {
    var file = currentFiles[currentIndex];
    lightboxImg.src = encodeURI('images/' + currentFolder + '/' + file);
    lightboxCaption.textContent = prettyName(file);
    if (currentFolder === 'certificate') fillLightboxDetails(file);
  }

  function fillLightboxDetails(file) {
    var found = null;
    document.querySelectorAll('.cert-card__img, .cert-extra__img').forEach(function (img) {
      if (img.dataset.file && img.dataset.file.toLowerCase() === file.toLowerCase()) {
        found = img;
      }
    });
    var card = found ? found.closest('.cert-card, .cert-extra__card') : null;
    if (!card) {
      console.warn('Certificate details not found for: ' + file);
      lightboxOrgRow.hidden = true;
      lightboxTitleRow.hidden = true;
      lightboxYearRow.hidden = true;
      lightboxDescRow.hidden = true;
      return;
    }
    var org = card.querySelector('.cert-card__org');
    var title = card.querySelector('.cert-card__title') || card.querySelector('h5');
    var year = card.querySelector('.cert-card__year');
    var desc = card.querySelector('.cert-card__desc');
    lightboxOrg.textContent = org ? org.textContent : '';
    lightboxTitle.textContent = title ? title.textContent : '';
    lightboxYear.textContent = year ? year.textContent : '';
    lightboxDesc.textContent = desc ? desc.textContent : '';
    lightboxOrgRow.hidden = !org;
    lightboxTitleRow.hidden = !title;
    lightboxYearRow.hidden = !year;
    lightboxDescRow.hidden = !desc;
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

  /* ---------- Lightbox keyboard ---------- */
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

  renderGallery();
})();