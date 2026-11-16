/* ============================================================
   Camping Nahuelito — JS compartido (index.html + casa.html)
   ► Todo lo que hay que completar con datos reales está en CONFIG.
   ============================================================ */
const CONFIG = {
  // WhatsApp en formato internacional, solo números (54 + 9 + código de área + número)
  whatsapp: '5492942000000',                // ← REEMPLAZAR por el número real
  phoneDisplay: '+54 9 2942 00-0000',       // ← cómo se muestra el teléfono en la web
  parcelas: 7,                              // ← cantidad de parcelas de camping
  // Ubicación exacta del camping (Google Maps: "Camping El Nahuelito")
  campingMap: '-38.8951958,-71.2887259',
  mapsLink: 'https://maps.app.goo.gl/jM2Kapfxchp8Rexy9',
  // Fotos del camping para la galería (carpeta img/). Las casas están en casa.js
  gallery: [
    '25','31','13','30','04','03','06','07','08','29','10','12','15','14','16','11',
    '19','20','23','24','28','21','18','26','22'
  ]
};

(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- utilidades compartidas con casa.js ---------- */
  const waUrl = (text) =>
    `https://wa.me/${CONFIG.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');
  const mapSrc = (q) =>
    `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
  window.NAH = { CONFIG, waUrl, mapSrc, $, $$ };

  /* ---------- datos de configuración en el HTML ---------- */
  $$('[data-cfg="parcelas"]').forEach((el) => (el.textContent = CONFIG.parcelas));
  $$('.js-phone').forEach((el) => (el.textContent = CONFIG.phoneDisplay));
  $$('.js-maps').forEach((a) => { a.href = CONFIG.mapsLink; a.target = '_blank'; a.rel = 'noopener'; });
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  const waText = document.body.dataset.page === 'casas'
    ? 'Hola! Quisiera consultar disponibilidad de las casas.'
    : 'Hola! Quisiera consultar disponibilidad en el Camping Nahuelito.';
  $$('.js-wa').forEach((a) => {
    a.href = waUrl(waText);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- header ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = $('#burger'), nav = $('#nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-menu', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- aparición al hacer scroll ---------- */
  const io = ('IntersectionObserver' in window && !reduceMotion)
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;
  // también lo usa casa.js para los bloques que genera después
  window.NAH.reveal = (root = document) =>
    $$('.reveal:not(.is-in)', root).forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));
  window.NAH.reveal();

  /* ---------- carrusel del hero ---------- */
  const slidesBox = $('#heroSlides');
  if (slidesBox) {
    const slides = $$('.hero__slide', slidesBox);
    const dotsBox = $('#heroDots');
    let cur = 0, timer;
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Foto ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsBox.appendChild(b); return b;
    });
    function go(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === cur));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === cur));
      const img = $('img', slides[cur]); if (img) img.loading = 'eager';
    }
    const restart = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => go(cur + 1), 6000); };
    $('#heroPrev').addEventListener('click', () => { go(cur - 1); restart(); });
    $('#heroNext').addEventListener('click', () => { go(cur + 1); restart(); });
    go(0); restart();
  }

  /* ---------- lightbox ---------- */
  const lb = $('#lb');
  let lbList = [], lbIdx = 0, lbOpener = null;
  const lbShow = () => {
    const it = lbList[lbIdx];
    $('#lbImg').src = it.src; $('#lbImg').alt = it.alt || '';
    $('#lbCount').textContent = `${lbIdx + 1} / ${lbList.length}`;
  };
  function lbOpen(list, i, opener) {
    lbList = list; lbIdx = i; lbOpener = opener || null;
    lbShow(); lb.hidden = false; document.body.classList.add('is-locked');
    $('#lbClose').focus();
  }
  function lbClose() {
    lb.hidden = true; document.body.classList.remove('is-locked');
    if (lbOpener) lbOpener.focus();
  }
  if (lb) {
    const step = (d) => { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbShow(); };
    $('#lbClose').addEventListener('click', lbClose);
    $('#lbPrev').addEventListener('click', () => step(-1));
    $('#lbNext').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- galería del camping ---------- */
  const gal = $('#gallery');
  if (gal) {
    const items = CONFIG.gallery.map((n) => ({ src: `img/${n}.jpg`, alt: `Camping Nahuelito, foto ${n}` }));
    items.forEach((it, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Ampliar foto ${i + 1}`);
      b.innerHTML = `<img src="${it.src}" alt="${it.alt}" loading="lazy">`;
      b.addEventListener('click', () => lbOpen(items, i, b));
      gal.appendChild(b);
    });
    // miniaturas sueltas (sección "El lago")
    $$('.thumb[data-lb]').forEach((t) => {
      const i = CONFIG.gallery.indexOf(t.dataset.lb);
      if (i > -1) t.addEventListener('click', () => lbOpen(items, i, t));
    });
  }

  /* ---------- mapa del camping (solo en index) ---------- */
  const campMap = document.body.dataset.page === 'camping' ? $('#mapFrame') : null;
  if (campMap) {
    const load = () => { campMap.src = mapSrc(CONFIG.campingMap); };
    if ('IntersectionObserver' in window) {
      const mo = new IntersectionObserver((e) => { if (e[0].isIntersecting) { load(); mo.disconnect(); } }, { rootMargin: '300px' });
      mo.observe(campMap);
    } else load();
  }

  /* ---------- formulario → WhatsApp ---------- */
  const form = $('#contactForm');
  if (form) {
    const sel = $('#selAloj');
    // botones "Consultar parcela / dormi" preseleccionan la opción
    $$('.js-pick').forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.pick; const o = [...sel.options].find((x) => x.text === v);
      if (o) sel.value = o.value || o.text;
    }));
    const today = new Date().toISOString().slice(0, 10);
    $$('input[type=date]', form).forEach((d) => (d.min = today));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const nombre = (f.get('nombre') || '').trim();
      const inp = form.elements.nombre;
      inp.classList.toggle('is-bad', !nombre);
      if (!nombre) { inp.focus(); return; }
      const fmt = (d) => d ? d.split('-').reverse().join('/') : 'a definir';
      const lines = [
        'Hola! Quisiera hacer una consulta:',
        `• Nombre: ${nombre}`,
        `• Opción: ${f.get('alojamiento')}`,
        `• Llegada: ${fmt(f.get('llegada'))}`,
        `• Salida: ${fmt(f.get('salida'))}`,
        `• Personas: ${f.get('personas')}`
      ];
      const msg = (f.get('mensaje') || '').trim();
      if (msg) lines.push(`• Mensaje: ${msg}`);
      window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
    });
    form.elements.nombre.addEventListener('input', (e) => e.target.classList.remove('is-bad'));
  }
})();
