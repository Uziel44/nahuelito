/* ============================================================
   Camping Nahuelito — página de casas (casa.html)
   ► Para editar una casa (textos, fotos, servicios, mapa) basta con
     cambiar el objeto correspondiente en HOUSES. Todo lo demás se genera.
   ============================================================ */
const HOUSES = [
  {
    slug: 'casa-grande',
    name: 'Casa Grande “El Verde”',
    short: 'Hasta 22 personas',
    tag: 'Hasta 22 personas',
    photos: ['17'],          // ← sumar más fotos de esta casa (img/NN.jpg)
    summary: 'Construcción de primera calidad para grupos grandes y eventos, con luz de red e internet satelital.',
    desc: 'Una casa de construcción sólida, de primera calidad, con materiales nobles y detalles de losa que le dan excelente confort. Cuenta con luz de red e internet satelital Starlink, y tiene lugar para hasta 22 personas: ideal para grupos numerosos, familias grandes y eventos.',
    chips: [['users', '22 personas'], ['home', 'Primera calidad']],
    facts: [
      ['users', '22', 'personas de capacidad'],
      ['home', 'Sólida', 'materiales de primera y losa'],
      ['check', 'Starlink', 'internet satelital']
    ],
    services: [
      'Capacidad hasta 22 personas',
      'Construcción sólida con losa',
      'Luz de red',
      'Internet satelital Starlink',
      'Ideal para grupos y eventos',
      'En el predio del Camping Nahuelito'
    ],
    map: null               // ← búsqueda o coordenadas propias; si es null usa la del camping
  },
  {
    slug: 'casa-el-nahuelito',
    name: 'Casa El Nahuelito',
    short: 'Hasta 7 personas · junto a Lamelehue',
    tag: 'Junto a Lamelehue',
    photos: ['27', '09', '05', '02'],
    summary: 'Casa amplia y muy cómoda, con 3 habitaciones, 2 baños y un gran comedor de unos 14 metros.',
    desc: 'Una casa amplia y muy cómoda ubicada al lado de Lamelehue. Tiene tres habitaciones en la planta alta, un baño arriba y otro abajo, y un gran comedor de aproximadamente 14 metros con todas las comodidades. Está pensada para alojar hasta 7 personas.',
    chips: [['users', '7 personas'], ['bath', '2 baños']],
    facts: [
      ['users', '7', 'personas de capacidad'],
      ['bed', '3', 'habitaciones en planta alta'],
      ['bath', '2', 'baños: uno arriba, uno abajo'],
      ['sofa', '≈ 14 m', 'gran comedor']
    ],
    services: [
      'Capacidad hasta 7 personas',
      '3 habitaciones en planta alta',
      'Baño arriba y baño abajo',
      'Gran comedor de unos 14 m',
      'Ubicada junto a Lamelehue',
      'En el predio del Camping Nahuelito'
    ],
    map: null
  },
  {
    slug: 'tercera-casa',
    name: 'Tercera casa',
    short: 'Próximamente',
    tag: 'Próximamente',
    photos: ['01', '11'],
    summary: 'Propiedad de uso particular que se prepara para sumarse a la oferta turística de temporada.',
    desc: 'Esta propiedad es hoy de uso particular y se está preparando para sumarse a la oferta turística de temporada. Consultanos por novedades y fechas disponibles.',
    chips: [['home', 'En preparación']],
    facts: [
      ['home', 'Uso particular', 'habilitada hoy'],
      ['check', 'Temporada', 'preparación turística']
    ],
    services: [
      'Preparación para turismo de temporada',
      'Consultá novedades y disponibilidad',
      'En el predio del Camping Nahuelito'
    ],
    map: null
  }
];

