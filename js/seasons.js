/* ══════════════════════════════════════════════════════════════
   seasons.js — Effets saisonniers MathPratik v4.0
   Autonome · Zéro dépendance · 1 boucle RAF par mois
   Mars / Mai / Décembre : placeholders neutres (à compléter)
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── État global ── */
  var _af    = [];   // IDs requestAnimationFrame en cours
  var _cl    = [];   // fonctions de nettoyage
  var _month = -1;
  var _wcMap = new WeakMap();

  /* ── Utilitaires ── */
  function rand(min, max) { return min + Math.random() * (max - min); }
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }

  function fitCanvas(cv, card) {
    cv.width  = card.offsetWidth  || card.getBoundingClientRect().width  || 280;
    cv.height = card.offsetHeight || card.getBoundingClientRect().height || 88;
  }

  /* Canvas injecté dans une carte — z-index:0 pour rester derrière le contenu */
  function _cv(card) {
    if (_wcMap.has(card)) return _wcMap.get(card);
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.style.overflow = 'hidden';
    var cv = document.createElement('canvas');
    cv.className = 'mp-cv';
    cv.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;border-radius:inherit;';
    cv.width  = card.offsetWidth  || 280;
    cv.height = card.offsetHeight || 88;
    card.insertBefore(cv, card.firstChild);
    _wcMap.set(card, cv);
    return cv;
  }

  /* Cartes visibles */
  function _cards() {
    var inActive = Array.from(
      document.querySelectorAll('.screen.active .niveau-card, .screen.active .theme-check, .screen.active .notion-card')
    );
    if (inActive.length) return inActive;
    return Array.from(document.querySelectorAll('.niveau-card,.theme-check,.notion-card'));
  }

  /* Couche de fond de page */
  function _bgLayer() {
    var el = document.getElementById('mp-bg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mp-bg';
      el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
      document.body.insertBefore(el, document.body.firstChild);
    }
    return el;
  }

  /* Boucle RAF partagée pour toutes les cartes d'un mois */
  function _sharedLoop(drawFn) {
    var running = true, startTime = null;
    _cl.push(function () { running = false; });
    function tick(ts) {
      if (!running) return;
      if (!startTime) startTime = ts;
      drawFn((ts - startTime) / 1000);
      _af.push(requestAnimationFrame(tick));
    }
    _af.push(requestAnimationFrame(tick));
  }

  /* ResizeObserver sur une carte */
  function _watchResize(card, canvas, onResize) {
    if (typeof ResizeObserver === 'undefined') return;
    var ro = new ResizeObserver(function () {
      fitCanvas(canvas, card);
      if (onResize) onResize(canvas.width, canvas.height);
    });
    ro.observe(card);
    _cl.push(function () { ro.disconnect(); });
  }

  /* Arrêt complet */
  function _stopAll() {
    _af.forEach(function (id) { cancelAnimationFrame(id); }); _af = [];
    _cl.forEach(function (fn) { fn(); }); _cl = [];
    document.querySelectorAll('.mp-cv').forEach(function (cv) {
      try { cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); } catch (e) {}
      cv.remove();
    });
    document.querySelectorAll('.mp-wave').forEach(function (el) { el.remove(); });
    _wcMap = new WeakMap();
  }

  /* ════════════════════════════════════════════════════════════
     FOND DE PAGE PAR MOIS
  ════════════════════════════════════════════════════════════ */
  function renderBackground(season) {
    var layer = _bgLayer();
    layer.innerHTML = '';

    /* ── JANVIER : flocons de fond lents ── */
    if (season === 'janvier') {
      var canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      layer.appendChild(canvas);
      function fitBg() { canvas.width = layer.offsetWidth; canvas.height = layer.offsetHeight; }
      fitBg();
      window.addEventListener('resize', fitBg);
      var ctx = canvas.getContext('2d');
      var bgFlakes = Array.from({ length: 30 }, function () { return {
        x: Math.random() * 100, y: Math.random() * 100,
        r: 1 + Math.random() * 2.5, speed: 0.008 + Math.random() * 0.016,
        drift: (Math.random() - 0.5) * 0.006, opacity: 0.15 + Math.random() * 0.3,
      }; });
      var bgRunning = true;
      _cl.push(function () { bgRunning = false; });
      (function bgLoop() {
        if (!bgRunning) return;
        var W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        bgFlakes.forEach(function (f) {
          f.y += f.speed; f.x += f.drift;
          if (f.y > 100) { f.y = -2; f.x = Math.random() * 100; }
          ctx.beginPath();
          ctx.arc(f.x / 100 * W, f.y / 100 * H, f.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(219,234,254,' + f.opacity + ')';
          ctx.fill();
        });
        _af.push(requestAnimationFrame(bgLoop));
      })();
    }

    /* ── FÉVRIER : petits cœurs SVG flottants ── */
    if (season === 'fevrier') {
      if (!document.getElementById('mp-pollen-kf')) {
        var s = document.createElement('style'); s.id = 'mp-pollen-kf';
        s.textContent = '@keyframes mp-pollen-float{0%{transform:translate(0,0) scale(1);opacity:0}15%{opacity:.6}85%{opacity:.3}100%{transform:translate(var(--dx),var(--dy)) scale(.5);opacity:0}}';
        document.head.appendChild(s);
      }
      var svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      var hcols = ['rgba(251,182,206,0.4)', 'rgba(249,168,212,0.35)', 'rgba(252,165,165,0.3)'];
      for (var i = 0; i < 16; i++) {
        var hx = rand(5, 90), hy = rand(15, 85), hs = rand(6, 13);
        var hdur = rand(8, 16), hdel = rand(0, 10);
        var hcol = hcols[Math.floor(Math.random() * hcols.length)];
        svg += '<path transform="translate(' + hx + '%, ' + hy + '%) scale(' + (hs / 20) + ')"' +
          ' d="M0,-8 C0,-14 -10,-14 -10,-8 C-10,-2 0,6 0,10 C0,6 10,-2 10,-8 C10,-14 0,-14 0,-8 Z"' +
          ' fill="' + hcol + '"' +
          ' style="--dx:' + rand(-30, 30) + 'px;--dy:' + rand(-80, -30) + 'px;animation:mp-pollen-float ' + hdur + 's ' + hdel + 's ease-in-out infinite;"/>';
      }
      svg += '</svg>';
      layer.innerHTML = svg;
    }

    /* ── MARS : placeholder — fond vert printemps ── */
    /* (animation canvas à implémenter dans une prochaine conversation) */

    /* ── AVRIL : fond doré pâle ── */
    if (season === 'avril') {
      layer.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50%" cy="95%" rx="200" ry="60" fill="rgba(187,247,208,0.25)"/></svg>';
    }

    /* ── MAI : placeholder — fond rose pâle ── */
    /* (animation canvas à implémenter dans une prochaine conversation) */

    /* ── JUIN : lucioles en fond ── */
    if (season === 'juin') {
      var canvas2 = document.createElement('canvas');
      canvas2.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      layer.appendChild(canvas2);
      function fitBg2() { canvas2.width = layer.offsetWidth; canvas2.height = layer.offsetHeight; }
      fitBg2(); window.addEventListener('resize', fitBg2);
      var ctx2 = canvas2.getContext('2d');
      var fireflies = Array.from({ length: 24 }, function () { return {
        x: rand(5, 95), y: rand(20, 90),
        dx: rand(-0.012, 0.012), dy: rand(-0.008, 0.008),
        phase: rand(0, Math.PI * 2), freq: rand(0.8, 2.2),
        size: rand(1.2, 2.5), color: Math.random() < 0.6 ? '#fde047' : '#bbf7d0',
      }; });
      var bgR2 = true; _cl.push(function () { bgR2 = false; });
      var bt2 = 0;
      (function bl2() {
        if (!bgR2) return; bt2 += 0.016;
        var W = canvas2.width, H = canvas2.height;
        ctx2.clearRect(0, 0, W, H);
        fireflies.forEach(function (f) {
          f.x += f.dx; f.y += f.dy;
          if (f.x < 0) f.x = 100; if (f.x > 100) f.x = 0;
          if (f.y < 0) f.y = 100; if (f.y > 100) f.y = 0;
          var alpha = (Math.sin(bt2 * f.freq + f.phase) + 1) * 0.5 * 0.5 + 0.05;
          var rgb = f.color === '#fde047' ? '253,224,71' : '187,247,208';
          var glow = ctx2.createRadialGradient(f.x / 100 * W, f.y / 100 * H, 0, f.x / 100 * W, f.y / 100 * H, f.size * 4);
          glow.addColorStop(0, 'rgba(' + rgb + ',' + (alpha * 0.8) + ')');
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx2.beginPath(); ctx2.arc(f.x / 100 * W, f.y / 100 * H, f.size * 4, 0, Math.PI * 2);
          ctx2.fillStyle = glow; ctx2.fill();
          ctx2.beginPath(); ctx2.arc(f.x / 100 * W, f.y / 100 * H, f.size * 0.7, 0, Math.PI * 2);
          ctx2.fillStyle = f.color; ctx2.globalAlpha = Math.min(alpha * 1.5, 1); ctx2.fill();
          ctx2.globalAlpha = 1;
        });
        _af.push(requestAnimationFrame(bl2));
      })();
    }

    /* ── JUILLET : soleil + halo de chaleur en fond ── */
    if (season === 'juillet') {
      if (!document.getElementById('mp-ray-kf')) {
        var sr = document.createElement('style'); sr.id = 'mp-ray-kf';
        sr.textContent = '@keyframes mp-ray-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes mp-ray-pulse{0%,100%{opacity:.15}50%{opacity:.28}}';
        document.head.appendChild(sr);
      }
      layer.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="82%" cy="8%" r="110" fill="rgba(251,146,60,0.1)"/>' +
        '<circle cx="82%" cy="8%" r="70"  fill="rgba(253,186,116,0.15)"/>' +
        '<circle cx="82%" cy="8%" r="38"  fill="rgba(253,186,116,0.55)"/>' +
        '<circle cx="82%" cy="8%" r="26"  fill="rgba(254,215,170,0.75)"/>' +
        '<ellipse cx="50%" cy="95%" rx="200" ry="40" fill="rgba(251,146,60,0.08)"/>' +
        '</svg>';
    }

    /* ── AOÛT : reflet solaire sur mer en fond ── */
    if (season === 'aout') {
      layer.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="50%" cy="10%" r="90"  fill="rgba(253,224,71,0.12)"/>' +
        '<circle cx="50%" cy="10%" r="55"  fill="rgba(253,224,71,0.18)"/>' +
        '<ellipse cx="50%" cy="95%" rx="180" ry="35" fill="rgba(56,189,248,0.2)"/>' +
        '</svg>';
    }

    /* ── SEPTEMBRE : bulles colorées rentrée en fond ── */
    if (season === 'septembre') {
      if (!document.getElementById('mp-pollen-kf')) {
        var sp2 = document.createElement('style'); sp2.id = 'mp-pollen-kf';
        sp2.textContent = '@keyframes mp-pollen-float{0%{transform:translate(0,0) scale(1);opacity:0}15%{opacity:.6}85%{opacity:.3}100%{transform:translate(var(--dx),var(--dy)) scale(.5);opacity:0}}';
        document.head.appendChild(sp2);
      }
      var svg9 = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
      var rc = ['rgba(59,130,246,0.18)', 'rgba(239,68,68,0.16)', 'rgba(34,197,94,0.16)', 'rgba(168,85,247,0.16)', 'rgba(234,179,8,0.22)'];
      for (var i9 = 0; i9 < 18; i9++) {
        svg9 += '<circle cx="' + rand(3, 95) + '%" cy="' + rand(5, 90) + '%" r="' + rand(12, 32) + '" fill="' + rc[i9 % rc.length] + '"' +
          ' style="--dx:' + rand(-30, 30) + 'px;--dy:' + rand(-40, 40) + 'px;animation:mp-pollen-float ' + rand(8, 16) + 's ' + rand(0, 10) + 's ease-in-out infinite;"/>';
      }
      svg9 += '</svg>'; layer.innerHTML = svg9;
    }

    /* ── OCTOBRE : brouillard orangé en fond ── */
    if (season === 'octobre') {
      layer.innerHTML = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><filter id="mp-blur4"><feGaussianBlur stdDeviation="14"/></filter></defs>' +
        '<ellipse cx="15%" cy="25%" rx="180" ry="120" fill="rgba(251,146,60,0.16)" filter="url(#mp-blur4)"/>' +
        '<ellipse cx="80%" cy="15%" rx="150" ry="100" fill="rgba(234,88,12,0.13)"  filter="url(#mp-blur4)"/>' +
        '<ellipse cx="50%" cy="80%" rx="200" ry="80"  fill="rgba(120,53,15,0.10)"  filter="url(#mp-blur4)"/>' +
        '</svg>';
    }

    /* ── NOVEMBRE : brume de fond ── */
    if (season === 'novembre') {
      var canvas3 = document.createElement('canvas');
      canvas3.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      layer.appendChild(canvas3);
      function fitBg3() { canvas3.width = layer.offsetWidth; canvas3.height = layer.offsetHeight; }
      fitBg3(); window.addEventListener('resize', fitBg3);
      var ctx3 = canvas3.getContext('2d');
      var mists = Array.from({ length: 6 }, function (_, i) { return {
        y: 60 + i * 7, speed: 0.008 + i * 0.003, phase: i * Math.PI / 3, alpha: 0.055 + i * 0.014,
      }; });
      var bgR3 = true; _cl.push(function () { bgR3 = false; });
      var bt3 = 0;
      (function bl3() {
        if (!bgR3) return; bt3 += 0.01;
        var W = canvas3.width, H = canvas3.height;
        ctx3.clearRect(0, 0, W, H);
        mists.forEach(function (m) {
          var y = (m.y / 100) * H + Math.sin(bt3 * m.speed * 10 + m.phase) * 8;
          var g = ctx3.createLinearGradient(0, y - 30, 0, y + 30);
          g.addColorStop(0, 'rgba(209,213,219,0)');
          g.addColorStop(0.5, 'rgba(209,213,219,' + m.alpha + ')');
          g.addColorStop(1, 'rgba(209,213,219,0)');
          ctx3.fillStyle = g; ctx3.fillRect(0, y - 30, W, 60);
        });
        _af.push(requestAnimationFrame(bl3));
      })();
    }

    /* ── DÉCEMBRE : placeholder — fond bleu hivernal ── */
    /* (animation canvas à implémenter dans une prochaine conversation) */
  }

  /* ════════════════════════════════════════════════════════════
     HELPERS COMMUNS AUX ANIMATIONS CARTES
  ════════════════════════════════════════════════════════════ */

  function drawSnowflake(ctx, fx, fy, r, angle, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(fx, fy);
    ctx.rotate(angle);
    ctx.strokeStyle = isDark() ? 'rgba(147,197,253,0.85)' : 'rgba(186,230,252,0.9)';
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    for (var i = 0; i < 6; i++) {
      ctx.save(); ctx.rotate(i * Math.PI / 3);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r * 0.55); ctx.lineTo(-r * 0.28, -r * 0.28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r * 0.55); ctx.lineTo( r * 0.28, -r * 0.28); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawHeart(ctx, cx, cy, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.35);
    ctx.bezierCurveTo(-size * 0.6, -size * 0.2, -size * 1.2,  size * 0.3, 0, size);
    ctx.bezierCurveTo( size * 1.2,  size * 0.3,  size * 0.6, -size * 0.2, 0, size * 0.35);
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — JANVIER
  ════════════════════════════════════════════════════════════ */
  function initJanvier() {
    var janCards = _cards().map(function (card) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var W = canvas.width, H = canvas.height;
      var flakes = Array.from({ length: 12 }, function () { return {
        x: rand(0, W), y: rand(-H, H),
        r: rand(3, 7), speed: rand(0.15, 0.32),
        drift: rand(-0.15, 0.15), angle: rand(0, Math.PI * 2),
        spin: rand(-0.006, 0.006), opacity: rand(0.45, 0.85),
        phase: rand(0, Math.PI * 2),
      }; });
      var cd = { canvas: canvas, ctx: canvas.getContext('2d'), W: W, H: H, flakes: flakes };
      _watchResize(card, canvas, function (nw, nh) { cd.W = nw; cd.H = nh; });
      return cd;
    });

    _sharedLoop(function (t) {
      janCards.forEach(function (cd) {
        var ctx = cd.ctx, W = cd.W, H = cd.H;
        ctx.clearRect(0, 0, W, H);
        /* Givre en haut */
        ctx.strokeStyle = isDark() ? 'rgba(147,197,253,0.6)' : 'rgba(186,230,252,0.4)';
        ctx.lineWidth = 0.7; ctx.lineCap = 'round';
        for (var gx = 8; gx < W - 8; gx += 20) {
          var gy = 2 + Math.sin(gx * 0.3) * 1.5;
          ctx.save(); ctx.translate(gx, gy);
          for (var d = 0; d < 3; d++) {
            var a = (d / 3) * Math.PI - Math.PI / 2;
            var len = 5 + Math.sin(gx * 0.5) * 2;
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len); ctx.stroke();
          }
          ctx.restore();
        }
        /* Flocons */
        cd.flakes.forEach(function (f) {
          f.y += f.speed; f.x += f.drift + Math.sin(t * 0.7 + f.phase) * 0.1; f.angle += f.spin;
          if (f.y > H + 8) { f.y = -8; f.x = rand(0, W); }
          if (f.x < -8) f.x = W + 8; if (f.x > W + 8) f.x = -8;
          drawSnowflake(ctx, f.x, f.y, f.r, f.angle, f.opacity);
        });
        /* Neige au sol */
        ctx.beginPath(); ctx.moveTo(0, H);
        for (var i = 0; i <= Math.ceil(W / 2); i++) {
          var px = i * 2, py = H - (2.5 + Math.sin(i * 0.4 + 1.2) * 1.8);
          i === 0 ? ctx.moveTo(px, py) : ctx.quadraticCurveTo(px - 1, py + 0.8, px, py);
        }
        ctx.lineTo(W, H); ctx.closePath();
        ctx.fillStyle = isDark() ? 'rgba(147,197,253,0.3)' : 'rgba(239,246,255,0.85)'; ctx.fill();
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — FÉVRIER
  ════════════════════════════════════════════════════════════ */
  function initFevrier() {
    var heartPalettes = [
      ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
      ['#ec4899', '#f472b6', '#f9a8d4', '#fce7f3'],
      ['#e11d48', '#f43f5e', '#fb7185', '#ff8fab'],
    ];
    var fevCards = _cards().map(function (card, ci) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var W = canvas.width, H = canvas.height;
      var palette = heartPalettes[ci % heartPalettes.length];
      var hearts = Array.from({ length: 11 }, function (_, i) { return {
        x: rand(W * 0.1, W * 0.9), y: H + rand(10, 40),
        size: rand(3.5, 7.5), speed: rand(0.3, 0.7),
        drift: rand(-0.25, 0.25), sway: rand(0.4, 1.2),
        phase: rand(0, Math.PI * 2), color: palette[Math.floor(Math.random() * palette.length)],
        alpha: rand(0.55, 0.9), rot: rand(-0.3, 0.3),
        rotSpd: rand(-0.012, 0.012), delay: i * 0.4,
      }; });
      var cd = { canvas: canvas, ctx: canvas.getContext('2d'), W: W, H: H, hearts: hearts, palette: palette };
      _watchResize(card, canvas, function (nw, nh) { cd.W = nw; cd.H = nh; });
      return cd;
    });

    _sharedLoop(function (t) {
      fevCards.forEach(function (cd) {
        var ctx = cd.ctx, W = cd.W, H = cd.H, palette = cd.palette;
        ctx.clearRect(0, 0, W, H);
        cd.hearts.forEach(function (h) {
          if (t < h.delay) return;
          h.y -= h.speed; h.x += h.drift + Math.sin(t * h.sway + h.phase) * 0.35; h.rot += h.rotSpd;
          var lifeAlpha = h.y < H * 0.25 ? Math.max(0, h.y / (H * 0.25)) * h.alpha : h.alpha;
          var pulse = 1 + Math.sin(t * 2.5 + h.phase) * 0.06;
          ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.rot); ctx.scale(pulse, pulse);
          drawHeart(ctx, 0, 0, h.size, h.color, lifeAlpha);
          ctx.restore();
          if (h.y < -20) {
            h.y = H + rand(5, 30); h.x = rand(W * 0.08, W * 0.92);
            h.speed = rand(0.3, 0.7); h.size = rand(3.5, 7.5);
            h.color = palette[Math.floor(Math.random() * palette.length)];
            h.phase = rand(0, Math.PI * 2); h.delay = 0;
          }
        });
        /* Petits cœurs fixes en bas */
        for (var i = 0; i < 4; i++) {
          var sx = W * (0.12 + i * 0.22), sy = H - 6;
          var sp = 0.7 + Math.sin(t * 1.8 + i) * 0.15;
          drawHeart(ctx, sx, sy, sp * 3, palette[i % palette.length], 0.22);
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — MARS (placeholder neutre)
  ════════════════════════════════════════════════════════════ */
  function initMars() {
    /* Placeholder : fond vert très discret, aucune animation coûteuse */
    _cards().forEach(function (card) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
      var g = ctx.createLinearGradient(0, H * 0.7, 0, H);
      g.addColorStop(0, 'rgba(74,222,128,0.12)'); g.addColorStop(1, 'rgba(21,128,61,0.22)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — AVRIL
     2 œufs de Pâques + lapin qui traverse
  ════════════════════════════════════════════════════════════ */
  function initAvril() {
    var eggPalettes = [
      { colors: ['#f472b6', '#ec4899', '#9d174d'], pattern: 'dots'    },
      { colors: ['#60a5fa', '#3b82f6', '#1e3a8a'], pattern: 'stripes' },
      { colors: ['#34d399', '#10b981', '#065f46'], pattern: 'zigzag'  },
      { colors: ['#fb923c', '#f97316', '#7c2d12'], pattern: 'dots'    },
      { colors: ['#a78bfa', '#8b5cf6', '#4c1d95'], pattern: 'stripes' },
      { colors: ['#fde047', '#eab308', '#713f12'], pattern: 'zigzag'  },
    ];

    function drawEgg(ctx, cx, cy, rx, ry, colors, pattern, alpha, t) {
      var bob = Math.abs(Math.sin(t * 1.2)) * 2;
      ctx.save(); ctx.translate(cx, cy - bob); ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.save(); ctx.scale(rx, ry * 1.28); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.restore(); ctx.clip();
      var g = ctx.createRadialGradient(-rx * 0.28, -ry * 0.3, 0, 0, 0, rx * 1.5);
      g.addColorStop(0, colors[0]); g.addColorStop(0.55, colors[1]); g.addColorStop(1, colors[2]);
      ctx.fillStyle = g; ctx.fillRect(-rx * 1.2, -ry * 1.4, rx * 2.4, ry * 2.8);
      if (pattern === 'dots') {
        [[-0.35,-0.38],[0.35,-0.28],[0,0],[-0.3,0.3],[0.32,0.33]].forEach(function (dp) {
          ctx.beginPath(); ctx.arc(dp[0]*rx, dp[1]*ry, rx*0.15, 0, Math.PI*2);
          ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fill();
        });
      } else if (pattern === 'stripes') {
        for (var s = -3; s <= 3; s++) {
          ctx.fillStyle='rgba(255,255,255,' + (s%2===0 ? 0.28 : 0.14) + ')';
          ctx.fillRect(-rx, s*ry*0.32-ry*0.1, rx*2, ry*0.16);
        }
      }
      ctx.restore();
    }

    function drawRabbit(ctx, rx, ry, flip) {
      ctx.save(); ctx.translate(rx, ry); if (flip) ctx.scale(-1, 1);
      ctx.beginPath(); ctx.ellipse(0, 0, 9, 7, 0, 0, Math.PI*2); ctx.fillStyle='#f1f5f9'; ctx.fill();
      ctx.beginPath(); ctx.arc(10, -3, 6, 0, Math.PI*2); ctx.fillStyle='#f8fafc'; ctx.fill();
      ctx.fillStyle='#e2e8f0';
      ctx.beginPath(); ctx.ellipse( 8,-12,2.5,7,-0.2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(13,-11,2.5,7, 0.2,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(251,207,232,0.7)';
      ctx.beginPath(); ctx.ellipse( 8,-12,1.2,5,-0.2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(13,-11,1.2,5, 0.2,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(13,-4,1.2,0,Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill();
      ctx.beginPath(); ctx.arc(-9,1,3.5,0,Math.PI*2); ctx.fillStyle='white'; ctx.fill();
      ctx.restore();
    }

    var avrilCards = [];
    _cards().forEach(function (card, ci) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var W = canvas.width, H = canvas.height;
      var ctx = canvas.getContext('2d');
      var eggs = [
        { x: W*0.30, rx:12, ry:16, pal: eggPalettes[(ci*2)   % eggPalettes.length] },
        { x: W*0.70, rx:11, ry:15, pal: eggPalettes[(ci*2+1) % eggPalettes.length] },
      ];
      var cd = { canvas:canvas, ctx:ctx, W:W, H:H, eggs:eggs, rabbitX:-30, rabbitDir:1 };
      _watchResize(card, canvas, function (nw,nh){ cd.W=nw; cd.H=nh; });
      avrilCards.push(cd);
    });

    _sharedLoop(function (t) {
      avrilCards.forEach(function (cd) {
        var ctx=cd.ctx, W=cd.W, H=cd.H;
        ctx.clearRect(0,0,W,H);
        /* Sol */
        var gnd=ctx.createLinearGradient(0,H-8,0,H);
        gnd.addColorStop(0,'rgba(74,222,128,0.28)'); gnd.addColorStop(1,'rgba(21,128,61,0.44)');
        ctx.fillStyle=gnd; ctx.fillRect(0,H-8,W,8);
        /* Herbe courte */
        for (var gi=0; gi<20; gi++) {
          var gx=(gi/20)*W, gh=5+Math.sin(gi*1.3)*3, gsw=Math.sin(t*1.1+gi)*0.8;
          ctx.beginPath(); ctx.moveTo(gx,H); ctx.quadraticCurveTo(gx+gsw,H-gh*0.55,gx+gsw*0.6,H-gh);
          ctx.strokeStyle='rgba(34,197,94,0.65)'; ctx.lineWidth=1.2; ctx.lineCap='round'; ctx.stroke();
        }
        /* Lapin en fond semi-transparent */
        cd.rabbitX += cd.rabbitDir * 0.55;
        if (cd.rabbitX > W + 40) cd.rabbitX = -40;
        ctx.globalAlpha = 0.50;
        drawRabbit(ctx, cd.rabbitX, H-10, cd.rabbitDir < 0);
        ctx.globalAlpha = 1;
        /* Œufs */
        cd.eggs.forEach(function (e) {
          drawEgg(ctx, e.x, H-e.ry*1.2, e.rx, e.ry, e.pal.colors, e.pal.pattern, 0.92, t);
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — MAI (placeholder neutre)
  ════════════════════════════════════════════════════════════ */
  function initMai() {
    _cards().forEach(function (card) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
      var g = ctx.createLinearGradient(0, H * 0.6, 0, H);
      g.addColorStop(0, 'rgba(249,168,212,0.10)'); g.addColorStop(1, 'rgba(236,72,153,0.14)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — JUIN
     Lucioles + reflet lumineux diagonal
  ════════════════════════════════════════════════════════════ */
  function initJuin() {
    var juinCards = _cards().map(function (card) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var W = canvas.width, H = canvas.height;
      var flies = Array.from({ length: 8 }, function (_, i) { return {
        x: rand(W*0.1, W*0.9), y: rand(H*0.15, H*0.85),
        vx: rand(-0.18, 0.18), vy: rand(-0.12, 0.12),
        phase: rand(0, Math.PI*2), freq: rand(1.2, 2.8),
        size: rand(1.5, 3), color: i%3===0 ? '#bbf7d0' : '#fde047',
      }; });
      var shimmerX = -W * 0.3, shimmerDir = 1;
      var cd = { canvas:canvas, ctx:canvas.getContext('2d'), W:W, H:H, flies:flies, shimmerX:shimmerX, shimmerDir:shimmerDir };
      _watchResize(card, canvas, function(nw,nh){ cd.W=nw; cd.H=nh; });
      return cd;
    });

    _sharedLoop(function (t) {
      juinCards.forEach(function (cd) {
        var ctx=cd.ctx, W=cd.W, H=cd.H;
        ctx.clearRect(0,0,W,H);
        /* Reflet diagonal */
        cd.shimmerX += cd.shimmerDir * 0.55;
        if (cd.shimmerX > W*1.3) { cd.shimmerX=W*1.3; cd.shimmerDir=-1; }
        if (cd.shimmerX < -W*0.3) { cd.shimmerX=-W*0.3; cd.shimmerDir=1; }
        var sg = ctx.createLinearGradient(cd.shimmerX-35,0,cd.shimmerX+35,H);
        sg.addColorStop(0,'rgba(253,224,71,0)');
        sg.addColorStop(0.5,'rgba(253,224,71,0.07)');
        sg.addColorStop(1,'rgba(253,224,71,0)');
        ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
        /* Lucioles */
        cd.flies.forEach(function (f) {
          f.x += f.vx + Math.sin(t*0.6+f.phase)*0.12;
          f.y += f.vy + Math.cos(t*0.5+f.phase)*0.1;
          if(f.x<4)f.vx=Math.abs(f.vx); if(f.x>W-4)f.vx=-Math.abs(f.vx);
          if(f.y<4)f.vy=Math.abs(f.vy); if(f.y>H-4)f.vy=-Math.abs(f.vy);
          var alpha=(Math.sin(t*f.freq+f.phase)+1)*0.5;
          if(alpha<0.08) return;
          var rgb = f.color==='#fde047'?'253,224,71':'187,247,208';
          var glow=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.size*5);
          glow.addColorStop(0,'rgba('+rgb+','+(alpha*0.8)+')');
          glow.addColorStop(1,'rgba('+rgb+',0)');
          ctx.beginPath(); ctx.arc(f.x,f.y,f.size*5,0,Math.PI*2); ctx.fillStyle=glow; ctx.fill();
          ctx.beginPath(); ctx.arc(f.x,f.y,f.size*0.7,0,Math.PI*2);
          ctx.fillStyle=f.color; ctx.globalAlpha=Math.min(alpha*2,1); ctx.fill();
          ctx.globalAlpha=1;
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — JUILLET
     Plage : mer + sable + parasol + transat + soleil
  ════════════════════════════════════════════════════════════ */
  function initJuillet() {
    var juillCards = _cards().map(function (card, ci) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var W = canvas.width, H = canvas.height;
      var cd = { canvas:canvas, ctx:canvas.getContext('2d'), W:W, H:H, ci:ci };
      _watchResize(card, canvas, function(nw,nh){ cd.W=nw; cd.H=nh; });
      return cd;
    });

    _sharedLoop(function (t) {
      juillCards.forEach(function (cd) {
        var ctx=cd.ctx, W=cd.W, H=cd.H;
        ctx.clearRect(0,0,W,H);
        /* Mer */
        var seaY=H*0.52;
        var seaG=ctx.createLinearGradient(0,seaY,0,H*0.75);
        seaG.addColorStop(0,'rgba(56,189,248,0.7)'); seaG.addColorStop(1,'rgba(14,165,233,0.85)');
        ctx.beginPath();
        for(var x=0;x<=W;x+=3){
          var y=seaY+Math.sin((x/W)*Math.PI*4+t*1.4)*3+Math.sin((x/W)*Math.PI*7-t)*0.8;
          x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.lineTo(W,H*0.75); ctx.lineTo(0,H*0.75); ctx.closePath(); ctx.fillStyle=seaG; ctx.fill();
        /* Sable */
        var sandG=ctx.createLinearGradient(0,H*0.72,0,H);
        sandG.addColorStop(0,'#fde68a'); sandG.addColorStop(1,'#fbbf24');
        ctx.fillStyle=sandG; ctx.fillRect(0,H*0.72,W,H-H*0.72);
        /* Soleil */
        var sx=W*0.82,sy=H*0.15,sr=Math.min(W,H)*0.09;
        var hl=ctx.createRadialGradient(sx,sy,sr,sx,sy,sr*3.5);
        hl.addColorStop(0,'rgba(253,186,116,0.3)'); hl.addColorStop(1,'rgba(253,186,116,0)');
        ctx.beginPath(); ctx.arc(sx,sy,sr*3.5,0,Math.PI*2); ctx.fillStyle=hl; ctx.fill();
        ctx.save(); ctx.translate(sx,sy); ctx.rotate(t*0.3);
        for(var ri=0;ri<10;ri++){
          var ra=(ri/10)*Math.PI*2;
          ctx.beginPath(); ctx.moveTo(Math.cos(ra)*(sr+2),Math.sin(ra)*(sr+2));
          ctx.lineTo(Math.cos(ra)*(sr+6+ri%2*3),Math.sin(ra)*(sr+6+ri%2*3));
          ctx.strokeStyle='rgba(253,186,116,0.7)'; ctx.lineWidth=ri%2===0?1.8:1; ctx.lineCap='round'; ctx.stroke();
        }
        ctx.restore();
        var sg2=ctx.createRadialGradient(sx-2,sy-2,0,sx,sy,sr);
        sg2.addColorStop(0,'rgba(254,240,138,0.95)'); sg2.addColorStop(1,'rgba(251,146,60,0.88)');
        ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fillStyle=sg2; ctx.fill();
        /* Parasol */
        var pax=W*0.30,pay=H*0.60;
        ctx.save(); ctx.translate(pax,pay);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(3,H*0.30);
        ctx.strokeStyle='#92400e'; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.stroke();
        var segs=['#ef4444','#ffffff','#3b82f6','#ffffff','#ef4444','#ffffff'];
        for(var s=0;s<6;s++){
          var a1=(s/6)*Math.PI,a2=((s+1)/6)*Math.PI;
          ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,W*0.13,a1+Math.PI,a2+Math.PI); ctx.closePath();
          ctx.fillStyle=segs[s]; ctx.globalAlpha=0.88; ctx.fill();
        }
        ctx.globalAlpha=1;
        ctx.beginPath(); ctx.arc(0,-W*0.13*0.95,W*0.013,0,Math.PI*2); ctx.fillStyle='#fbbf24'; ctx.fill();
        ctx.restore();
        /* Transat */
        var tx=W*0.55,ty=H*0.79;
        ctx.save(); ctx.translate(tx,ty);
        ctx.save(); ctx.rotate(-0.3);
        ctx.fillStyle='#d97706'; ctx.globalAlpha=0.88;
        ctx.beginPath(); ctx.roundRect(-W*0.055,-H*0.14,W*0.11,H*0.15,2); ctx.fill();
        ctx.strokeStyle='#92400e'; ctx.lineWidth=0.7;
        [-0.35,-0.1,0.15].forEach(function(fr){ ctx.beginPath(); ctx.moveTo(-W*0.055,fr*H*0.14-H*0.07); ctx.lineTo(W*0.055,fr*H*0.14-H*0.07); ctx.stroke(); });
        ctx.restore();
        ctx.fillStyle='#f59e0b';
        ctx.beginPath(); ctx.roundRect(-W*0.058,0,W*0.116,H*0.08,2); ctx.fill();
        ctx.globalAlpha=1;
        ctx.restore();
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — AOÛT
     Poissons naturels dans l'océan
  ════════════════════════════════════════════════════════════ */
  function initAout() {
    var fishSpecies = [
      { c1:'#f97316', c2:'#7c2d12' },
      { c1:'#60a5fa', c2:'#1e3a8a' },
      { c1:'#fbbf24', c2:'#92400e' },
      { c1:'#34d399', c2:'#065f46' },
      { c1:'#e879f9', c2:'#701a75' },
    ];

    function drawFish(ctx, fx, fy, size, dir, c1, c2, t, phase) {
      ctx.save(); ctx.translate(fx,fy); if(dir<0) ctx.scale(-1,1);
      var bw = Math.sin(t*2.8+phase)*size*0.08;
      /* Queue */
      ctx.beginPath();
      ctx.moveTo(-size*0.5,bw*0.3);
      ctx.bezierCurveTo(-size*0.65,-size*0.4,-size*0.92,-size*0.35,-size,-size*0.16);
      ctx.lineTo(-size,size*0.16);
      ctx.bezierCurveTo(-size*0.92,size*0.35,-size*0.65,size*0.4,-size*0.5,bw*0.3);
      ctx.closePath();
      var tg=ctx.createLinearGradient(-size,0,-size*0.5,0);
      tg.addColorStop(0,c2+'88'); tg.addColorStop(1,c1); ctx.fillStyle=tg; ctx.fill();
      /* Corps */
      ctx.beginPath();
      ctx.moveTo(size*0.65,bw*0.2);
      ctx.bezierCurveTo(size*0.6,-size*0.32,-size*0.3,-size*0.38,-size*0.52,bw*0.3);
      ctx.bezierCurveTo(-size*0.3,size*0.38,size*0.6,size*0.32,size*0.65,bw*0.2);
      var bg=ctx.createLinearGradient(size*0.65,-size*0.35,size*0.65,size*0.35);
      bg.addColorStop(0,c2); bg.addColorStop(0.35,c1); bg.addColorStop(1,c2);
      ctx.fillStyle=bg; ctx.fill();
      /* Ventre */
      ctx.beginPath();
      ctx.moveTo(size*0.5,bw*0.1);
      ctx.bezierCurveTo(size*0.4,size*0.18,-size*0.2,size*0.22,-size*0.45,bw*0.25);
      ctx.bezierCurveTo(-size*0.2,size*0.1,size*0.4,size*0.08,size*0.5,bw*0.1);
      ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fill();
      /* Nageoire dorsale */
      ctx.beginPath();
      ctx.moveTo(size*0.1,-size*0.33+bw*0.2);
      ctx.bezierCurveTo(size*0.05,-size*0.6,-size*0.1,-size*0.62,-size*0.22,-size*0.35+bw*0.2);
      ctx.bezierCurveTo(-size*0.05,-size*0.38+bw*0.2,size*0.05,-size*0.36+bw*0.2,size*0.1,-size*0.33+bw*0.2);
      ctx.fillStyle=c2+'aa'; ctx.fill();
      /* Œil */
      ctx.beginPath(); ctx.arc(size*0.45,-size*0.06+bw*0.1,size*0.1,0,Math.PI*2);
      ctx.fillStyle='rgba(20,20,20,0.85)'; ctx.fill();
      ctx.beginPath(); ctx.arc(size*0.47,-size*0.09+bw*0.1,size*0.033,0,Math.PI*2);
      ctx.fillStyle='white'; ctx.fill();
      ctx.restore();
    }

    var aoutCards = _cards().map(function (card, ci) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var W=canvas.width, H=canvas.height;
      var fishes = Array.from({length:6}, function(_,i){ return {
        x:rand(0,W), y:rand(H*0.08,H*0.82),
        vx:(.22+rand(0,.28))*(Math.random()<.5?1:-1),
        sp:fishSpecies[(ci*3+i)%fishSpecies.length],
        size:7+rand(0,9), phase:rand(0,Math.PI*2),
        bobAmp:rand(1,3), bobFreq:.5+rand(0,.8), bobPh:rand(0,Math.PI*2),
      }; });
      var algae = Array.from({length:6},function(_,i){ return {
        x:(i/5)*W+rand(-10,10), h:H*.18+rand(0,H*.12), ph:rand(0,Math.PI*2)
      }; });
      var bubbles = Array.from({length:10},function(){ return {
        x:rand(0,W),y:rand(0,H),r:0.8+rand(0,2.5),sp:.18+rand(0,.35),ph:rand(0,Math.PI*2)
      }; });
      var cd={canvas:canvas,ctx:canvas.getContext('2d'),W:W,H:H,fishes:fishes,algae:algae,bubbles:bubbles};
      _watchResize(card,canvas,function(nw,nh){cd.W=nw;cd.H=nh;});
      return cd;
    });

    _sharedLoop(function(t){
      aoutCards.forEach(function(cd){
        var ctx=cd.ctx,W=cd.W,H=cd.H;
        ctx.clearRect(0,0,W,H);
        /* Fond sous-marin */
        var sea=ctx.createLinearGradient(0,0,0,H);
        sea.addColorStop(0,'rgba(12,74,110,0.55)'); sea.addColorStop(1,'rgba(3,105,161,0.75)');
        ctx.fillStyle=sea; ctx.fillRect(0,0,W,H);
        /* Rayon de lumière */
        var rayG=ctx.createLinearGradient(W*.5,0,W*.5,H*.65);
        rayG.addColorStop(0,'rgba(186,230,253,0.14)'); rayG.addColorStop(1,'rgba(186,230,253,0)');
        ctx.save(); ctx.translate(W*.5,0);
        ctx.beginPath(); ctx.moveTo(-35,0); ctx.lineTo(35,0); ctx.lineTo(16,H*.65); ctx.lineTo(-16,H*.65); ctx.closePath();
        ctx.fillStyle=rayG; ctx.fill(); ctx.restore();
        /* Sol sableux */
        var sand=ctx.createLinearGradient(0,H*.82,0,H);
        sand.addColorStop(0,'rgba(180,140,60,0.55)'); sand.addColorStop(1,'rgba(140,110,40,0.80)');
        ctx.fillStyle=sand; ctx.fillRect(0,H*.82,W,H*.18);
        /* Algues */
        cd.algae.forEach(function(a){
          var sw=Math.sin(t*1.2+a.ph)*3;
          ctx.beginPath(); ctx.moveTo(a.x,H*.82);
          ctx.bezierCurveTo(a.x+sw,H*.82-a.h*.35,a.x-sw*1.2,H*.82-a.h*.65,a.x+sw*.5,H*.82-a.h);
          ctx.strokeStyle='rgba(16,185,129,0.65)'; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.stroke();
        });
        /* Bulles */
        cd.bubbles.forEach(function(b){
          b.y-=b.sp; b.x+=Math.sin(t*1.2+b.ph)*0.35;
          if(b.y<-8){b.y=H*.85;b.x=rand(0,W);}
          ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
          ctx.strokeStyle='rgba(186,230,253,0.5)'; ctx.lineWidth=0.6; ctx.stroke();
          ctx.fillStyle='rgba(186,230,253,0.1)'; ctx.fill();
        });
        /* Poissons */
        cd.fishes.forEach(function(f){
          f.x+=f.vx;
          f.y+=Math.sin(t*f.bobFreq+f.bobPh)*f.bobAmp*0.04;
          if(f.x>W+30){f.x=-30;f.y=rand(H*.08,H*.8);}
          if(f.x<-30){f.x=W+30;f.y=rand(H*.08,H*.8);}
          ctx.globalAlpha=0.9;
          drawFish(ctx,f.x,f.y,f.size,f.vx>0?1:-1,f.sp.c1,f.sp.c2,t,f.phase);
        });
        ctx.globalAlpha=1;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — SEPTEMBRE
     Fournitures scolaires flottantes
  ════════════════════════════════════════════════════════════ */
  function initSeptembre() {
    var coverColors = [
      ['#3b82f6','#ef4444','#22c55e','#a855f7'],
      ['#f59e0b','#06b6d4','#ec4899','#14b8a6'],
      ['#6366f1','#f97316','#10b981','#f43f5e'],
    ];

    function drawNotebook(ctx,cx,cy,w,h,angle,color){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
      ctx.fillStyle=color;ctx.globalAlpha=0.82;
      ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,2);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=0.8;
      for(var li=-h/2+5;li<h/2;li+=4){ctx.beginPath();ctx.moveTo(-w/2+4,li);ctx.lineTo(w/2-2,li);ctx.stroke();}
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fillRect(-w/2,-h/2,4,h);
      ctx.globalAlpha=1;ctx.restore();
    }
    function drawPencil(ctx,cx,cy,len,angle,color){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
      ctx.fillStyle=color;ctx.globalAlpha=0.85;ctx.fillRect(-2,-len/2,4,len*0.85);
      ctx.fillStyle='#f8fafc';ctx.fillRect(-2,-len/2,4,len*0.18);
      ctx.fillStyle='#f97316';ctx.beginPath();ctx.moveTo(-2,len*0.35);ctx.lineTo(2,len*0.35);ctx.lineTo(0,len/2);ctx.closePath();ctx.fill();
      ctx.globalAlpha=1;ctx.restore();
    }
    function drawRuler(ctx,cx,cy,len,angle){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
      ctx.fillStyle='rgba(254,240,138,0.85)';ctx.globalAlpha=0.9;
      ctx.beginPath();ctx.roundRect(-len/2,-5,len,10,2);ctx.fill();
      ctx.strokeStyle='rgba(180,140,0,0.5)';ctx.lineWidth=0.6;
      for(var ti=0;ti<=10;ti++){var tx2=-len/2+ti*(len/10);ctx.beginPath();ctx.moveTo(tx2,ti%5===0?-4:-2);ctx.lineTo(tx2,4);ctx.stroke();}
      ctx.globalAlpha=1;ctx.restore();
    }
    function drawStar(ctx,cx,cy,r,angle,alpha){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);ctx.globalAlpha=alpha;
      ctx.fillStyle='#fbbf24';ctx.beginPath();
      for(var si=0;si<5;si++){var sa=(si/5)*Math.PI*2-Math.PI/2,sa2=((si+.5)/5)*Math.PI*2-Math.PI/2;ctx.lineTo(Math.cos(sa)*r,Math.sin(sa)*r);ctx.lineTo(Math.cos(sa2)*r*.42,Math.sin(sa2)*r*.42);}
      ctx.closePath();ctx.fill();ctx.globalAlpha=1;ctx.restore();
    }

    var septCards = _cards().map(function(card,ci){
      var canvas=_cv(card);fitCanvas(canvas,card);
      var W=canvas.width,H=canvas.height;
      var colors=coverColors[ci%coverColors.length];
      var objects=[
        {type:'notebook',x:rand(W*.08,W*.35),y:rand(H*.2,H*.6),w:28,h:20,angle:rand(-.45,.45),color:colors[0],phase:rand(0,Math.PI*2),amp:rand(3,6)},
        {type:'notebook',x:rand(W*.5,W*.88),y:rand(H*.15,H*.55),w:24,h:18,angle:rand(-.5,.5),color:colors[1],phase:rand(0,Math.PI*2),amp:rand(3,6)},
        {type:'pencil', x:rand(W*.15,W*.45),y:rand(H*.3,H*.7),len:32,angle:rand(-.8,.8),color:colors[2],phase:rand(0,Math.PI*2),amp:rand(4,7)},
        {type:'pencil', x:rand(W*.55,W*.9), y:rand(H*.25,H*.65),len:28,angle:rand(-.9,.9),color:colors[3],phase:rand(0,Math.PI*2),amp:rand(3,6)},
        {type:'ruler',  x:rand(W*.2,W*.7),  y:rand(H*.4,H*.75),len:55,angle:rand(-.3,.3),phase:rand(0,Math.PI*2),amp:rand(2,5)},
        {type:'star',   x:rand(W*.05,W*.25),y:rand(H*.1,H*.45),r:rand(5,9),angle:0,alpha:rand(.6,.9),phase:rand(0,Math.PI*2),amp:rand(3,5),rotSpd:.012},
        {type:'star',   x:rand(W*.7,W*.96), y:rand(H*.15,H*.5),r:rand(4,7),angle:0,alpha:rand(.5,.8),phase:rand(0,Math.PI*2),amp:rand(2,5),rotSpd:.016},
      ];
      var cd={canvas:canvas,ctx:canvas.getContext('2d'),W:W,H:H,objects:objects};
      _watchResize(card,canvas,function(nw,nh){cd.W=nw;cd.H=nh;});
      return cd;
    });

    _sharedLoop(function(t){
      septCards.forEach(function(cd){
        var ctx=cd.ctx,W=cd.W,H=cd.H;
        ctx.clearRect(0,0,W,H);
        cd.objects.forEach(function(o){
          var fx=o.x+Math.sin(t*0.6+o.phase)*o.amp;
          var fy=o.y+Math.cos(t*0.5+o.phase)*(o.amp||4)*0.6;
          ctx.globalAlpha=0.88;
          if(o.type==='notebook') drawNotebook(ctx,fx,fy,o.w,o.h,o.angle,o.color);
          if(o.type==='pencil')   drawPencil(ctx,fx,fy,o.len,o.angle,o.color);
          if(o.type==='ruler')    drawRuler(ctx,fx,fy,o.len,o.angle);
          if(o.type==='star'){o.angle+=o.rotSpd; drawStar(ctx,fx,fy,o.r,o.angle,o.alpha);}
          ctx.globalAlpha=1;
        });
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — OCTOBRE
     Feuilles d'automne + citrouille
  ════════════════════════════════════════════════════════════ */
  function initOctobre() {
    var leafCols = ['#ea580c','#dc2626','#d97706','#b45309','#c2410c'];

    function drawLeaf(ctx,lx,ly,size,rot,color,alpha){
      ctx.save();ctx.translate(lx,ly);ctx.rotate(rot);
      ctx.fillStyle=color;ctx.globalAlpha=alpha;
      ctx.beginPath();ctx.moveTo(0,size);
      ctx.bezierCurveTo(size*.8,size*.4,size*.8,-size*.4,0,-size);
      ctx.bezierCurveTo(-size*.8,-size*.4,-size*.8,size*.4,0,size);
      ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,0.1)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(0,size);ctx.stroke();
      ctx.globalAlpha=1;ctx.restore();
    }
    function drawPumpkin(ctx,px,py,size){
      var segs=['#f97316','#fb923c','#f97316'];
      for(var s=0;s<3;s++){
        ctx.beginPath();ctx.ellipse(px+(s-1)*size*.7,py,size*.55,size*.65,0,0,Math.PI*2);
        ctx.fillStyle=segs[s];ctx.globalAlpha=0.88;ctx.fill();
      }
      ctx.beginPath();ctx.rect(px-2,py-size*.7,4,size*.28);
      ctx.fillStyle='#92400e';ctx.globalAlpha=1;ctx.fill();
      ctx.beginPath();ctx.arc(px,py,size*.28,Math.PI,Math.PI*2);
      ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fill();
    }

    var octCards = _cards().map(function(card,ci){
      var canvas=_cv(card);fitCanvas(canvas,card);
      var W=canvas.width,H=canvas.height;
      var leaves=Array.from({length:15},function(){return{
        x:rand(0,W),y:rand(-H,H*.5),size:rand(6,12),
        vx:rand(-.5,.6),vy:rand(.3,.95),rot:rand(0,Math.PI*2),
        rotSpd:rand(-.03,.03),color:leafCols[Math.floor(Math.random()*leafCols.length)],
        alpha:rand(.6,.9),sway:rand(.5,1.2),phase:rand(0,Math.PI*2),
      };});
      var pumps=[{x:W-26,y:H-18,size:Math.min(16+ci*2,22)},{x:20,y:H-12,size:11}];
      var cd={canvas:canvas,ctx:canvas.getContext('2d'),W:W,H:H,leaves:leaves,pumps:pumps};
      _watchResize(card,canvas,function(nw,nh){cd.W=nw;cd.H=nh;});
      return cd;
    });

    _sharedLoop(function(t){
      octCards.forEach(function(cd){
        var ctx=cd.ctx,W=cd.W,H=cd.H;
        ctx.clearRect(0,0,W,H);
        cd.leaves.forEach(function(l){
          l.y+=l.vy;l.x+=l.vx+Math.sin(t*l.sway+l.phase)*.45;l.rot+=l.rotSpd;
          if(l.y>H+14){l.y=rand(-20,-4);l.x=rand(0,W);}
          if(l.x<-14)l.x=W+14; if(l.x>W+14)l.x=-14;
          drawLeaf(ctx,l.x,l.y,l.size,l.rot,l.color,l.alpha);
        });
        cd.pumps.forEach(function(p){
          var glow=.6+Math.sin(t*2.2+p.x)*.4;
          ctx.shadowColor='rgba(251,146,60,'+(glow*.5)+')';ctx.shadowBlur=10*glow;
          drawPumpkin(ctx,p.x,p.y,p.size);
        });
        ctx.shadowBlur=0;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ANIMATIONS CARTES — NOVEMBRE
     Arbres dépouillés + brume + écureuil
  ════════════════════════════════════════════════════════════ */
  function initNovembre() {
    function drawBareTree(ctx,tx,ty,h,spread,alpha){
      ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=isDark()?'#6b7280':'#4b5563';
      ctx.lineWidth=2.2;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx,ty-h);ctx.stroke();
      for(var b=0;b<5;b++){
        var by=ty-h*(.35+b*.13),bl=10+b*4,sd=b%2===0?-1:1;
        ctx.beginPath();ctx.moveTo(tx,by);ctx.lineTo(tx+sd*bl*spread,by-bl*.55);
        ctx.lineWidth=1;ctx.stroke();
        if(b<3){
          ctx.beginPath();ctx.moveTo(tx+sd*bl*spread*.6,by-bl*.35);
          ctx.lineTo(tx+sd*(bl*spread*.6+bl*.5),by-bl*.55);
          ctx.lineWidth=0.6;ctx.stroke();
        }
      }
      ctx.restore();
    }

    var novCards = _cards().map(function(card,ci){
      var canvas=_cv(card);fitCanvas(canvas,card);
      var W=canvas.width,H=canvas.height;
      var trees=[
        {x:W*.06,h:H*.75,spread:1.1,alpha:isDark()?.65:.5},
        {x:W*.92,h:H*.65,spread:1.0,alpha:isDark()?.6:.45},
        {x:W*.22,h:H*.5, spread:.9, alpha:isDark()?.45:.3},
        {x:W*.78,h:H*.45,spread:.9, alpha:isDark()?.4:.28},
      ];
      var mistLayers=Array.from({length:5},function(_,i){return{
        y:H*(.58+i*.1),w:W*(1.15+i*.2),speed:.006+i*.003,phase:i*Math.PI/2.5,alpha:.05+i*.022,
      };});
      var squirrel={x:W*.3,vx:.18,dir:1};
      var cd={canvas:canvas,ctx:canvas.getContext('2d'),W:W,H:H,trees:trees,mistLayers:mistLayers,squirrel:squirrel};
      _watchResize(card,canvas,function(nw,nh){cd.W=nw;cd.H=nh;});
      return cd;
    });

    _sharedLoop(function(t){
      novCards.forEach(function(cd){
        var ctx=cd.ctx,W=cd.W,H=cd.H;
        ctx.clearRect(0,0,W,H);
        /* Arbres */
        cd.trees.forEach(function(tr){drawBareTree(ctx,tr.x,H,tr.h,tr.spread,tr.alpha);});
        /* Sol */
        var gg=ctx.createLinearGradient(0,H-8,0,H);
        gg.addColorStop(0,isDark()?'rgba(120,60,20,0.55)':'rgba(120,60,20,0.28)');
        gg.addColorStop(1,isDark()?'rgba(80,40,15,0.75)':'rgba(80,40,15,0.42)');
        ctx.fillStyle=gg;ctx.fillRect(0,H-8,W,8);
        /* Brume */
        cd.mistLayers.forEach(function(m){
          var ox=Math.sin(t*m.speed*10+m.phase)*18,oy=Math.sin(t*m.speed*8+m.phase)*3;
          var mg=ctx.createRadialGradient(W/2+ox,m.y+oy,0,W/2+ox,m.y+oy,m.w*.5);
          var a=m.alpha*(0.65+Math.sin(t*1.2+m.phase)*.35)*(isDark()?1.8:1);
          mg.addColorStop(0,'rgba(209,213,219,'+a+')');
          mg.addColorStop(.6,'rgba(209,213,219,'+(a*.4)+')');
          mg.addColorStop(1,'rgba(209,213,219,0)');
          ctx.beginPath();ctx.ellipse(W/2+ox,m.y+oy,m.w*.5,12+m.phase*3,0,0,Math.PI*2);
          ctx.fillStyle=mg;ctx.fill();
        });
        /* Écureuil */
        var sq=cd.squirrel;
        sq.x+=sq.vx*sq.dir;
        if(sq.x>W-12)sq.dir=-1; if(sq.x<12)sq.dir=1;
        var sqB=Math.abs(Math.sin(t*4))*2.5;
        ctx.fillStyle=isDark()?'#a78bfa':'#9ca3af';ctx.globalAlpha=0.82;
        ctx.beginPath();ctx.ellipse(sq.x,H-9-sqB,5,4,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(sq.x+(sq.dir>0?4:-4),H-14-sqB,3,0,Math.PI*2);ctx.fill();
        /* Queue en courbe */
        ctx.beginPath();ctx.moveTo(sq.x+(sq.dir>0?-3:3),H-10-sqB);
        ctx.bezierCurveTo(sq.x+(sq.dir>0?-8:8),H-18-sqB,sq.x+(sq.dir>0?-12:12),H-14-sqB,sq.x+(sq.dir>0?-8:8),H-8-sqB);
        ctx.strokeStyle=isDark()?'#a78bfa':'#9ca3af';ctx.lineWidth=3;ctx.lineCap='round';ctx.stroke();
        ctx.globalAlpha=1;
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     DÉCEMBRE (placeholder neutre)
  ════════════════════════════════════════════════════════════ */
  function initDecembre() {
    /* Placeholder : fond bleu hivernal discret, flocons CSS simples */
    _cards().forEach(function (card) {
      var canvas = _cv(card); fitCanvas(canvas, card);
      var ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(219,234,254,0.15)'); g.addColorStop(1, 'rgba(186,230,252,0.22)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
  }

  /* ════════════════════════════════════════════════════════════
     ORCHESTRATION
  ════════════════════════════════════════════════════════════ */
  var _MONTHS = [
    'janvier','fevrier','mars','avril','mai','juin',
    'juillet','aout','septembre','octobre','novembre','decembre'
  ];
  var _INITS = [
    initJanvier, initFevrier, initMars,     initAvril,
    initMai,     initJuin,    initJuillet,  initAout,
    initSeptembre, initOctobre, initNovembre, initDecembre
  ];

  function _apply() {
    var m = new Date().getMonth();
    if (m === _month) return;
    _month = m;
    _runRetries = 0;
    _stopAll();
    var body = document.body;
    _MONTHS.forEach(function (mn) { body.classList.remove('season-' + mn); });
    body.classList.add('season-' + _MONTHS[m]);
    renderBackground(_MONTHS[m]);
    setTimeout(_runCards, 150);
  }

  var _runRetries = 0;
  function _runCards() {
    var cards = _cards();
    if (!cards.length) {
      _runRetries++;
      if (_runRetries < 50) setTimeout(_runCards, 200);
      return;
    }
    _runRetries = 0;
    _INITS[_month]();
  }

  /* Observer pour les nouvelles cartes / changements d'écran */
  var _cObs = new MutationObserver(function (mutations) {
    var found = false;
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if ((n.matches && n.matches('.niveau-card,.theme-check,.notion-card,.screen')) ||
            (n.querySelector && n.querySelector('.niveau-card,.theme-check,.notion-card')))
          found = true;
      });
      if (m.type === 'attributes' && m.target.classList &&
          m.target.classList.contains('screen') &&
          m.target.classList.contains('active'))
        found = true;
    });
    if (found) setTimeout(_runCards, 120);
  });

  /* Observer changement de thème dark/light */
  var _tObs = new MutationObserver(function () { _month = -1; _apply(); });

  function _init() {
    _cObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    _tObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    _apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})();
