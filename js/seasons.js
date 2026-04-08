/* ══════════════════════════════════════════════════════════════
   seasons.js — Effets saisonniers MathPratik v3.0
   Autonome · Zéro dépendance · Zéro ID fixe
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── État ── */
  var _af    = [];
  var _cl    = [];
  var _month = -1;
  var _wcMap = new WeakMap();

  /* ── Utilitaires ── */
  function rand(min,max){ return min+Math.random()*(max-min); }
  function hexRgba(hex,alpha){
    var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return 'rgba('+r+','+g+','+b+','+(alpha===undefined?1:alpha)+')';
  }
  function isDark(){ return document.documentElement.getAttribute('data-theme')==='dark'; }

  function fitCanvas(cv,card){
    cv.width =card.offsetWidth ||card.getBoundingClientRect().width ||280;
    cv.height=card.offsetHeight||card.getBoundingClientRect().height||88;
  }

  /* Canvas injecté dans une carte */
  function _cv(card){
    if(_wcMap.has(card)) return _wcMap.get(card);
    if(getComputedStyle(card).position==='static') card.style.position='relative';
    card.style.overflow='hidden';
    var cv=document.createElement('canvas');
    cv.className='mp-cv';
    cv.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:2;border-radius:inherit;';
    cv.width=card.offsetWidth||280; cv.height=card.offsetHeight||88;
    card.insertBefore(cv,card.firstChild);
    _wcMap.set(card,cv);
    return cv;
  }

  /* Cartes visibles dans le DOM */
  function _cards(){
    return Array.from(document.querySelectorAll('.niveau-card,.theme-check,.notion-card'))
      .filter(function(c){ return c.offsetWidth>0; });
  }

  /* Fond de page */
  function _bgLayer(){
    var el=document.getElementById('mp-bg');
    if(!el){
      el=document.createElement('div');
      el.id='mp-bg';
      el.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
      document.body.insertBefore(el,document.body.firstChild);
    }
    return el;
  }

  /* Arrêt de toutes les animations */
  function _stopAll(){
    _af.forEach(function(id){cancelAnimationFrame(id);}); _af=[];
    _cl.forEach(function(fn){fn();}); _cl=[];
    document.querySelectorAll('.mp-cv').forEach(function(cv){
      try{cv.getContext('2d').clearRect(0,0,cv.width,cv.height);}catch(e){}
      cv.remove();
    });
    document.querySelectorAll('.mp-wave').forEach(function(el){el.remove();});
    _wcMap=new WeakMap();
  }

