// Indusplast — interações do layout
(function () {
  var header = document.querySelector('.header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  // Cabeçalho com sombra ao rolar
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menu mobile
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open'); burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', false);
    });
  });

  // Animação de entrada
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('is-in'); });

  // Contadores
  var counted = false;
  var stats = document.querySelector('.stats');
  function count() {
    document.querySelectorAll('.count').forEach(function (el) {
      var to = +el.dataset.to, from = to > 1000 ? to - 18 : 0, t0 = null;
      function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }
  if (io && stats) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting && !counted) { counted = true; count(); o.disconnect(); } }, { threshold: .4 }).observe(stats);

  // Seletor de cores (troca o feixe real recortado do PSD)
  var stage = document.getElementById('colorStage');
  var img = document.getElementById('colorImg');
  var nameEl = document.getElementById('swatchName');
  var chosen = 'Verde';
  document.querySelectorAll('#swatches button').forEach(function (b) {
    var pre = new Image(); pre.src = 'assets/img/' + b.dataset.img + '.webp';
    b.addEventListener('click', function () {
      document.querySelectorAll('#swatches button').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      stage.style.setProperty('--c', b.style.getPropertyValue('--c'));
      img.classList.add('is-swap');
      setTimeout(function () { img.src = pre.src; img.alt = 'Feixe de monofilamento ' + b.dataset.name.toLowerCase(); img.classList.remove('is-swap'); }, 180);
      chosen = b.dataset.name; nameEl.textContent = chosen;
    });
  });
  document.getElementById('swatchCta').addEventListener('click', function () {
    var msg = document.querySelector('#form textarea');
    if (msg && !msg.value) msg.value = 'Cor: ' + chosen + '. Quantidade: ';
  });

  // Formulário -> WhatsApp
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var txt = 'Olá, Indusplast! Gostaria de um orçamento.%0A' +
      '*Nome:* ' + encodeURIComponent(f.nome.value) + '%0A' +
      '*Empresa:* ' + encodeURIComponent(f.empresa.value) + '%0A' +
      '*Produto:* ' + encodeURIComponent(f.produto.value) + '%0A' +
      '*Corte:* ' + encodeURIComponent(f.corte.value) + '%0A' +
      '*Detalhes:* ' + encodeURIComponent(f.msg.value);
    window.open('https://wa.me/5500000000000?text=' + txt, '_blank');
  });

  // Menu ativo conforme a seção
  var links = nav.querySelectorAll('a');
  var secs = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  window.addEventListener('scroll', function () {
    var y = window.scrollY + 120, cur = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === cur); });
  }, { passive: true });

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