(function () {
  'use strict';
  const { CONFIG, waUrl, mapSrc, $, $$ } = window.NAH;
  const ico = (n) => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const img = (n) => `img/${n}.jpg`;
  const bySlug = (s) => HOUSES.find((h) => h.slug === s);

  /* ---------- tarjetas de casas ---------- */
  $('#housesGrid').innerHTML = HOUSES.map((h) => `
    <article class="house reveal">
      <div class="house__img">
        <img src="${img(h.photos[0])}" alt="${h.name}" loading="lazy">
        <span class="house__tag">${h.tag}</span>
      </div>
      <div class="house__body">
        <h3>${h.name}</h3>
        <ul class="chips">${h.chips.map(([i, t]) => `<li>${ico(i)} ${t}</li>`).join('')}</ul>
        <p>${h.summary}</p>
        <a class="btn btn--outline btn--sm" href="#casa/${h.slug}">Ver ficha completa ${ico('right')}</a>
      </div>
    </article>`).join('');

  /* ---------- servicios por casa ---------- */
  $('#servicesGrid').innerHTML = HOUSES.map((h) => `
    <article class="service reveal">
      ${ico('home').replace('class="ic"', 'class="ic ic--lg"')}
      <h3>${h.name}</h3>
      <ul class="ticks">${h.services.map((s) => `<li>${ico('check')} ${s}</li>`).join('')}</ul>
      <small><a href="#casa/${h.slug}">Ver ficha →</a></small>
    </article>`).join('');

  window.NAH.reveal();

  /* ---------- selector del formulario ---------- */
  $('#selAloj').innerHTML = HOUSES.map((h) => `<option value="${h.name}">${h.name} (${h.short})</option>`).join('')
    + '<option>Todavía no sé</option>';

  /* ---------- mapa con las 3 casas ---------- */
  const mapFrame = $('#mapFrame');
  const mapList = $('#mapList');
  mapList.innerHTML = HOUSES.map((h, i) => `
    <li><button type="button" data-slug="${h.slug}" class="${i === 0 ? 'is-active' : ''}">
      <span class="num">${i + 1}</span><span><b>${h.name}</b><small>${h.short}</small></span>
    </button></li>`).join('');
  const setMap = (h) => {
    mapFrame.src = mapSrc(h.map || CONFIG.campingMap);
    $$('button', mapList).forEach((b) => b.classList.toggle('is-active', b.dataset.slug === h.slug));
  };
  mapList.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (b) setMap(bySlug(b.dataset.slug));
  });
  if ('IntersectionObserver' in window) {
    const mo = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setMap(HOUSES[0]); mo.disconnect(); } }, { rootMargin: '300px' });
    mo.observe(mapFrame);
  } else setMap(HOUSES[0]);

  /* ---------- ficha de casa (vista propia, con hash #casa/slug) ---------- */
  const detail = $('#detail');
  const dBack = $('#dBack');
  let current = null;

  function showPhoto(h, i) {
    const m = $('#dMain');
    m.src = img(h.photos[i]); m.alt = `${h.name}, foto ${i + 1}`;
    $$('#dThumbs button').forEach((b, k) => b.classList.toggle('is-active', k === i));
  }

  function openHouse(h) {
    current = h;
    $('#dTag').textContent = h.tag;
    $('#dTitle').textContent = h.name;
    $('#dDesc').textContent = h.desc;
    $('#dFacts').innerHTML = h.facts.map(([i, b, s]) => `<li>${ico(i)}<b>${b}</b><span>${s}</span></li>`).join('');
    $('#dServices').innerHTML = h.services.map((s) => `<li>${ico('check')} ${s}</li>`).join('');
    const th = $('#dThumbs');
    th.innerHTML = h.photos.map((n, i) => `<button type="button" aria-label="Ver foto ${i + 1}"><img src="${img(n)}" alt=""></button>`).join('');
    th.hidden = h.photos.length < 2;
    th.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      showPhoto(h, [...th.children].indexOf(b));
    };
    showPhoto(h, 0);
    $('#dMap').src = mapSrc(h.map || CONFIG.campingMap);
    document.title = `${h.name} · Camping Nahuelito`;
    detail.hidden = false;
    $('.detail__scroll', detail).scrollTop = 0;
    document.body.classList.add('is-locked');
    dBack.focus({ preventScroll: true });
  }

  function closeHouse() {
    if (detail.hidden) return;
    detail.hidden = true;
    document.body.classList.remove('is-locked');
    $('#dMap').removeAttribute('src');
    document.title = 'Casas en alquiler · Camping Nahuelito';
  }

  function route() {
    const m = location.hash.match(/^#casa\/([\w-]+)$/);
    const h = m && bySlug(m[1]);
    if (h) openHouse(h); else closeHouse();
  }
  addEventListener('hashchange', route);
  route();

  dBack.addEventListener('click', () => { location.hash = '#casas'; });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !detail.hidden) location.hash = '#casas'; });

  // "Consultar esta casa": cierra la ficha, preselecciona la casa y baja al formulario
  $('#dCta').addEventListener('click', (e) => {
    e.preventDefault();
    if (current) $('#selAloj').value = current.name;
    location.hash = '#contacto';
  });
})();