function renderBackground(season) {
  var layer=_bgLayer(); layer.innerHTML='';
  const dark = isDark();

  /* ── JANVIER : particules de glace en fond ── */
  if (season === 'janvier') {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    layer.appendChild(canvas);
    const fitBg = () => { canvas.width = layer.offsetWidth; canvas.height = layer.offsetHeight; };
    fitBg();
    window.addEventListener('resize', fitBg);
    const ctx = canvas.getContext('2d');
    /* Flocons de fond très lents */
    const bgFlakes = Array.from({length:35}, () => ({
      x: Math.random()*100, y: Math.random()*100,
      r: 1 + Math.random()*3, speed: 0.008 + Math.random()*0.018,
      drift: (Math.random()-0.5)*0.006, opacity: 0.2+Math.random()*0.4,
    }));
    let bgRunning = true;
    _cl.push(() => { bgRunning = false; });
    (function bgLoop() {
      if (!bgRunning) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      bgFlakes.forEach(f => {
        f.y += f.speed; f.x += f.drift;
        if (f.y > 100) { f.y = -2; f.x = Math.random()*100; }
        ctx.beginPath();
        ctx.arc(f.x/100*W, f.y/100*H, f.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(219,234,254,${f.opacity})`;
        ctx.fill();
      });
      _af.push(requestAnimationFrame(bgLoop));
    })();
  }

  /* ── FÉVRIER : petits cœurs flottants en fond ── */
  if (season === 'fevrier') {
    let svg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    const heartColors = ['rgba(251,182,206,0.4)','rgba(249,168,212,0.35)','rgba(252,165,165,0.3)','rgba(253,164,175,0.35)'];
    for (let i = 0; i < 18; i++) {
      const x = rand(5,90), y = rand(15,85), s = rand(6,14);
      const dur = rand(8,16), delay = rand(0,10);
      const col = heartColors[Math.floor(Math.random()*heartColors.length)];
      /* Cœur SVG path normalisé */
      svg += `<path transform="translate(${x}%, ${y}%) scale(${s/20})"
        d="M0,-8 C0,-14 -10,-14 -10,-8 C-10,-2 0,6 0,10 C0,6 10,-2 10,-8 C10,-14 0,-14 0,-8 Z"
        fill="${col}"
        style="animation: pollen-float ${dur}s ${delay}s ease-in-out infinite; --dx:${rand(-30,30)}px; --dy:${rand(-80,-30)}px;"/>`;
    }
    svg += `</svg>`;
    layer.innerHTML = svg;
  }

  /* ── AVRIL : nuages animés + légère pluie de fond ── */
  if (season === 'avril') {
    layer.innerHTML = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur-cloud"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <!-- Nuages gris doux -->
      <g class="cloud" style="transform-origin:22% 12%;">
        <ellipse cx="14%" cy="11%" rx="70" ry="26" fill="rgba(203,213,225,0.65)" filter="url(#blur-cloud)"/>
        <ellipse cx="20%" cy="9%"  rx="50" ry="22" fill="rgba(226,232,240,0.7)"  filter="url(#blur-cloud)"/>
        <ellipse cx="28%" cy="12%" rx="60" ry="24" fill="rgba(203,213,225,0.6)"  filter="url(#blur-cloud)"/>
      </g>
      <g class="cloud-2" style="transform-origin:65% 18%;">
        <ellipse cx="58%" cy="17%" rx="80" ry="22" fill="rgba(148,163,184,0.5)" filter="url(#blur-cloud)"/>
        <ellipse cx="65%" cy="15%" rx="55" ry="20" fill="rgba(203,213,225,0.6)" filter="url(#blur-cloud)"/>
        <ellipse cx="73%" cy="18%" rx="65" ry="22" fill="rgba(148,163,184,0.45)" filter="url(#blur-cloud)"/>
      </g>
      <!-- Éclaircie lumineuse -->
      <ellipse cx="45%" cy="0%" rx="150" ry="80" fill="rgba(255,255,255,0.25)"/>
      <!-- Pluie fine fond -->
      ${Array.from({length:40},(_,i)=>{
        const x=rand(2,98), dur=rand(0.6,1.2), delay=rand(-2,0), h=rand(8,18);
        return `<line x1="${x}%" y1="0%" x2="${x-1}%" y2="${h}%"
          stroke="rgba(148,163,184,0.3)" stroke-width="0.5"
          style="animation: bg-rain-line ${dur}s ${delay}s linear infinite;"/>`;
      }).join('')}
    </svg>`;
    /* Keyframe pluie fond */
    if (!document.getElementById('rain-bg-kf')) {
      const s = document.createElement('style'); s.id='rain-bg-kf';
      s.textContent = `@keyframes bg-rain-line { from{transform:translateY(-5%);opacity:0} 10%{opacity:1} 90%{opacity:0.6} to{transform:translateY(110%);opacity:0} }`;
      document.head.appendChild(s);
    }
  }

  /* ── MAI : pétales en fond ── */
  if (season === 'mai') {
    /* Fond : quelques papillons légers qui dérivent en arrière-plan */
    let svg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    /* Taches lumineuses douces */
    const bgColors=['rgba(254,240,138,0.25)','rgba(187,247,208,0.2)','rgba(216,180,254,0.18)','rgba(253,186,116,0.2)'];
    for (let i=0;i<12;i++) {
      const x=rand(5,90),y=rand(10,85),r=rand(25,60);
      const col=bgColors[i%bgColors.length];
      const dur=rand(8,16),delay=rand(0,10);
      const dx=rand(-40,40),dy=rand(-60,60);
      svg+=`<circle cx="${x}%" cy="${y}%" r="${r}" fill="${col}"
        style="--dx:${dx}px;--dy:${dy}px;
        animation:pollen-float ${dur}s ${delay}s ease-in-out infinite;"/>`;
    }
    svg+=`</svg>`;
    layer.innerHTML=svg;
  }

  /* ── JUIN : lueurs dorées et lucioles fond ── */
  if (season === 'juin') {
    const canvas=document.createElement('canvas');
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;';
    layer.appendChild(canvas);
    const fitBg=()=>{canvas.width=layer.offsetWidth;canvas.height=layer.offsetHeight;};
    fitBg(); window.addEventListener('resize',fitBg);
    const ctx=canvas.getContext('2d');
    const fireflies=Array.from({length:28},()=>({
      x:rand(5,95),y:rand(20,90),
      dx:rand(-0.015,0.015),dy:rand(-0.01,0.01),
      phase:rand(0,Math.PI*2),freq:rand(0.8,2.2),
      size:rand(1.2,2.8),color:Math.random()<0.6?'#fde047':'#bbf7d0',
    }));
    let bgR=true; _cl.push(()=>{bgR=false;});
    let bt=0;
    (function bl(){
      if(!bgR)return; bt+=0.016;
      const W=canvas.width,H=canvas.height;
      ctx.clearRect(0,0,W,H);
      fireflies.forEach(f=>{
        f.x+=f.dx; f.y+=f.dy;
        if(f.x<0)f.x=100; if(f.x>100)f.x=0;
        if(f.y<0)f.y=100; if(f.y>100)f.y=0;
        const alpha=(Math.sin(bt*f.freq+f.phase)+1)*0.5*0.55+0.05;
        const glow=ctx.createRadialGradient(f.x/100*W,f.y/100*H,0,f.x/100*W,f.y/100*H,f.size*4);
        glow.addColorStop(0, hexRgba(f.color, alpha*0.8));
        glow.addColorStop(1,'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(f.x/100*W,f.y/100*H,f.size*4,0,Math.PI*2);
        ctx.fillStyle=glow; ctx.fill();
        ctx.beginPath();
        ctx.arc(f.x/100*W,f.y/100*H,f.size*0.8,0,Math.PI*2);
        ctx.fillStyle=f.color; ctx.globalAlpha=alpha*1.5; ctx.fill();
        ctx.globalAlpha=1;
      });
      _af.push(requestAnimationFrame(bl));
    })();
  }

  /* ── JUILLET : soleil fort + halo de chaleur fond ── */
  if (season === 'juillet') {
    layer.innerHTML=`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle cx="82%" cy="8%" r="110" fill="rgba(251,146,60,0.12)"/>
      <circle cx="82%" cy="8%" r="75"  fill="rgba(253,186,116,0.18)"/>
      <g style="transform-origin:82% 8%;animation:ray-rotate 18s linear infinite;">
        ${Array.from({length:20},(_,i)=>{
          const a=(i/20)*360*Math.PI/180,r1=60,r2=95;
          const op=i%2===0?0.3:0.15,w=i%2===0?2:1.2;
          return `<line x1="calc(82% + ${(Math.cos(a)*r1).toFixed(1)}px)" y1="calc(8% + ${(Math.sin(a)*r1).toFixed(1)}px)"
                        x2="calc(82% + ${(Math.cos(a)*r2).toFixed(1)}px)" y2="calc(8% + ${(Math.sin(a)*r2).toFixed(1)}px)"
                        stroke="rgba(251,146,60,${op})" stroke-width="${w}" stroke-linecap="round"/>`;
        }).join('')}
      </g>
      <circle cx="82%" cy="8%" r="42" fill="rgba(253,186,116,0.6)"/>
      <circle cx="82%" cy="8%" r="28" fill="rgba(254,215,170,0.85)"/>
      <ellipse cx="50%" cy="95%" rx="200" ry="40" fill="rgba(251,146,60,0.1)"/>
    </svg>`;
  }

  /* ── SEPTEMBRE : feuilles fond ── */
  if (season === 'septembre') {
    let svg=`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    /* Petites étoiles dorées et bulles colorées — ambiance rentrée */
    const rentrColors=['rgba(59,130,246,0.2)','rgba(239,68,68,0.18)','rgba(34,197,94,0.18)','rgba(168,85,247,0.18)','rgba(234,179,8,0.25)'];
    for(let i=0;i<20;i++){
      const x=rand(3,95),y=rand(5,90),r=rand(12,35);
      const col=rentrColors[i%rentrColors.length];
      const dur=rand(8,16),delay=rand(0,10),dx=rand(-30,30),dy=rand(-40,40);
      svg+=`<circle cx="${x}%" cy="${y}%" r="${r}" fill="${col}"
        style="--dx:${dx}px;--dy:${dy}px;animation:pollen-float ${dur}s ${delay}s ease-in-out infinite;"/>`;
    }
    svg+=`</svg>`; layer.innerHTML=svg;
  }

  /* ── OCTOBRE : brouillard orangé fond ── */
  if (season === 'octobre') {
    layer.innerHTML=`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="blur4"><feGaussianBlur stdDeviation="12"/></filter></defs>
      <ellipse cx="15%" cy="25%" rx="180" ry="120" fill="rgba(251,146,60,0.18)" filter="url(#blur4)"/>
      <ellipse cx="80%" cy="15%" rx="150" ry="100" fill="rgba(234,88,12,0.15)"  filter="url(#blur4)"/>
      <ellipse cx="50%" cy="80%" rx="200" ry="80"  fill="rgba(120,53,15,0.12)"  filter="url(#blur4)"/>
      ${Array.from({length:15},(_,i)=>{
        const x=rand(2,95),y=rand(10,80),s=rand(10,20),rot=rand(0,360);
        const col=['rgba(234,88,12,0.35)','rgba(251,146,60,0.4)','rgba(180,83,9,0.3)'][i%3];
        const dur=rand(10,18),delay=rand(0,10),dx=rand(20,80),dy=rand(60,140);
        return `<ellipse cx="${x}%" cy="${y}%" rx="${s}" ry="${s*0.6}" fill="${col}"
          transform="rotate(${rot})" style="--dx:${dx}px;--dy:${dy}px;
          animation:pollen-float ${dur}s ${delay}s ease-in-out infinite;"/>`;
      }).join('')}
    </svg>`;
  }

  /* ── NOVEMBRE : brume de forêt fond ── */
  if (season === 'novembre') {
    const canvas=document.createElement('canvas');
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;';
    layer.appendChild(canvas);
    const fitBg=()=>{canvas.width=layer.offsetWidth;canvas.height=layer.offsetHeight;};
    fitBg(); window.addEventListener('resize',fitBg);
    const ctx=canvas.getContext('2d');
    const mists=Array.from({length:6},(_,i)=>({
      y:60+i*7, speed:0.008+i*0.003, phase:i*Math.PI/3, alpha:0.06+i*0.015,
    }));
    let bgR=true; _cl.push(()=>{bgR=false;});
    let bt=0;
    (function bl(){
      if(!bgR)return; bt+=0.01;
      const W=canvas.width,H=canvas.height;
      ctx.clearRect(0,0,W,H);
      mists.forEach(m=>{
        const y=(m.y/100)*H+Math.sin(bt*m.speed*10+m.phase)*8;
        const g=ctx.createLinearGradient(0,y-30,0,y+30);
        g.addColorStop(0,'rgba(209,213,219,0)');
        g.addColorStop(0.5,`rgba(209,213,219,${m.alpha})`);
        g.addColorStop(1,'rgba(209,213,219,0)');
        ctx.fillStyle=g; ctx.fillRect(0,y-30,W,60);
      });
      _af.push(requestAnimationFrame(bl));
    })();
  }

  if (season === 'mars') {
    /* Quelques particules de pollen qui flottent */
    let svg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i < 22; i++) {
      const x = rand(5, 95), y = rand(10, 90);
      const size = rand(3, 7);
      const dur = rand(6, 14), delay = rand(0, 8);
      const dx = rand(-80, 80), dy = rand(-120, -40);
      svg += `<circle cx="${x}%" cy="${y}%" r="${size}" 
        fill="#fde68a" opacity="0.5"
        style="--dx:${dx}px;--dy:${dy}px;
               animation: pollen-float ${dur}s ${delay}s ease-in-out infinite;"/>`;
    }
    /* Petits pétales qui volent */
    for (let i = 0; i < 14; i++) {
      const x = rand(5,95), y = rand(20,80);
      const dur = rand(8,16), delay = rand(0,10);
      const dx = rand(60,160), dy = rand(40,120);
      const rot = rand(0,360);
      svg += `<ellipse cx="${x}%" cy="${y}%" rx="5" ry="3"
        fill="#f9a8d4" opacity="0.45"
        transform="rotate(${rot} 0 0)"
        style="--dx:${dx}px;--dy:${dy}px;
               animation: pollen-float ${dur}s ${delay}s ease-in-out infinite;"/>`;
    }
    svg += `</svg>`;
    layer.innerHTML = svg;
  }

  if (season === 'aout') {
    /* Grand soleil + nuages + reflets */
    layer.innerHTML = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <!-- Halo soleil -->
      <circle cx="88%" cy="9%" r="90" fill="rgba(253,224,71,0.15)"/>
      <circle cx="88%" cy="9%" r="60" fill="rgba(253,224,71,0.2)"/>
      <!-- Rayons -->
      <g style="transform-origin:88% 9%; animation:ray-rotate 22s linear infinite;">
        ${Array.from({length:16}, (_,i) => {
          const a = (i/16)*360;
          const r1=55, r2=85;
          const rad = a * Math.PI/180;
          const x1=Math.cos(rad)*r1, y1=Math.sin(rad)*r1;
          const x2=Math.cos(rad)*r2, y2=Math.sin(rad)*r2;
          const op = i%2===0 ? 0.35 : 0.2;
          const w  = i%2===0 ? 2.5  : 1.5;
          return `<line x1="calc(88% + ${x1}px)" y1="calc(9% + ${y1}px)" 
                        x2="calc(88% + ${x2}px)" y2="calc(9% + ${y2}px)"
                        stroke="rgba(253,224,71,${op})" stroke-width="${w}" stroke-linecap="round"/>`;
        }).join('')}
      </g>
      <!-- Soleil -->
      <circle class="sun-core" cx="88%" cy="9%" r="38" fill="rgba(253,224,71,0.55)"/>
      <circle cx="88%" cy="9%" r="28" fill="rgba(254,240,138,0.7)"/>
      <!-- Nuages -->
      <g class="cloud" style="transform-origin:25% 18%;">
        <ellipse cx="18%" cy="16%" rx="60" ry="22" fill="white" opacity="0.7"/>
        <ellipse cx="22%" cy="14%" rx="40" ry="18" fill="white" opacity="0.7"/>
        <ellipse cx="26%" cy="16%" rx="50" ry="20" fill="white" opacity="0.6"/>
      </g>
      <g class="cloud-2" style="transform-origin:55% 22%;">
        <ellipse cx="50%" cy="20%" rx="70" ry="18" fill="white" opacity="0.5"/>
        <ellipse cx="55%" cy="18%" rx="45" ry="16" fill="white" opacity="0.5"/>
        <ellipse cx="60%" cy="20%" rx="55" ry="17" fill="white" opacity="0.4"/>
      </g>
      <!-- Reflet soleil sur eau en bas -->
      <ellipse cx="88%" cy="95%" rx="120" ry="30" fill="rgba(253,224,71,0.12)"/>
    </svg>`;
  }

  if (season === 'decembre') {
    /* Flocons de fond qui tombent lentement */
    let svg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i < 30; i++) {
      const x = rand(2, 98);
      const size = rand(2, 5);
      const dur  = rand(12, 28);
      const delay = rand(-20, 0);
      var flakeColor = dark ? 'rgba(147,197,253,0.5)' : 'rgba(219,234,254,0.7)';
      svg += `<circle cx="${x}%" cy="0%" r="${size}" fill="${flakeColor}"
        class="bg-flake"
        style="animation-duration:${dur}s; animation-delay:${delay}s;"/>`;
    }
    /* Étoile en haut */
    svg += `<polygon points="90%,4% 91%,7% 94%,7% 92%,9% 93%,12% 90%,10% 87%,12% 88%,9% 86%,7% 89%,7%"
      fill="rgba(253,224,71,0.6)" style="animation:ray-pulse 2s ease-in-out infinite;"/>`;
    svg += `</svg>`;
    layer.innerHTML = svg;
  }
}


/* ══════════════════════════════════════════════════
   EFFET MARS — Herbe réaliste + Fleurs sur Canvas
   Chaque brin : forme fermée base-épaisse→pointe fine
   Couleurs graduées pied foncé → pointe claire
══════════════════════════════════════════════════ */

/* ── Un brin d'herbe réaliste dessiné sur canvas ──
   Forme : polygone fermé avec base large, pointe fine,
   légère courbe naturelle, dégradé vert foncé→clair   */
function drawGrassBlade(ctx, baseX, baseY, height, lean, baseWidth, phase, t) {
  /* Courbure dynamique : balancement au vent */
  const sway    = Math.sin(t * 1.8 + phase) * lean * 0.35;
  const tipX    = baseX + lean * height * 0.38 + sway * height * 0.012;
  const tipY    = baseY - height;
  /* Point de contrôle Bézier — courbe organique */
  const cpX     = baseX + lean * height * 0.22 + sway * height * 0.008;
  const cpY     = baseY - height * 0.58;
  /* Demi-largeur à la base, nulle à la pointe */
  const hw      = baseWidth * 0.5;
  /* Bord gauche et droit de la lame */
  const lbX = baseX - hw,  lbY = baseY;
  const rbX = baseX + hw,  rbY = baseY;
  /* Décalage latéral des points de contrôle */
  const lcpX = cpX - hw * 0.55, rcpX = cpX + hw * 0.55;

  /* Dégradé vertical base→pointe */
  const grad = ctx.createLinearGradient(baseX, baseY, tipX, tipY);
  grad.addColorStop(0,   '#15803d');   /* vert très foncé à la base */
  grad.addColorStop(0.35,'#16a34a');
  grad.addColorStop(0.65,'#4ade80');
  grad.addColorStop(1,   '#86efac');   /* vert pâle à la pointe */

  ctx.beginPath();
  ctx.moveTo(lbX, lbY);
  ctx.quadraticCurveTo(lcpX, cpY, tipX, tipY);   /* bord gauche */
  ctx.quadraticCurveTo(rcpX, cpY, rbX,  rbY);    /* bord droit (retour) */
  ctx.closePath();

  ctx.fillStyle   = grad;
  ctx.globalAlpha = 0.88 + Math.random() * 0.12;
  ctx.fill();

  /* Nervure centrale légère */
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
  ctx.strokeStyle = 'rgba(21,128,61,0.25)';
  ctx.lineWidth   = 0.4;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/* ── Pétale organique dessiné sur canvas ── */
function drawPetal(ctx, cx, cy, angle, r, color, progress) {
  if (progress <= 0) return;
  const sc  = Math.min(progress, 1);
  const a   = angle;
  const tip = r * sc;
  const tx  = cx + Math.cos(a) * tip;
  const ty  = cy + Math.sin(a) * tip;
  const lx  = cx + Math.cos(a - 0.5) * r * 0.75 * sc;
  const ly  = cy + Math.sin(a - 0.5) * r * 0.75 * sc;
  const rx  = cx + Math.cos(a + 0.5) * r * 0.75 * sc;
  const ry  = cy + Math.sin(a + 0.5) * r * 0.75 * sc;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(lx, ly, lx * 0.8 + tx * 0.2, ly * 0.8 + ty * 0.2, tx, ty);
  ctx.bezierCurveTo(rx * 0.8 + tx * 0.2, ry * 0.8 + ty * 0.2, rx, ry, cx, cy);
  ctx.fillStyle   = color;
  ctx.globalAlpha = 0.93 * Math.min(progress, 1);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/* ── Trèfle ── */
/* ── Pissenlit ── */
function drawDandelion(ctx, cx, baseY, stemH, progress, t) {
  if (progress <= 0) return;
  const sc   = Math.min(progress, 1);
  const tipY = baseY - stemH * sc;
  const sway = Math.sin(t * 1.5 + cx * 0.08) * 1.5 * sc;

  /* Tige */
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.quadraticCurveTo(cx + sway * 0.5, baseY - stemH * 0.5, cx + sway, tipY);
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth   = 1.2;
  ctx.globalAlpha = 0.9;
  ctx.stroke();

  /* Tête jaune */
  if (sc > 0.85) {
    const headProgress = (sc - 0.85) / 0.15;
    const hx = cx + sway;
    const hy = tipY;
    /* Pétales rayonnants */
    for (let p = 0; p < 12; p++) {
      const a = (p / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + Math.cos(a) * 5 * headProgress, hy + Math.sin(a) * 5 * headProgress);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = 0.85 * headProgress;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(hx, hy, 3 * headProgress, 0, Math.PI * 2);
    ctx.fillStyle   = '#fde047';
    ctx.globalAlpha = headProgress;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ── Fleur générique (marguerite / coquelicot / fleur sauvage) ── */
const FLOWER_TYPES = [
  { name:'marguerite', petals:10, r:7,   petalColor:'#ffffff', centerColor:'#f59e0b', centerR:3.5, stemW:1.6, stemColor:'#16a34a' },
  { name:'anemone',   petals:6,  r:7.5, petalColor:'#e879f9', centerColor:'#fde68a', centerR:2.8, stemW:1.5, stemColor:'#15803d' },
  { name:'sauvage',    petals:5,  r:6,   petalColor:'#c084fc', centerColor:'#fde68a', centerR:2.8, stemW:1.3, stemColor:'#22c55e' },
  { name:'bouton',     petals:8,  r:5.5, petalColor:'#fde047', centerColor:'#f59e0b', centerR:2.4, stemW:1.4, stemColor:'#4ade80' },
  { name:'rose_sauvage',petals:5, r:7.5, petalColor:'#f9a8d4', centerColor:'#fbbf24', centerR:3,   stemW:1.5, stemColor:'#16a34a' },
];

function drawFlower(ctx, cx, baseY, stemH, type, progress, t) {
  if (progress <= 0) return;
  const sc   = Math.min(progress, 1);
  const ft   = FLOWER_TYPES[type % FLOWER_TYPES.length];
  const sway = Math.sin(t * 1.4 + cx * 0.07) * 2.2 * sc;
  const stemProgress = Math.min(sc / 0.55, 1);
  const tipY = baseY - stemH * stemProgress;
  const tipX = cx + sway * 0.6;

  /* Tige avec courbure */
  const cpX = cx + sway * 0.3;
  const cpY = baseY - stemH * 0.5 * stemProgress;
  ctx.beginPath();
  ctx.moveTo(cx, baseY);
  ctx.quadraticCurveTo(cpX, cpY, tipX, tipY);
  ctx.strokeStyle = ft.stemColor;
  ctx.lineWidth   = ft.stemW;
  ctx.lineCap     = 'round';
  ctx.globalAlpha = 0.9;
  ctx.stroke();

  /* Feuilles sur la tige */
  if (stemProgress > 0.4) {
    const lfp = (stemProgress - 0.4) / 0.6;
    const lfy = baseY - stemH * 0.45 * stemProgress;
    drawLeafOnStem(ctx, cx, lfy, -45, 8 * lfp, ft.stemColor);
    drawLeafOnStem(ctx, cx, baseY - stemH * 0.65 * stemProgress, 225, 7 * lfp, ft.stemColor);
  }

  /* Fleur (apparaît quand la tige est presque complète) */
  if (sc > 0.55) {
    const flowerProgress = (sc - 0.55) / 0.45;
    for (let p = 0; p < ft.petals; p++) {
      const angle = (p / ft.petals) * Math.PI * 2 + Math.sin(t * 0.3) * 0.04;
      drawPetal(ctx, tipX, tipY, angle, ft.r, ft.petalColor, flowerProgress);
    }
    /* Centre */
    if (flowerProgress > 0.6 && ft.centerR > 0) {
      const cp = (flowerProgress - 0.6) / 0.4;
      ctx.beginPath();
      ctx.arc(tipX, tipY, ft.centerR * cp, 0, Math.PI * 2);
      ctx.fillStyle   = ft.centerColor;
      ctx.globalAlpha = cp;
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawLeafOnStem(ctx, x, y, angleDeg, size, color) {
  const a   = angleDeg * Math.PI / 180;
  const tx  = x + Math.cos(a) * size;
  const ty  = y + Math.sin(a) * size;
  const lx  = x + Math.cos(a - 0.55) * size * 0.6;
  const ly  = y + Math.sin(a - 0.55) * size * 0.6;
  const rx  = x + Math.cos(a + 0.55) * size * 0.6;
  const ry  = y + Math.sin(a + 0.55) * size * 0.6;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(lx, ly, lx*0.7+tx*0.3, ly*0.7+ty*0.3, tx, ty);
  ctx.bezierCurveTo(rx*0.7+tx*0.3, ry*0.7+ty*0.3, rx, ry, x, y);
  ctx.fillStyle   = color;
  ctx.globalAlpha = 0.8;
  ctx.fill();
  /* Nervure */
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(tx, ty);
  ctx.strokeStyle = 'rgba(21,128,61,0.3)';
  ctx.lineWidth   = 0.4;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/* ══ Scène complète par carte ══ */
function buildMarsScene(cardW, cardH) {
  /* Génère une liste de brins d'herbe et de plantes positionnés aléatoirement */
  const blades = [];
  const COUNT  = 55;
  for (let i = 0; i < COUNT; i++) {
    blades.push({
      x:     2 + Math.random() * (cardW - 4),
      h:     10 + Math.random() * 26,
      lean:  (Math.random() - 0.5) * 2.2,
      w:     1.4 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2,
      delay: Math.random() * 1.2,       /* délai d'apparition */
    });
  }
  /* Trier par hauteur pour que les grands soient derrière */
  blades.sort((a, b) => b.h - a.h);

  /* Fleurs réparties uniformément */
  const flowers = [];
  const FLOWER_COUNT = 7;
  for (let i = 0; i < FLOWER_COUNT; i++) {
    flowers.push({
      x:     18 + (i / (FLOWER_COUNT - 1)) * (cardW - 36) + (Math.random() - 0.5) * 18,
      stemH: 22 + Math.random() * 22,
      type:  i % FLOWER_TYPES.length,
      delay: 0.4 + i * 0.18 + Math.random() * 0.1,
    });
  }

  /* Pissenlits */
  const dandelions = [
    { x: cardW * 0.18, stemH: 28 + Math.random()*10, delay: 0.6 },
    { x: cardW * 0.72, stemH: 24 + Math.random()*10, delay: 1.0 },
  ];

  return { blades, flowers, dandelions };
}
function initMars() {
  _cards().forEach(function(card) {
    var canvas = _cv(card); fitCanvas(canvas, card);

    const W = canvas.width;
    const H = canvas.height;
    const GRASS_H = Math.round(H * 0.68);  /* hauteur max de la végétation */
    const baseY   = H;                      /* sol = bas de carte */

    const scene   = buildMarsScene(W, GRASS_H);
    let startTime = null;
    let running   = true;
    _cl.push(() => { running = false; });

    function progress(delay, duration, elapsed) {
      return Math.max(0, Math.min(1, (elapsed - delay) / duration));
    }

    function loop(ts) {
      if (!running) return;
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      const t       = elapsed;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, W, H);

      /* ── Sol herbeux ── */
      const groundGrad = ctx.createLinearGradient(0, baseY - 6, 0, baseY);
      const isDarkMode = isDark();
      groundGrad.addColorStop(0, isDarkMode ? 'rgba(74,222,128,0.55)' : 'rgba(74,222,128,0.35)');
      groundGrad.addColorStop(1, isDarkMode ? 'rgba(21,128,61,0.75)' : 'rgba(21,128,61,0.5)');
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let gx = 0; gx <= W; gx += 4) {
        const gy = baseY - 3 - Math.sin(gx * 0.15 + t * 0.4) * 1.5;
        ctx.lineTo(gx, gy);
      }
      ctx.lineTo(W, baseY);
      ctx.closePath();
      ctx.fillStyle = groundGrad;
      ctx.fill();

      /* ── Brins d'herbe ── */
      scene.blades.forEach(b => {
        const p = progress(b.delay, 0.7, elapsed);
        if (p <= 0) return;
        drawGrassBlade(ctx, b.x, baseY, b.h * p, b.lean, b.w, b.phase, t);
      });

      /* ── Pissenlits ── */
      scene.dandelions.forEach(d => {
        const p = progress(d.delay, 1.4, elapsed);
        drawDandelion(ctx, d.x, baseY, d.stemH, p, t);
      });

      /* ── Fleurs ── */
      scene.flowers.forEach(f => {
        const p = progress(f.delay, 1.5, elapsed);
        drawFlower(ctx, f.x, baseY, f.stemH, f.type, p, t);
      });

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initAout() {
  if (!document.getElementById('wave-kf')) {
    var s=document.createElement('style'); s.id='wave-kf';
    s.textContent='@keyframes wave-main{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes wave-deep{from{transform:translateX(-50%)}to{transform:translateX(0)}}@keyframes foam-trail{0%{opacity:.3}100%{opacity:.9}}@keyframes ray-pulse{0%,100%{opacity:.2}50%{opacity:.45}}';
    document.head.appendChild(s);
  }
  var aC=['#fbbf24','#fcd34d','#fde68a'], aD=[0,0.5,1];
  _cards().forEach(function(card, ci) {
    var sunColor=aC[ci%3], delay=aD[ci%3];
    var w=card.offsetWidth||280;
    var wdiv=card.querySelector('.mp-wave');
    if(!wdiv){wdiv=document.createElement('div');wdiv.className='mp-wave';
      wdiv.style.cssText='position:absolute;bottom:0;left:0;right:0;height:38px;pointer-events:none;z-index:3;overflow:hidden;';
      card.appendChild(wdiv);}
    wdiv.innerHTML=buildWaveSVG(w,w-28,sunColor,delay);
  });
}
function initDecembre() {
  _cards().forEach(function(card) {
    const canvas = $(id);
    fitCanvas(canvas, card);

    const ctx    = canvas.getContext('2d');
    const W      = canvas.width;
    const H      = canvas.height;
    const COUNT  = 12;

    /* Flocons */
    const flakes = Array.from({length: COUNT}, (_, i) => ({
      x:       rand(0, W),
      y:       rand(-H, H),
      r:       rand(4, 9),
      speed:   rand(0.18, 0.45),
      drift:   rand(-0.2, 0.2),
      angle:   rand(0, Math.PI*2),
      spin:    rand(-0.008, 0.008),
      opacity: rand(0.5, 0.9),
      depth:   i < 4 ? 3 : i < 8 ? 2 : 1,
      phase:   rand(0, Math.PI*2),
    }));

    let t = 0;
    let running = true;
    _cl.push(() => { running = false; });

    /* Accumulation neige bas */
    const pileH = Array.from({length: Math.ceil(W/3)+1}, () => rand(3, 8));

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.014;

      /* Neige accumulée */
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let i = 0; i <= Math.ceil(W/3); i++) {
        const px = i * 3;
        const py = H - pileH[i] * (0.9 + Math.sin(t*0.3 + i)*0.1);
        i === 0 ? ctx.moveTo(px, py) : ctx.quadraticCurveTo(px - 1.5, py + 1, px, py);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = 'rgba(239,246,255,0.92)';
      ctx.fill();

      /* Flocons */
      flakes.forEach(f => {
        f.y     += f.speed;
        f.x     += f.drift + Math.sin(t * 0.6 + f.phase) * 0.12;
        f.angle += f.spin;
        if (f.y > H + 10) { f.y = -12; f.x = rand(0, W); }
        if (f.x < -12) f.x = W + 12;
        if (f.x > W + 12) f.x = -12;
        drawFractalFlake(ctx, f.x, f.y, f.r, f.depth, f.angle, f.opacity);
      });

      /* Givre sur bord supérieur */
      ctx.strokeStyle = isDark() ? 'rgba(147,197,253,0.7)' : 'rgba(186,230,252,0.45)';
      ctx.lineWidth = 0.8;
      for (let gx = 8; gx < W - 8; gx += 18) {
        const gy = 2 + Math.sin(gx * 0.3) * 1.5;
        ctx.save();
        ctx.translate(gx, gy);
        /* Petite branche de givre */
        for (let d = 0; d < 3; d++) {
          const a = (d / 3) * Math.PI - Math.PI/2;
          const len = 5 + Math.sin(gx*0.5)*2;
          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(Math.cos(a)*len, Math.sin(a)*len);
          ctx.stroke();
        }
        ctx.restore();
      }

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initJanvier() {

  _cards().forEach(function(card) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');

    /* Flocons tombants */
    const flakes = Array.from({length:14}, () => ({
      x: rand(0,W), y: rand(-H,H), r: rand(3,8),
      speed: rand(0.15,0.35), drift: rand(-0.15,0.15),
      angle: rand(0,Math.PI*2), spin: rand(-0.006,0.006),
      opacity: rand(0.45,0.85), depth: Math.random()<0.4?3:2,
      phase: rand(0,Math.PI*2),
    }));

    /* Points de départ des cristaux de givre (coins + bords) */
    const frostOrigins = [
      { x: 0,   y: 0,   ax: Math.PI/6,  ay: Math.PI/3  },   /* coin TL */
      { x: W,   y: 0,   ax: Math.PI*5/6,ay: Math.PI*2/3 },  /* coin TR */
      { x: W/3, y: 0,   ax: Math.PI/4,  ay: Math.PI/2  },   /* bord haut */
      { x: W*2/3,y:0,   ax: Math.PI*3/4,ay: Math.PI/2  },
    ];

    let t = 0, running = true;
    _cl.push(() => { running = false; });

    function loop() {
      if (!running) return;
      t += 0.012;
      ctx.clearRect(0,0,W,H);

      /* ── Cristaux de givre sur les bords ── */
      frostOrigins.forEach(o => {
        /* Plusieurs branches rayonnantes */
        for (let i = -2; i <= 2; i++) {
          const baseAngle = (o.ax + o.ay) / 2 + i * 0.22;
          drawFrostBranch(ctx, o.x, o.y, 18 + Math.abs(i)*3, baseAngle + Math.sin(t*0.3)*0.04, 4, t);
        }
      });

      /* ── Accumulation givrage bord supérieur ── */
      ctx.beginPath();
      for (let gx = 0; gx <= W; gx += 3) {
        const gy = 1.5 + Math.sin(gx*0.22 + t*0.2)*1.2 + Math.sin(gx*0.08)*1.8;
        gx===0 ? ctx.moveTo(gx,gy) : ctx.lineTo(gx,gy);
      }
      ctx.strokeStyle = 'rgba(219,234,254,0.55)';
      ctx.lineWidth = 2.5; ctx.stroke();

      /* ── Flocons fractals ── */
      flakes.forEach(f => {
        f.y += f.speed; f.x += f.drift + Math.sin(t*0.7+f.phase)*0.1;
        f.angle += f.spin;
        if (f.y > H+8) { f.y=-8; f.x=rand(0,W); }
        if (f.x<-8) f.x=W+8; if (f.x>W+8) f.x=-8;
        drawFractalFlake(ctx, f.x, f.y, f.r, f.depth, f.angle, f.opacity);
      });

      /* ── Fine couche de neige accumulée en bas ── */
      const piles = Array.from({length:Math.ceil(W/2)+1},(_,i)=>2.5+Math.sin(i*0.4+1.2)*1.8+Math.random()*0.5);
      ctx.beginPath(); ctx.moveTo(0,H);
      for (let i=0; i<=Math.ceil(W/2); i++) {
        const px=i*2, py=H-piles[i];
        i===0?ctx.moveTo(px,py):ctx.quadraticCurveTo(px-1,py+0.8,px,py);
      }
      ctx.lineTo(W,H); ctx.closePath();
      ctx.fillStyle= isDark() ? 'rgba(147,197,253,0.35)' : 'rgba(239,246,255,0.88)'; ctx.fill();

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initFevrier() {

  const heartPalettes = [
    ['#f43f5e','#fb7185','#fda4af','#fecdd3'],
    ['#ec4899','#f472b6','#f9a8d4','#fce7f3'],
    ['#e11d48','#f43f5e','#fb7185','#ff8fab'],
  ];

  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');
    const palette = heartPalettes[ci];

    /* Pool de cœurs */
    const hearts = Array.from({length:12}, (_, i) => ({
      x:      rand(W*0.1, W*0.9),
      y:      H + rand(10, 40),
      size:   rand(3.5, 8),
      speed:  rand(0.3, 0.75),
      drift:  rand(-0.25, 0.25),
      sway:   rand(0.4, 1.2),
      phase:  rand(0, Math.PI*2),
      color:  palette[Math.floor(Math.random()*palette.length)],
      alpha:  rand(0.55, 0.92),
      rot:    rand(-0.3, 0.3),
      rotSpd: rand(-0.012, 0.012),
      delay:  i * 0.4,
    }));

    let t = 0, running = true;
    _cl.push(() => { running = false; });

    function loop() {
      if (!running) return;
      t += 0.014;
      ctx.clearRect(0,0,W,H);

      hearts.forEach(h => {
        if (t < h.delay) return;
        h.y   -= h.speed;
        h.x   += h.drift + Math.sin(t * h.sway + h.phase) * 0.35;
        h.rot += h.rotSpd;
        /* Opacité : apparaît doucement, disparaît en haut */
        const lifeAlpha = h.y < H*0.25
          ? Math.max(0, h.y / (H*0.25)) * h.alpha
          : h.alpha;
        /* Légère pulsation */
        const pulse = 1 + Math.sin(t * 2.5 + h.phase) * 0.06;

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rot);
        ctx.scale(pulse, pulse);
        drawHeart(ctx, 0, 0, h.size, h.color, lifeAlpha);
        ctx.restore();

        /* Réinitialisation quand sorti par le haut */
        if (h.y < -20) {
          h.y     = H + rand(5, 30);
          h.x     = rand(W*0.08, W*0.92);
          h.speed = rand(0.3, 0.75);
          h.size  = rand(3.5, 8);
          h.color = palette[Math.floor(Math.random()*palette.length)];
          h.phase = rand(0, Math.PI*2);
          h.delay = 0;
        }
      });

      /* Petits cœurs au sol */
      for (let i = 0; i < 4; i++) {
        const sx = W*(0.12 + i*0.22), sy = H - 6;
        const sp = 0.7 + Math.sin(t*1.8 + i)*0.15;
        drawHeart(ctx, sx, sy, sp*3, palette[i%palette.length], 0.25);
      }

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initAvril() {

  _cards().forEach(function(card) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d');

    /* Gouttes sur vitre */
    const drops = Array.from({length: 28}, () => makeDrop(W, H, true));

    function makeDrop(W, H, init) {
      const size = rand(2.2, 6.5);
      return {
        x:      rand(4, W-4),
        y:      init ? rand(-H, H*0.3) : rand(-20, -5),
        size,
        speedY: rand(0.6, 2.2) * (size / 4.5),   /* grosses gouttes tombent plus vite */
        speedX: rand(-0.08, 0.12),
        trail:  [],
        alpha:  rand(0.35, 0.7),
        frozen: false,     /* pause momentanée — accumulation */
        pauseT: 0,
        type:   Math.random() < 0.3 ? 'streak' : 'drop',  /* traînée fine vs goutte ronde */
      };
    }

    let t = 0, running = true;
    _cl.push(() => { running = false; });

    /* Fond légèrement teinté — effet vitre */
    function drawGlassOverlay() {
      const grad = ctx.createLinearGradient(0,0,W,H);
      grad.addColorStop(0, 'rgba(203,213,225,0.06)');
      grad.addColorStop(1, 'rgba(148,163,184,0.04)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,W,H);
    }

    function drawDrop(d) {
      if (d.type === 'streak') {
        /* Traînée fine */
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.size*2.5);
        ctx.lineTo(d.x + d.speedX*8, d.y + d.size*1.2);
        const g = ctx.createLinearGradient(d.x, d.y-d.size*2.5, d.x, d.y+d.size*1.2);
        g.addColorStop(0, `rgba(148,163,184,0)`);
        g.addColorStop(0.4, `rgba(186,230,252,${d.alpha*0.6})`);
        g.addColorStop(1, `rgba(186,230,252,${d.alpha})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = d.size * 0.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      } else {
        /* Goutte ronde avec reflet */
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.size*0.75, d.size, 0, 0, Math.PI*2);
        const g = ctx.createRadialGradient(d.x-d.size*0.2, d.y-d.size*0.3, 0, d.x, d.y, d.size);
        g.addColorStop(0, `rgba(255,255,255,${d.alpha*0.7})`);
        g.addColorStop(0.4,`rgba(186,230,252,${d.alpha*0.55})`);
        g.addColorStop(1, `rgba(148,163,184,${d.alpha*0.35})`);
        ctx.fillStyle = g;
        ctx.fill();
        /* Contour très léger */
        ctx.strokeStyle = `rgba(148,163,184,${d.alpha*0.3})`;
        ctx.lineWidth = 0.4; ctx.stroke();
        /* Trace derrière */
        if (d.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(d.trail[0].x, d.trail[0].y);
          d.trail.forEach(p => ctx.lineTo(p.x, p.y));
          const tg = ctx.createLinearGradient(0, d.trail[0].y, 0, d.y);
          tg.addColorStop(0, 'rgba(186,230,252,0)');
          tg.addColorStop(1, `rgba(186,230,252,${d.alpha*0.25})`);
          ctx.strokeStyle = tg;
          ctx.lineWidth = d.size * 0.35;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }
    }

    function loop() {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0,0,W,H);
      drawGlassOverlay();

      /* Ruissellement en bas */
      ctx.beginPath();
      for (let rx=0; rx<=W; rx+=3) {
        const ry = H - 1 - Math.abs(Math.sin(rx*0.08+t*0.6))*2.5;
        rx===0?ctx.moveTo(rx,ry):ctx.lineTo(rx,ry);
      }
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
      ctx.fillStyle='rgba(186,230,252,0.18)'; ctx.fill();

      drops.forEach(d => {
        if (d.frozen) {
          d.pauseT -= 0.016;
          if (d.pauseT <= 0) d.frozen = false;
        } else {
          /* Légère pause aléatoire — accrochage sur vitre */
          if (Math.random() < 0.004 && d.size > 4) {
            d.frozen = true; d.pauseT = rand(0.3, 1.2);
          }
          /* Trace */
          d.trail.push({x: d.x, y: d.y});
          if (d.trail.length > 12) d.trail.shift();

          d.y += d.speedY;
          d.x += d.speedX + Math.sin(t*0.9 + d.x*0.05) * 0.06;
        }

        drawDrop(d);

        if (d.y > H + 10) {
          Object.assign(d, makeDrop(W, H, false));
        }
      });

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initMai() {

  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');

    /* ── Papillons : 3 par carte ── */
    const butterflies = [
      { cx:W*0.22, cy:H*0.38, ax:W*0.18, ay:H*0.22, fx:0.38, fy:0.55,
        px:0, py:Math.PI/4, wf:rand(5.5,7), wp:rand(0,Math.PI*2),
        sp:BUTTERFLY_SPECIES[ci%4], sc:rand(0.88,1.1) },
      { cx:W*0.62, cy:H*0.32, ax:W*0.16, ay:H*0.2,  fx:0.44, fy:0.31,
        px:Math.PI*0.7, py:Math.PI*1.3, wf:rand(6,8), wp:rand(0,Math.PI*2),
        sp:BUTTERFLY_SPECIES[(ci+1)%4], sc:rand(0.72,0.9) },
      { cx:W*0.78, cy:H*0.52, ax:W*0.12, ay:H*0.16, fx:0.27, fy:0.41,
        px:Math.PI*1.5, py:Math.PI*0.4, wf:rand(6.5,9), wp:rand(0,Math.PI*2),
        sp:BUTTERFLY_SPECIES[(ci+2)%4], sc:rand(0.62,0.78) },
    ];

    /* ── Muguets : positions fixes par carte ── */
    const muguets = [
      {x: W*0.10, h: H*0.26, delay: 0.0},
      {x: W*0.34, h: H*0.24, delay: 0.5},
      {x: W*0.62, h: H*0.28, delay: 1.0},
      {x: W*0.86, h: H*0.23, delay: 1.4},
    ];

    /* ── Brins de gazon précalculés (positions et paramètres fixes) ── */
    const grassColors = ['#22c55e','#16a34a','#4ade80','#15803d','#86efac'];
    const grassBlades = Array.from({length:32}, (_, gi) => ({
      x:     (gi / 32) * W + rand(-3, 3),
      h:     rand(6, 14),
      lean:  rand(-1.0, 1.0),
      w:     rand(1.0, 2.2),
      col:   grassColors[Math.floor(Math.random()*grassColors.length)],
      freq:  rand(0.8, 1.6),    /* fréquence de balancement lente */
      phase: rand(0, Math.PI*2),
    }));

    let t=0, startTime=null, running=true;
    _cl.push(()=>{ running=false; });

    function loop(ts) {
      if(!running) return;
      if(!startTime) startTime=ts;
      const elapsed=(ts-startTime)/1000;
      t=elapsed;
      ctx.clearRect(0,0,W,H);

      /* ── Sol herbeux ── */
      const gnd = ctx.createLinearGradient(0, H-8, 0, H);
      const dkM = isDark();
      gnd.addColorStop(0, dkM ? 'rgba(74,222,128,0.45)' : 'rgba(74,222,128,0.22)');
      gnd.addColorStop(1, dkM ? 'rgba(21,128,61,0.70)' : 'rgba(21,128,61,0.40)');
      ctx.fillStyle=gnd; ctx.fillRect(0,H-8,W,8);

      /* ── Gazon : brins précalculés, animés seulement par sway ── */
      grassBlades.forEach((b, gi) => {
        /* Balancement : sin lent avec phase individuelle — naturel */
        const sway  = Math.sin(t * b.freq + b.phase) * b.lean * 0.28;
        const tipX  = b.x + b.lean * b.h * 0.38 + sway;
        const tipY  = H - b.h;
        const cpX   = b.x + b.lean * b.h * 0.20 + sway * 0.5;
        const cpY   = H - b.h * 0.55;
        const hw    = b.w * 0.5;
        ctx.beginPath();
        ctx.moveTo(b.x - hw, H);
        ctx.quadraticCurveTo(cpX - hw*0.5, cpY, tipX, tipY);
        ctx.quadraticCurveTo(cpX + hw*0.5, cpY, b.x + hw, H);
        ctx.closePath();
        const gg = ctx.createLinearGradient(b.x, H, tipX, tipY);
        gg.addColorStop(0, '#14532d'); gg.addColorStop(1, b.col);
        ctx.fillStyle = gg; ctx.globalAlpha = dkM ? 0.88 : 0.72; ctx.fill();
      });
      ctx.globalAlpha = 1;

      /* ── Muguets ── */
      muguets.forEach(m => drawMuguet(ctx, m.x, H, m.h, m.delay, t, elapsed));

      /* ── Papillons ── */
      butterflies.forEach(b => {
        const x = b.cx + Math.cos(t*b.fx + b.px)*b.ax;
        const y = b.cy + Math.sin(t*b.fy + b.py)*b.ay;
        /* Inclinaison légère selon direction horizontale */
        const vx = -Math.sin(t*b.fx + b.px)*b.ax*b.fx;
        const tilt = Math.atan2(0, vx)*0.15;
        const wPhase = t*b.wf + b.wp;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.scale(b.sc, b.sc);
        drawButterfly(ctx, wPhase, b.sp);
        ctx.restore();
      });

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initJuin() {
  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W=canvas.width,H=canvas.height,ctx=canvas.getContext('2d');
    /* Lucioles sur la carte */
    const flies=Array.from({length:8},(_,i)=>({
      x:rand(W*0.1,W*0.9), y:rand(H*0.15,H*0.85),
      vx:rand(-0.18,0.18), vy:rand(-0.12,0.12),
      phase:rand(0,Math.PI*2), freq:rand(1.2,2.8),
      size:rand(1.5,3), color:i%3===0?'#bbf7d0':'#fde047',
    }));
    /* Reflet lumineux qui balaie */
    let shimmerX=-W*0.3, shimmerDir=1;
    let t=0,running=true; _cl.push(()=>{running=false;});
    function loop(){
      if(!running)return; t+=0.016;
      ctx.clearRect(0,0,W,H);
      /* Reflet lumineux diagonal */
      shimmerX+=shimmerDir*0.6;
      if(shimmerX>W*1.3){shimmerX=W*1.3;shimmerDir=-1;}
      if(shimmerX<-W*0.3){shimmerX=-W*0.3;shimmerDir=1;}
      const sg=ctx.createLinearGradient(shimmerX-40,0,shimmerX+40,H);
      sg.addColorStop(0,'rgba(253,224,71,0)');
      sg.addColorStop(0.5,'rgba(253,224,71,0.09)');
      sg.addColorStop(1,'rgba(253,224,71,0)');
      ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);
      /* Lucioles */
      flies.forEach(f=>{
        f.x+=f.vx+Math.sin(t*0.6+f.phase)*0.12;
        f.y+=f.vy+Math.cos(t*0.5+f.phase)*0.1;
        if(f.x<4)f.vx=Math.abs(f.vx); if(f.x>W-4)f.vx=-Math.abs(f.vx);
        if(f.y<4)f.vy=Math.abs(f.vy); if(f.y>H-4)f.vy=-Math.abs(f.vy);
        const alpha=(Math.sin(t*f.freq+f.phase)+1)*0.5;
        if(alpha<0.08)return;
        const glow=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.size*5);
        const rgb=f.color==='#fde047'?'253,224,71':'187,247,208';
        glow.addColorStop(0,`rgba(${rgb},${alpha*0.8})`);
        glow.addColorStop(1,`rgba(${rgb},0)`);
        ctx.beginPath(); ctx.arc(f.x,f.y,f.size*5,0,Math.PI*2);
        ctx.fillStyle=glow; ctx.fill();
        ctx.beginPath(); ctx.arc(f.x,f.y,f.size*0.7,0,Math.PI*2);
        ctx.fillStyle=f.color; ctx.globalAlpha=Math.min(alpha*2,1); ctx.fill();
        ctx.globalAlpha=1;
      });
      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initJuillet() {
  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W=canvas.width,H=canvas.height,ctx=canvas.getContext('2d');
    /* Soleil dans coin supérieur droit */
    const sunX=W-18,sunY=14,sunR=10;
    let t=0,running=true; _cl.push(()=>{running=false;});
    function loop(){
      if(!running)return; t+=0.016;
      ctx.clearRect(0,0,W,H);
      /* Vagues de chaleur — distorsion thermique */
      const heatH=H*0.35;
      for(let row=0;row<6;row++){
        const wy=H-heatH+row*(heatH/6);
        const alpha=0.04+row*0.018;
        const amp=1.2+row*0.4;
        ctx.beginPath();
        for(let x=0;x<=W;x+=3){
          const y=wy+Math.sin(x*0.08+t*(1+row*0.15))*amp
                   +Math.sin(x*0.12-t*0.8)*amp*0.5;
          x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
        const g=ctx.createLinearGradient(0,wy,0,H);
        g.addColorStop(0,`rgba(251,146,60,0)`);
        g.addColorStop(0.3,`rgba(253,186,116,${alpha})`);
        g.addColorStop(1,`rgba(251,146,60,${alpha*1.5})`);
        ctx.fillStyle=g; ctx.fill();
      }
      /* Soleil rayonnant */
      const pulse=1+Math.sin(t*1.8)*0.04;
      ctx.save(); ctx.translate(sunX,sunY);
      /* Halo */
      const halo=ctx.createRadialGradient(0,0,sunR,0,0,sunR*3.5);
      halo.addColorStop(0,`rgba(253,186,116,${0.35*pulse})`);
      halo.addColorStop(1,'rgba(253,186,116,0)');
      ctx.beginPath(); ctx.arc(0,0,sunR*3.5,0,Math.PI*2);
      ctx.fillStyle=halo; ctx.fill();
      /* Rayons */
      ctx.rotate(t*0.4);
      for(let i=0;i<10;i++){
        const a=(i/10)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*(sunR+2),Math.sin(a)*(sunR+2));
        ctx.lineTo(Math.cos(a)*(sunR+7+i%2*3),Math.sin(a)*(sunR+7+i%2*3));
        ctx.strokeStyle=`rgba(253,186,116,${0.7*pulse})`;
        ctx.lineWidth=i%2===0?1.8:1; ctx.lineCap='round'; ctx.stroke();
      }
      ctx.restore();
      /* Corps soleil */
      const sg=ctx.createRadialGradient(sunX-3,sunY-3,0,sunX,sunY,sunR*pulse);
      sg.addColorStop(0,'rgba(254,240,138,0.95)');
      sg.addColorStop(0.6,'rgba(253,186,116,0.9)');
      sg.addColorStop(1,'rgba(251,146,60,0.85)');
      ctx.beginPath(); ctx.arc(sunX,sunY,sunR*pulse,0,Math.PI*2);
      ctx.fillStyle=sg; ctx.fill();
      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initSeptembre() {

  /* Palette de cahiers par carte */
  const coverColors = [
    ['#3b82f6','#ef4444','#22c55e','#a855f7'],
    ['#f59e0b','#06b6d4','#ec4899','#14b8a6'],
    ['#6366f1','#f97316','#10b981','#f43f5e'],
  ];

  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W=canvas.width,H=canvas.height,ctx=canvas.getContext('2d');
    const colors=coverColors[ci];

    /* Objets flottants */
    const objects = [
      /* Cahiers */
      {type:'notebook',x:rand(W*0.1,W*0.35),y:rand(H*0.2,H*0.6),
       w:28,h:20,angle:rand(-0.4,0.4),color:colors[0],
       vy:rand(-0.06,0.06),vx:rand(-0.04,0.04),phase:rand(0,Math.PI*2),amp:rand(3,6)},
      {type:'notebook',x:rand(W*0.5,W*0.85),y:rand(H*0.15,H*0.55),
       w:24,h:18,angle:rand(-0.5,0.5),color:colors[1],
       vy:rand(-0.06,0.06),vx:rand(-0.04,0.04),phase:rand(0,Math.PI*2),amp:rand(3,6)},
      /* Crayons */
      {type:'pencil',x:rand(W*0.15,W*0.45),y:rand(H*0.3,H*0.7),
       len:32,angle:rand(-0.8,0.8),color:colors[2],
       vy:rand(-0.05,0.05),vx:rand(-0.04,0.04),phase:rand(0,Math.PI*2),amp:rand(4,7)},
      {type:'pencil',x:rand(W*0.55,W*0.9),y:rand(H*0.25,H*0.65),
       len:28,angle:rand(-0.9,0.9),color:colors[3],
       vy:rand(-0.05,0.05),vx:rand(-0.04,0.04),phase:rand(0,Math.PI*2),amp:rand(3,6)},
      /* Règle */
      {type:'ruler',x:rand(W*0.2,W*0.7),y:rand(H*0.4,H*0.75),
       len:55,angle:rand(-0.3,0.3),
       vy:rand(-0.04,0.04),vx:rand(-0.03,0.03),phase:rand(0,Math.PI*2),amp:rand(2,5)},
      /* Étoiles */
      {type:'star',x:rand(W*0.08,W*0.25),y:rand(H*0.1,H*0.45),
       r:rand(5,9),angle:0,alpha:rand(0.6,0.9),
       vy:rand(-0.04,0.04),vx:rand(-0.03,0.03),phase:rand(0,Math.PI*2),amp:rand(3,5),rotSpd:0.01},
      {type:'star',x:rand(W*0.7,W*0.95),y:rand(H*0.15,H*0.5),
       r:rand(4,7),angle:0,alpha:rand(0.5,0.8),
       vy:rand(-0.04,0.04),vx:rand(-0.03,0.03),phase:rand(0,Math.PI*2),amp:rand(2,5),rotSpd:0.015},
    ];

    let t=0,running=true; _cl.push(()=>{running=false;});
    function loop(){
      if(!running)return; t+=0.016;
      ctx.clearRect(0,0,W,H);
      objects.forEach(o=>{
        /* Flottement doux */
        const fx = o.x + Math.sin(t*0.6+o.phase)*o.amp;
        const fy = o.y + Math.cos(t*0.5+o.phase)*o.amp*0.6;
        ctx.globalAlpha = 0.88;
        if(o.type==='notebook') drawNotebook(ctx,fx,fy,o.w,o.h,o.angle,o.color);
        if(o.type==='pencil')   drawPencil(ctx,fx,fy,o.len,o.angle,o.color);
        if(o.type==='ruler')    drawRuler(ctx,fx,fy,o.len,o.angle);
        if(o.type==='star')     {
          o.angle += o.rotSpd;
          drawStar(ctx,fx,fy,o.r,o.angle,o.alpha);
        }
        ctx.globalAlpha=1;
      });
      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initOctobre(){
  const leafCols=['#ea580c','#dc2626','#d97706','#b45309','#c2410c'];
  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W=canvas.width,H=canvas.height,ctx=canvas.getContext('2d');
    /* Feuilles qui tourbillonnent */
    const leaves=Array.from({length:16},()=>({
      x:rand(0,W), y:rand(-H,H*0.5),
      size:rand(6,13), vx:rand(-0.5,0.6), vy:rand(0.3,1.0),
      rot:rand(0,Math.PI*2), rotSpd:rand(-0.03,0.03),
      color:leafCols[Math.floor(Math.random()*leafCols.length)],
      alpha:rand(0.6,0.92), sway:rand(0.5,1.2), phase:rand(0,Math.PI*2),
    }));
    /* Citrouilles : une grande droite, une petite gauche */
    const pumps = [
      {x: W - 28, y: H - 20, size: 18 + ci * 2},
      {x: 22,     y: H - 14, size: 11},
    ];
    let t=0,running=true; _cl.push(()=>{running=false;});
    function loop(){
      if(!running)return; t+=0.016;
      ctx.clearRect(0,0,W,H);
      /* Feuilles */
      leaves.forEach(l=>{
        l.y+=l.vy; l.x+=l.vx+Math.sin(t*l.sway+l.phase)*0.45;
        l.rot+=l.rotSpd;
        if(l.y>H+14){l.y=rand(-20,-4);l.x=rand(0,W);}
        if(l.x<-14)l.x=W+14; if(l.x>W+14)l.x=-14;
        const flip=Math.cos(l.rot*2);
        ctx.save(); ctx.translate(l.x,l.y); ctx.scale(flip,1); ctx.translate(-l.x,-l.y);
        drawAutumnLeaf(ctx,l.x,l.y,l.size,l.rot,l.color,l.alpha);
        ctx.restore();
      });
      /* Citrouilles */
      pumps.forEach(p => {
        const glow=0.6+Math.sin(t*2.2 + p.x)*0.4;
        ctx.shadowColor=`rgba(251,146,60,${glow*0.55})`; ctx.shadowBlur=10*glow;
        drawPumpkin(ctx, p.x, p.y, p.size);
      });
      ctx.shadowBlur=0;
      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}
function initNovembre(){
  _cards().forEach(function(card, ci) {
    var canvas=_cv(card); fitCanvas(canvas,card);
    const W=canvas.width,H=canvas.height,ctx=canvas.getContext('2d');

    /* Arbres en silhouette — positionnés aux bords */
    const trees = [
      {x: W*0.05, h: H*0.75, spread:1.1, alpha:0.55},
      {x: W*0.92, h: H*0.65, spread:1.0, alpha:0.5},
      {x: W*0.22, h: H*0.5,  spread:0.9, alpha:0.35},
      {x: W*0.78, h: H*0.45, spread:0.9, alpha:0.3},
    ];

    /* Champignons au sol */
    const shrooms = [
      {x:W*0.14, size:8+ci*1.5},
      {x:W*0.42, size:6.5},
      {x:W*0.68, size:9+ci},
      {x:W*0.88, size:7},
    ];

    /* Feuilles mortes au sol */
    const deadLeaves = Array.from({length:18}, () => ({
      x: rand(4, W-4), y: H - rand(1,5),
      size: rand(4, 8), rot: rand(-Math.PI, Math.PI),
      color: ['#92400e','#b45309','#78350f','#a16207','#6b7280'][Math.floor(Math.random()*5)],
    }));

    /* Écureuil */
    const squirrel = {x: W*0.52, y: H-9, size: 9+ci, flip: ci%2===0, vx: 0.18, dir: 1};

    /* Brume en couches */
    const mistLayers = Array.from({length:5}, (_,i) => ({
      y: H*(0.6 + i*0.1), w: W*(1.2+i*0.2), speed: 0.006+i*0.003,
      phase: i*Math.PI/2.5, alpha: 0.05+i*0.025,
    }));

    let t=0, running=true;
    _cl.push(()=>{ running=false; });

    function loop(){
      if(!running) return; t+=0.013;
      ctx.clearRect(0,0,W,H);

      /* ── Arbres dépouillés (fond, derrière tout) ── */
      trees.forEach(tr => drawBareTree(ctx, tr.x, H, tr.h, tr.spread, tr.alpha));

      /* ── Sol — litière de feuilles ── */
      const groundG = ctx.createLinearGradient(0, H-8, 0, H);
      groundG.addColorStop(0, isDark() ? 'rgba(120,60,20,0.6)' : 'rgba(120,60,20,0.3)');
      groundG.addColorStop(1, isDark() ? 'rgba(80,40,15,0.8)' : 'rgba(80,40,15,0.45)');
      ctx.fillStyle = groundG; ctx.fillRect(0, H-8, W, 8);

      /* Feuilles mortes au sol */
      deadLeaves.forEach(l => drawDeadLeaf(ctx, l.x, l.y, l.size, l.rot, l.color));

      /* Mousse */
      [[W*0.08,H-2,18],[W*0.55,H-2,14],[W*0.82,H-2,16]].forEach(([mx,my,mw])=>
        drawMoss(ctx,mx,my,mw,0.7));

      /* ── Brume en nappe (devant le sol, derrière champignons) ── */
      mistLayers.forEach(m => {
        const offsetX = Math.sin(t*m.speed*10+m.phase)*20;
        const offsetY = Math.sin(t*m.speed*8+m.phase)*4;
        const g = ctx.createRadialGradient(
          W/2+offsetX, m.y+offsetY, 0,
          W/2+offsetX, m.y+offsetY, m.w*0.5
        );
        const alpha = m.alpha * (0.65+Math.sin(t*1.2+m.phase)*0.35);
        var mistAlpha = isDark() ? alpha * 1.8 : alpha;
        g.addColorStop(0, `rgba(209,213,219,${mistAlpha})`);
        g.addColorStop(0.6, `rgba(209,213,219,${mistAlpha*0.4})`);
        g.addColorStop(1, 'rgba(209,213,219,0)');
        ctx.beginPath();
        ctx.ellipse(W/2+offsetX, m.y+offsetY, m.w*0.5, 12+m.phase*3, 0, 0, Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      });

      /* ── Champignons ── */
      shrooms.forEach(s => {
        const bob = Math.sin(t*1.2+s.x*0.04)*0.6;
        drawForestMushroom(ctx, s.x, H - s.size*0.45 + bob, s.size);
      });

      /* ── Écureuil ── */
      squirrel.x += squirrel.vx * squirrel.dir;
      if(squirrel.x > W-15) squirrel.dir = -1;
      if(squirrel.x < 15)   squirrel.dir =  1;
      const sqFlip = squirrel.dir < 0;
      /* Petit sautillement */
      const sqBob = Math.abs(Math.sin(t*4))*2.5;
      drawSquirrel(ctx, squirrel.x, squirrel.y - sqBob, squirrel.size, sqFlip);

      _af.push(requestAnimationFrame(loop));
    }
    _af.push(requestAnimationFrame(loop));
  });
}

/* ═══════════════════════════════════════════════════════
   ORCHESTRATION
═══════════════════════════════════════════════════════ */
  var _MONTHS=[
    'janvier','fevrier','mars','avril','mai','juin',
    'juillet','aout','septembre','octobre','novembre','decembre'
  ];
  var _INITS=[
    initJanvier,initFevrier,initMars,initAvril,
    initMai,initJuin,initJuillet,initAout,
    initSeptembre,initOctobre,initNovembre,initDecembre
  ];

  function _apply(){
    var m=new Date().getMonth();
    if(m===_month) return;
    _month=m;
    _stopAll();
    var body=document.body;
    _MONTHS.forEach(function(mn){body.classList.remove('season-'+mn);});
    body.classList.add('season-'+_MONTHS[m]);
    renderBackground(_MONTHS[m]);
    setTimeout(_runCards,150);
  }

  function _runCards(){
    var cards=_cards();
    if(!cards.length){setTimeout(_runCards,200);return;}
    _INITS[_month]();
  }

  var _cObs=new MutationObserver(function(mutations){
    var found=false;
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType!==1)return;
        if((n.matches&&n.matches('.niveau-card,.theme-check,.notion-card'))||
           (n.querySelector&&n.querySelector('.niveau-card,.theme-check,.notion-card')))
          found=true;
      });
    });
    if(found) setTimeout(_runCards,100);
  });

  var _tObs=new MutationObserver(function(){_month=-1;_apply();});

  function _init(){
    _cObs.observe(document.body,{childList:true,subtree:true});
    _tObs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    _apply();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',_init);
  } else {_init();}

})();
