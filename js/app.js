/**
 * MathPratik – Application JavaScript v4
 * Architecture : chargement dynamique de fichiers JSON par thématique
 * Mode : Examen uniquement (retour à zéro si erreur)
 * Compatible GitHub Pages · 0 dépendance · RGPD
 */

'use strict';

// ══════════════════════════════════════════════════════
//  REGISTRE DES DONNÉES (chargé dynamiquement)
// ══════════════════════════════════════════════════════
const DB = {
  niveaux:   {},
  questions: {}
};

// ══════════════════════════════════════════════════════
//  ÉTAT DE L'APPLICATION
// ══════════════════════════════════════════════════════
const State = {
  currentNiveau:   null,
  selectedThemes:  [],
  selectedMode:    'examen',
  quizQuestions:   [],
  currentQIndex:   0,
  sessionCorrect:  0,
  sessionTotal:    0,
  answered:        false,
  sessionResults:  [], // true/false par question dans l'ordre
};

let currentNiveau = null;

// ══════════════════════════════════════════════════════
//  CHARGEMENT DYNAMIQUE DES DONNÉES
// ══════════════════════════════════════════════════════

/**
 * Calcule l'URL de base de l'application.
 * Fonctionne en local (file://, localhost) ET sur GitHub Pages
 * (ex: https://user.github.io/MonRepo/).
 * On se base sur l'emplacement réel de index.html, pas sur l'origine seule.
 */
function baseUrl() {
  const loc = window.location.href.split('?')[0].split('#')[0];
  return loc.endsWith('/') ? loc : loc.substring(0, loc.lastIndexOf('/') + 1);
}

function appFetch(path) {
  // path = 'data/index.json' → URL absolue correcte quelle que soit la base
  return fetch(baseUrl() + path);
}

async function loadAllData() {
  showScreen('screen-loading');
  try {
    const indexRes = await appFetch('data/index.json');
    if (!indexRes.ok) throw new Error('Impossible de charger data/index.json (HTTP ' + indexRes.status + ')');
    const index = await indexRes.json();

    DB.niveaux = index.niveaux || {};
    Object.keys(DB.niveaux).forEach(nv => { DB.questions[nv] = {}; });

    // Notions automatismes : stockées séparément, fichiers chargés à la demande
    DB.automatismesNotions = index.automatismes_notions || [];

    const fichiers = index.fichiers || [];

    // Exposer l'index pour le module enseignant
    window._indexData = index;

    await Promise.all(fichiers.map(f => chargerFichierThematique(f)));

    renderHome();
    showScreen('screen-home');
  } catch (err) {
    console.error('MathPratik :', err);
    afficherErreurChargement(err.message);
  }
}

async function chargerFichierThematique(meta) {
  const res = await appFetch(meta.fichier);
  if (!res.ok) throw new Error(`Impossible de charger ${meta.fichier}`);
  const data = await res.json();

  const nv = meta.niveau || data.niveau;
  if (!nv || !DB.niveaux[nv]) {
    console.warn(`MathPratik : niveau inconnu "${nv}" dans ${meta.fichier}`);
    return;
  }

  const th = data.thematique;
  if (!th || !th.id) {
    console.warn(`MathPratik : champ "thematique" manquant dans ${meta.fichier}`);
    return;
  }

  // Comportement standard
  const questions = (data.questions || []).map(q => ({
    ...q,
    difficulte: q.niveau || 1,
    choix:      q.choix || [],
    _theme:     th.label,
    _icon:      th.icon,
  }));

  DB.questions[nv][th.id] = {
    label:     th.label,
    icon:      th.icon,
    color:     th.color || '#6b7280',
    questions,
  };
}

function afficherErreurChargement(msg) {
  const loader = document.getElementById('screen-loading');
  if (loader) {
    loader.innerHTML = `
      <div style="padding:40px 24px;font-family:sans-serif;text-align:center;max-width:400px;margin:0 auto;">
        <div style="font-size:2.5rem;margin-bottom:16px;">⚠️</div>
        <h2 style="margin-bottom:12px;color:var(--tx);">Erreur de chargement</h2>
        <p style="color:var(--err);font-size:0.88rem;margin-bottom:16px;background:var(--err-bg);padding:10px 14px;border-radius:8px;font-family:monospace;text-align:left;word-break:break-all;">${escapeHtml(msg)}</p>
        <p style="color:var(--tx3);font-size:0.82rem;line-height:1.7;text-align:left;">
          Causes fréquentes sur GitHub Pages :<br/>
          • Les fichiers JSON ne sont pas commités<br/>
          • Le dépôt n'est pas encore déployé (attendre ~1 min)<br/>
          • URL du site incorrecte dans les paramètres Pages<br/><br/>
          URL détectée : <code style="font-size:0.78rem;">${escapeHtml(baseUrl())}</code>
        </p>
        <button onclick="location.reload()" style="margin-top:20px;padding:12px 28px;background:var(--ac);color:#fff;border:none;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;">
          🔄 Réessayer
        </button>
      </div>`;
    loader.style.display = 'block';
    loader.classList.add('active');
  }
}

// ══════════════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  if (el) {
    el.style.display = 'block';
    requestAnimationFrame(() => el.classList.add('active'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function showHome() {
  currentNiveau = null;
  State.currentNiveau = null;
  renderHome();
  showScreen('screen-home');
}

function showSelect(niveau) {
  const nv = niveau || State.currentNiveau;
  if (!nv) return showHome();
  currentNiveau = nv;
  State.currentNiveau = nv;

  // Automatismes : écran de sélection dédié avec les 36 notions
  if (nv === 'automatismes') {
    renderSelectAutomatismes();
    showScreen('screen-select');
    return;
  }

  renderSelect(nv);
  showScreen('screen-select');
}

function showNotions(niveau) { showSelect(niveau); }
function goBack()   { showHome(); }
function quitQuiz() {
  if (State.currentNiveau === 'automatismes') {
    renderSelectAutomatismes();
    showScreen('screen-select');
  } else {
    showSelect(State.currentNiveau);
  }
}

// ══════════════════════════════════════════════════════
//  RENDU — ACCUEIL
// ══════════════════════════════════════════════════════
function renderHome() {
  const grid = document.getElementById('niveau-grid');
  grid.innerHTML = '';

  Object.entries(DB.niveaux).forEach(([key, meta]) => {

    // Cas spécial : automatismes — fichiers chargés à la demande, on affiche
    // la carte dès que la liste des notions est connue dans DB.automatismesNotions
    if (key === 'automatismes') {
      const nb = (DB.automatismesNotions || []).length;
      if (nb === 0) return;
      grid.insertAdjacentHTML('beforeend', `
        <div class="niveau-card" style="--nc:${meta.couleur}" onclick="showSelect('${key}')">
          <div class="nv-info" style="padding-left:4px;">
            <h2>${escapeHtml(meta.label)}</h2>
          </div>
          <div class="nv-right">
            <span class="nv-arrow">›</span>
          </div>
        </div>
      `);
      return;
    }

    const notions = DB.questions[key] || {};
    if (Object.keys(notions).length === 0) return;

    grid.insertAdjacentHTML('beforeend', `
      <div class="niveau-card" style="--nc:${meta.couleur}" onclick="showSelect('${key}')">
        <div class="nv-info" style="padding-left:4px;">
          <h2>${escapeHtml(meta.label)}</h2>
        </div>
        <div class="nv-right">
          <span class="nv-arrow">›</span>
        </div>
      </div>
    `);
  });

  if (grid.innerHTML === '') {
    grid.innerHTML = `
      <div style="padding:32px 0;text-align:center;color:var(--tx3);font-size:0.88rem;line-height:1.6;">
        Aucune thématique disponible.<br/>
        Ajoutez des fichiers JSON dans <code>data/</code><br/>
        et déclarez-les dans <code>data/index.json</code>.
      </div>`;
  }
}

// ══════════════════════════════════════════════════════
//  RENDU — SÉLECTION MODE + THÈMES
// ══════════════════════════════════════════════════════
function renderSelect(niveau) {
  const meta    = DB.niveaux[niveau] || { label: niveau, emoji: '', couleur: '#6b7280' };
  const notions = DB.questions[niveau] || {};

  State.selectedThemes = [];
  State.currentNiveau  = niveau;
  currentNiveau        = niveau;

  document.getElementById('select-badge').textContent = `${meta.emoji || ''} ${meta.label}`;
  document.getElementById('select-title').textContent = meta.label;
  document.getElementById('select-sub').textContent   = 'Sélectionne un ou plusieurs thèmes';

  const grid = document.getElementById('themes-grid');
  grid.innerHTML = '';

  Object.entries(notions).forEach(([key, notion]) => {
    const qids     = notion.questions.map(q => q.id);
    const isChecked = State.selectedThemes.includes(key);

    const div = document.createElement('div');
    div.className     = 'theme-check' + (isChecked ? ' checked' : '');
    div.style.cssText = '--notion-color:' + notion.color;
    div.dataset.key   = key;
    div.innerHTML = `
      <div class="theme-checkbox"></div>
      <span class="theme-icon-sm">${notion.icon || '📐'}</span>
      <div class="theme-label">
        <div class="name">${escapeHtml(notion.label)}</div>
        <div class="meta">${qids.length} questions</div>
      </div>
    `;
    div.addEventListener('click', () => toggleTheme(key));
    grid.appendChild(div);
  });

  if (grid.innerHTML === '') {
    grid.innerHTML = `<p style="color:var(--tx3);font-size:0.85rem;padding:16px 0;">Aucune thématique pour ce niveau.</p>`;
  }

  updateLaunchBtn();
}

// ══════════════════════════════════════════════════════
//  LOGIQUE SÉLECTION
// ══════════════════════════════════════════════════════
function toggleTheme(key) {
  const idx = State.selectedThemes.indexOf(key);
  if (idx === -1) State.selectedThemes.push(key);
  else State.selectedThemes.splice(idx, 1);
  const card = document.querySelector(`.theme-check[data-key="${CSS.escape(key)}"]`);
  if (card) card.classList.toggle('checked', State.selectedThemes.includes(key));
  updateLaunchBtn();
}

function updateLaunchBtn() {
  const n   = State.selectedThemes.length;
  const btn = document.getElementById('btn-launch');
  const counter = document.getElementById('themes-count');

  counter.textContent = n > 0 ? `— ${n} sélectionné${n > 1 ? 's' : ''}` : '';

  if (n === 0) {
    btn.className   = 'btn-launch disabled';
    btn.textContent = '☝️ Choisir au moins 1 thème ci-dessus';
  } else {
    btn.className   = 'btn-launch ready';
    btn.textContent = `🏆 Lancer l'examen · 15 questions`;
  }
}

// ══════════════════════════════════════════════════════
//  AUTOMATISMES — SÉLECTION ET LANCEMENT
// ══════════════════════════════════════════════════════
function renderSelectAutomatismes() {
  const meta = DB.niveaux['automatismes'] || { label: 'Automatismes', emoji: '⚡', couleur: '#7c3aed' };

  // Toujours réinitialiser la sélection à chaque retour sur cet écran
  State.selectedThemes = [];
  State.currentNiveau  = 'automatismes';
  currentNiveau        = 'automatismes';

  document.getElementById('select-badge').textContent = `${meta.emoji || '⚡'} ${meta.label}`;
  document.getElementById('select-title').textContent = meta.label;
  document.getElementById('select-sub').textContent   = 'Coche les notions à réviser';

  const grid = document.getElementById('themes-grid');
  grid.innerHTML = '';

  DB.automatismesNotions.forEach(notion => {
    const key       = notion.id;
    const isChecked = State.selectedThemes.includes(key);

    const div = document.createElement('div');
    div.className     = 'theme-check' + (isChecked ? ' checked' : '');
    div.style.cssText = '--notion-color:' + (notion.color || '#7c3aed');
    div.dataset.key   = key;
    div.innerHTML = `
      <div class="theme-checkbox"></div>
      <span class="theme-icon-sm">${notion.icon || '📐'}</span>
      <div class="theme-label">
        <div class="name">${escapeHtml(notion.label)}</div>
        <div class="meta">${notion.nb_questions || 30} questions</div>
      </div>
    `;
    div.addEventListener('click', () => toggleThemeAutomatismes(key));
    grid.appendChild(div);
  });

  updateLaunchBtnAutomatismes();
}

function toggleThemeAutomatismes(key) {
  const idx = State.selectedThemes.indexOf(key);
  if (idx === -1) State.selectedThemes.push(key);
  else State.selectedThemes.splice(idx, 1);
  const card = document.querySelector(`.theme-check[data-key="${CSS.escape(key)}"]`);
  if (card) card.classList.toggle('checked', State.selectedThemes.includes(key));
  updateLaunchBtnAutomatismes();
}

function updateLaunchBtnAutomatismes() {
  const n   = State.selectedThemes.length;
  const btn = document.getElementById('btn-launch');
  const counter = document.getElementById('themes-count');

  counter.textContent = n > 0 ? `— ${n} notion${n > 1 ? 's' : ''}` : '';

  if (n === 0) {
    btn.className   = 'btn-launch disabled';
    btn.textContent = '☝️ Choisir au moins 1 notion ci-dessus';
    btn.onclick     = null;
  } else {
    btn.className   = 'btn-launch ready';
    btn.textContent = `🏆 Lancer l'examen · 15 questions`;
    btn.onclick     = launchAutomatismes;
  }
}

async function launchAutomatismes() {
  if (State.selectedThemes.length === 0) return;

  showScreen('screen-loading');

  // Charger uniquement les fichiers des notions cochées pas encore en mémoire
  const toLoad = State.selectedThemes.filter(
    key => !DB.questions['automatismes'][key]
  );

  try {
    await Promise.all(toLoad.map(key => {
      const notion = DB.automatismesNotions.find(n => n.id === key);
      if (!notion) return Promise.resolve();
      return chargerFichierThematique({ fichier: notion.fichier, niveau: 'automatismes' });
    }));
  } catch (err) {
    afficherErreurChargement(err.message);
    return;
  }

  State.quizQuestions  = buildQuestionPool();
  State.currentQIndex  = 0;
  State.sessionCorrect = 0;
  State.sessionTotal   = 0;
  State.answered       = false;
  State.sessionResults = [];

  const banner = document.getElementById('exam-banner');
  banner.classList.remove('hidden');

  const n = State.selectedThemes.length;
  document.getElementById('quiz-notion-name').textContent =
    n === 1
      ? ((DB.questions['automatismes'] || {})[State.selectedThemes[0]] || {}).label || '—'
      : `${n} notion${n > 1 ? 's' : ''}`;
  document.getElementById('q-total').textContent = State.quizQuestions.length;

  showScreen('screen-quiz');
  renderQuestion();
}

// ══════════════════════════════════════════════════════
//  TIRAGE DES 15 QUESTIONS
// ══════════════════════════════════════════════════════
function buildQuestionPool() {
  const niveau = State.currentNiveau;
  const themes = State.selectedThemes;
  let pool1 = [], pool2 = [], pool3 = [];

  themes.forEach(themeKey => {
    const notion = (DB.questions[niveau] || {})[themeKey];
    if (!notion) return;
    notion.questions.forEach(q => {
      const d = q.difficulte || 1;
      if (d === 1)      pool1.push(q);
      else if (d === 2) pool2.push(q);
      else              pool3.push(q);
    });
  });

  shuffle(pool1); shuffle(pool2); shuffle(pool3);

  const pick = (arr, n) => arr.slice(0, n);
  let sel1 = pick(pool1, 7);
  let sel2 = pick(pool2, 7);
  let sel3 = pick(pool3, 1);

  if (sel1.length < 7) sel1 = [...sel1, ...pick(pool2, 7 - sel1.length)];
  if (sel2.length < 7) sel2 = [...sel2, ...pick(pool1, 7 - sel2.length)];
  if (sel3.length < 1) sel3 = pick([...pool2, ...pool1], 1);

  return [...sel1, ...sel2, ...sel3].slice(0, 15);
}

// ══════════════════════════════════════════════════════
//  LANCER LE QUIZ
// ══════════════════════════════════════════════════════
function launchQuiz() {
  if (State.selectedThemes.length === 0) return;

  State.quizQuestions  = buildQuestionPool();
  State.currentQIndex  = 0;
  State.sessionCorrect = 0;
  State.sessionTotal   = 0;
  State.answered       = false;
  State.sessionResults = [];

  const banner = document.getElementById('exam-banner');
  banner.classList.remove('hidden');

  const notion = State.selectedThemes.length === 1
    ? ((DB.questions[State.currentNiveau] || {})[State.selectedThemes[0]] || {}).label || '—'
    : `${State.selectedThemes.length} thèmes`;
  document.getElementById('quiz-notion-name').textContent = notion;
  document.getElementById('q-total').textContent = State.quizQuestions.length;

  showScreen('screen-quiz');
  renderQuestion();
}

function retryQuiz() { launchQuiz(); }
function retryExam()  {
  // Sécurité : si l'état a été perdu (ex. rechargement partiel),
  // retourner à la sélection plutôt que de bloquer silencieusement
  if (State.selectedThemes.length === 0) {
    showSelect(State.currentNiveau);
    return;
  }
  launchQuiz();
}

// ══════════════════════════════════════════════════════
//  RENDU QUESTION
// ══════════════════════════════════════════════════════
function renderQuestion() {
  const q     = State.quizQuestions[State.currentQIndex];
  const total = State.quizQuestions.length;
  const idx   = State.currentQIndex + 1;
  State.answered = false;

  document.getElementById('quiz-progress').style.width = ((idx - 1) / total * 100) + '%';
  document.getElementById('q-num').textContent         = idx;
  document.getElementById('quiz-score-live').textContent =
    `${State.sessionCorrect}/${State.sessionTotal}`;

  document.getElementById('q-tag').textContent =
    `${q._icon || '📐'} ${q._theme || ''}`;

  // Pour les types visuels, adapter l'énoncé affiché
  const qtextEl = document.getElementById('q-text');
  if (q.type === 'diviseurs_multi') {
    setMathText(qtextEl, q.enonce);
  } else if (q.type === 'tableau_proportionnalite') {
    setMathText(qtextEl, 'Complète le tableau de proportionnalité :');
  } else if (q.type === 'programme_calcul') {
    setMathText(qtextEl, q.question_type === 'litterale'
      ? 'Quelle expression le programme produit-il ?'
      : 'Applique le programme et trouve le résultat :');
  } else if (q.enonce_html) {
    // Support HTML enrichi dans l'énoncé (tableaux, formules, etc.)
    qtextEl.innerHTML = q.enonce_html;
    renderMath(qtextEl);
  } else {
    setMathText(qtextEl, q.enonce);
  }

  // Image optionnelle
  const imgWrap = document.getElementById('q-image-wrap');
  if (imgWrap) {
    let imgHtml = '';
    if (q.image) {
      imgHtml += `<img src="images/${escapeHtml(q.image)}" alt="Illustration" loading="lazy" style="max-width:100%;border-radius:8px;margin-top:12px;" />`;
    }
    // Calculatrice intégrée pour les questions non-calcul mental
    if (q.avec_calculatrice) {
      imgHtml += buildCalculatrice();
    }
    if (imgHtml) {
      imgWrap.innerHTML = imgHtml;
      imgWrap.style.display = 'block';
    } else {
      imgWrap.innerHTML = '';
      imgWrap.style.display = 'none';
    }
  }

  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback-box';
  document.getElementById('btn-next').classList.remove('visible');

  const list = document.getElementById('choices-list');
  list.innerHTML = '';

  // ── Dispatch selon le type de question ──
  if (q.type === 'diviseurs_multi') {
    renderDiviseursMulti(q, list);
  } else if (q.type === 'tableau_proportionnalite') {
    renderTableauProportion(q, list);
  } else if (q.type === 'programme_calcul') {
    renderProgrammeCalcul(q, list);
  } else {
    // QCM classique
    const choixMelanges = shuffle([...q.choix]);
    const letters = ['A', 'B', 'C', 'D'];
    choixMelanges.forEach((choix, i) => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.dataset.val = choix;
      // Lettre + texte du choix (KaTeX rendu après injection)
      const letterSpan = document.createElement('span');
      letterSpan.className = 'choice-letter';
      letterSpan.textContent = letters[i];
      const textSpan = document.createElement('span');
      textSpan.textContent = choix;
      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);
      renderMath(textSpan);
      btn.addEventListener('click', () => handleAnswer(choix, q));
      list.appendChild(btn);
    });
  }
}

// ══════════════════════════════════════════════════════
//  TYPE : DIVISEURS MULTI-SÉLECTION
// ══════════════════════════════════════════════════════
function renderDiviseursMulti(q, container) {
  const wrap = document.createElement('div');
  wrap.className = 'divmulti-wrap';

  // Nombre affiché en grand
  const nombreBig = document.createElement('div');
  nombreBig.className = 'divmulti-nombre';
  nombreBig.textContent = q.nombre_affiche || q.nombre;
  wrap.appendChild(nombreBig);

  // Instruction
  const hint = document.createElement('div');
  hint.className = 'divmulti-hint';
  hint.innerHTML = 'Coche <strong>tous</strong> les diviseurs, puis valide.';
  wrap.appendChild(hint);

  // Grille de boutons diviseurs
  const grille = document.createElement('div');
  grille.className = 'divmulti-grille';

  q.diviseurs_proposes.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'divmulti-btn';
    btn.dataset.val = String(d);
    btn.innerHTML = `<span class="divmulti-op">÷</span><span class="divmulti-num">${d}</span>`;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      if (State.answered) return;
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      btn.classList.toggle('selected', !pressed);
    });
    grille.appendChild(btn);
  });

  wrap.appendChild(grille);

  // Bouton valider
  const btnVal = document.createElement('button');
  btnVal.className = 'divmulti-valider';
  btnVal.innerHTML = '<span>✓</span> Valider ma sélection';
  btnVal.addEventListener('click', () => {
    if (State.answered) return;
    const sel = [...grille.querySelectorAll('.divmulti-btn.selected')]
      .map(b => parseInt(b.dataset.val));
    const bons = q.reponse.map(Number);
    const selStr = [...sel].sort((a,b)=>a-b).join(',');
    const repStr = [...bons].sort((a,b)=>a-b).join(',');
    handleAnswerDiviseursMulti(selStr === repStr, q, grille, bons, sel);
  });
  wrap.appendChild(btnVal);

  container.appendChild(wrap);
}

function handleAnswerDiviseursMulti(isCorrect, question, grille, bons, sel) {
  if (State.answered) return;
  State.answered = true;
  State.sessionTotal += 1;
  if (isCorrect) State.sessionCorrect += 1;
  State.sessionResults[State.currentQIndex] = isCorrect;

  grille.querySelectorAll('.divmulti-btn').forEach(btn => {
    btn.disabled = true;
    const val = parseInt(btn.dataset.val);
    const estBon     = bons.includes(val);
    const etaitCoche = sel.includes(val);

    if (estBon && etaitCoche)  { btn.classList.add('div-ok');     btn.classList.remove('selected'); }
    else if (estBon)           { btn.classList.add('div-manque'); btn.classList.remove('selected'); }
    else if (etaitCoche)       { btn.classList.add('div-wrong');  btn.classList.remove('selected'); }
    else                       { btn.classList.add('div-neutre'); }
  });

  // Légende résultat
  const legend = document.createElement('div');
  legend.className = 'divmulti-legend';
  legend.innerHTML = `
    <span class="leg-item leg-ok">✓ Bon diviseur coché</span>
    <span class="leg-item leg-manque">○ Oublié</span>
    <span class="leg-item leg-wrong">✗ Pas diviseur</span>`;
  grille.parentElement.insertBefore(legend, grille.nextSibling);

  afficherFeedback(isCorrect, question);
}

// ══════════════════════════════════════════════════════
//  TYPE : TABLEAU DE PROPORTIONNALITÉ
// ══════════════════════════════════════════════════════
function renderTableauProportion(q, container) {
  const t = q.tableau;

  const tableWrap = document.createElement('div');
  tableWrap.className = 'proportion-wrap';

  // Badge coefficient si présent
  if (t.coeff) {
    const coeffBadge = document.createElement('div');
    coeffBadge.className = 'proportion-coeff';
    coeffBadge.innerHTML = `Coefficient de proportionnalité : <strong>×${escapeHtml(t.coeff)}</strong>`;
    tableWrap.appendChild(coeffBadge);
  }

  const table = document.createElement('table');
  table.className = 'proportion-table';
  const tbody = document.createElement('tbody');

  const tr1 = document.createElement('tr');
  const th1 = document.createElement('th');
  th1.textContent = t.lignes[0];
  tr1.appendChild(th1);

  const tr2 = document.createElement('tr');
  const th2 = document.createElement('th');
  th2.textContent = t.lignes[1];
  tr2.appendChild(th2);

  if (t.valeurs && t.valeurs.length >= 2) {
    const nbCols = t.valeurs[0].length;
    for (let col = 0; col < nbCols; col++) {
      const val1 = t.valeurs[0][col];
      const val2 = t.valeurs[1][col];

      const td1 = document.createElement('td');
      if (val1 === '?') { td1.className = 'case-inconnue'; td1.textContent = '?'; }
      else { td1.textContent = val1; }
      tr1.appendChild(td1);

      const td2 = document.createElement('td');
      if (val2 === '?') { td2.className = 'case-inconnue'; td2.textContent = '?'; }
      else { td2.textContent = val2; }
      tr2.appendChild(td2);
    }
  }

  tbody.appendChild(tr1);
  tbody.appendChild(tr2);
  table.appendChild(tbody);
  tableWrap.appendChild(table);

  const qLabel = document.createElement('div');
  qLabel.className = 'proportion-qlabel';
  qLabel.textContent = 'Quelle est la valeur manquante ( ? ) ?';
  tableWrap.appendChild(qLabel);

  container.appendChild(tableWrap);

  // QCM classique en dessous
  const choixMelanges = shuffle([...q.choix]);
  const letters = ['A', 'B', 'C', 'D'];
  choixMelanges.forEach((choix, i) => {
    const btn = document.createElement('button');
    btn.className   = 'choice-btn';
    btn.dataset.val = choix;
    btn.innerHTML   = `<span class="choice-letter">${letters[i]}</span><span>${escapeHtml(choix)}</span>`;
    btn.addEventListener('click', () => handleAnswer(choix, q));
    container.appendChild(btn);
  });
}

// ══════════════════════════════════════════════════════
//  TYPE : PROGRAMME DE CALCUL
// ══════════════════════════════════════════════════════
function renderProgrammeCalcul(q, container) {
  const prog = q.programme;

  // Encadré visuel du programme
  const progWrap = document.createElement('div');
  progWrap.className = 'programme-wrap';

  const progTitle = document.createElement('div');
  progTitle.className = 'programme-title';
  progTitle.textContent = `Programme ${prog.lettre}`;
  progWrap.appendChild(progTitle);

  // Ligne de flow : [Choisir un nombre] → [étape 1] → [étape 2] → [Résultat]
  const flowDiv = document.createElement('div');
  flowDiv.className = 'programme-flow';

  const etapes = [
    { label: 'Choisir\nun nombre', type: 'start' },
    ...prog.etapes.map(e => ({ label: e, type: 'step' })),
    { label: 'Résultat', type: 'end' }
  ];

  etapes.forEach((etape, i) => {
    const box = document.createElement('div');
    box.className = `prog-box prog-box--${etape.type}`;
    box.textContent = etape.label;
    flowDiv.appendChild(box);

    if (i < etapes.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'prog-arrow';
      arrow.textContent = '→';
      flowDiv.appendChild(arrow);
    }
  });

  progWrap.appendChild(flowDiv);

  // Afficher la valeur testée si question numérique
  if (q.question_type === 'numerique' && q.valeur_n !== undefined) {
    const nLabel = document.createElement('div');
    nLabel.className = 'programme-n-label';
    nLabel.innerHTML = `On choisit le nombre <strong>${q.valeur_n}</strong>`;
    progWrap.appendChild(nLabel);
  } else if (q.question_type === 'litterale') {
    const nLabel = document.createElement('div');
    nLabel.className = 'programme-n-label';
    nLabel.innerHTML = `On choisit la lettre <strong>${prog.variable}</strong>. Quelle est l'expression obtenue ?`;
    progWrap.appendChild(nLabel);
  }

  container.appendChild(progWrap);

  // QCM classique
  const choixMelanges = shuffle([...q.choix]);
  const letters = ['A', 'B', 'C', 'D'];
  choixMelanges.forEach((choix, i) => {
    const btn = document.createElement('button');
    btn.className   = 'choice-btn';
    btn.dataset.val = choix;
    btn.innerHTML   = `<span class="choice-letter">${letters[i]}</span><span>${escapeHtml(choix)}</span>`;
    btn.addEventListener('click', () => handleAnswer(choix, q));
    container.appendChild(btn);
  });
}

// ══════════════════════════════════════════════════════
//  FEEDBACK PARTAGÉ (diviseurs + autres types futurs)
// ══════════════════════════════════════════════════════
function afficherFeedback(isCorrect, question) {
  const fb = document.getElementById('feedback-box');
  if (isCorrect) {
    fb.className = 'feedback-box correct';
    document.getElementById('feedback-icon').textContent  = '✓';
    document.getElementById('feedback-title').textContent = 'Bonne réponse !';
  } else {
    fb.className = 'feedback-box wrong';
    document.getElementById('feedback-icon').textContent  = '✗';
    document.getElementById('feedback-title').textContent = '✗ Erreur — Retour à zéro !';
    document.querySelector('.question-card').classList.add('shake');
    setTimeout(() => document.querySelector('.question-card').classList.remove('shake'), 450);
  }
  setMathText(document.getElementById('feedback-text'), question.explication || '');
  document.getElementById('quiz-score-live').textContent =
    `${State.sessionCorrect}/${State.sessionTotal}`;

  const btnNext = document.getElementById('btn-next');
  btnNext.classList.add('visible');
  const isLast = State.currentQIndex >= State.quizQuestions.length - 1;
  if (!isCorrect) {
    btnNext.textContent = '→ Recommencer';
  } else if (isLast) {
    btnNext.textContent = 'Voir les résultats →';
  } else {
    btnNext.textContent = 'Suivant →';
  }
}

// ══════════════════════════════════════════════════════
//  TRAITEMENT RÉPONSE
// ══════════════════════════════════════════════════════
function handleAnswer(chosen, question) {
  if (State.answered) return;
  State.answered = true;
  State.sessionTotal += 1;

  const isCorrect = chosen === question.reponse;
  if (isCorrect) State.sessionCorrect += 1;
  State.sessionResults[State.currentQIndex] = isCorrect;

  // Révéler la case ? dans le tableau de proportionnalité
  if (question.type === 'tableau_proportionnalite') {
    document.querySelectorAll('.case-inconnue').forEach(td => {
      td.textContent = question.reponse;
      td.classList.add(isCorrect ? 'case-resolue-ok' : 'case-resolue-ko');
    });
  }

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    const val = btn.dataset.val;
    if (val === question.reponse)          btn.classList.add('correct');
    else if (val === chosen && !isCorrect) btn.classList.add('wrong');
    else                                   btn.classList.add('missed');
  });

  const fb = document.getElementById('feedback-box');
  if (isCorrect) {
    fb.className = 'feedback-box correct';
    document.getElementById('feedback-icon').textContent  = '✓';
    document.getElementById('feedback-title').textContent = 'Bonne réponse !';
  } else {
    fb.className = 'feedback-box wrong';
    document.getElementById('feedback-icon').textContent  = '✗';
    document.getElementById('feedback-title').textContent = '✗ Erreur — Retour à zéro !';
    document.querySelector('.question-card').classList.add('shake');
    setTimeout(() => document.querySelector('.question-card').classList.remove('shake'), 450);
  }
  setMathText(document.getElementById('feedback-text'), question.explication || '');
  document.getElementById('quiz-score-live').textContent = `${State.sessionCorrect}/${State.sessionTotal}`;

  const btnNext = document.getElementById('btn-next');
  btnNext.classList.add('visible');
  const isLast = State.currentQIndex >= State.quizQuestions.length - 1;

  if (!isCorrect) {
    btnNext.textContent = '→ Recommencer';
  } else if (isLast) {
    btnNext.textContent = 'Voir les résultats →';
  } else {
    btnNext.textContent = 'Suivant →';
  }
}

// ══════════════════════════════════════════════════════
//  NAVIGATION QUIZ
// ══════════════════════════════════════════════════════
function nextQuestion() {
  const fb = document.getElementById('feedback-box');
  if (fb.classList.contains('wrong')) {
    const q = State.quizQuestions[State.currentQIndex];
    // Compatibilité : certaines questions utilisent enonce_html sans enonce
    const enonceTexte = q.enonce
      ? q.enonce.substring(0, 80)
      : (q.enonce_html
          ? q.enonce_html.replace(/<[^>]*>/g, '').substring(0, 80)
          : '—');
    setMathText(
      document.getElementById('fail-question-preview'),
      `Bloqué à la question ${State.currentQIndex + 1} : ${enonceTexte}…`
    );
    showScreen('screen-exam-fail');
    return;
  }
  if (State.currentQIndex >= State.quizQuestions.length - 1) {
    showResults();
    return;
  }
  State.currentQIndex += 1;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════
//  RÉSULTATS
// ══════════════════════════════════════════════════════
function showResults() {
  const score = State.sessionCorrect;
  const total = State.sessionTotal;
  const pct   = Math.round((score / total) * 100);

  let emoji, title, sub;
  if (pct === 100)     { emoji = '🏆'; title = 'Examen réussi !'; sub = 'Toutes les questions sans erreur !'; }
  else if (pct >= 70)  { emoji = '🎉'; title = 'Très bien !';     sub = 'Continue comme ça !'; }
  else if (pct >= 50)  { emoji = '💪'; title = 'Pas mal !';       sub = 'Encore un peu de travail…'; }
  else                 { emoji = '📚'; title = 'À réviser…';      sub = 'Relis ta leçon et réessaie !'; }

  document.getElementById('result-emoji').textContent     = emoji;
  document.getElementById('result-title').textContent     = title;
  document.getElementById('result-subtitle').textContent  = sub;
  document.getElementById('result-score-num').textContent = `${score}/${total}`;

  const circ   = 270.2;
  const offset = circ - (pct / 100) * circ;
  const circle = document.getElementById('score-circle');
  circle.style.strokeDashoffset = circ;
  setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);

  const list = document.getElementById('result-list');
  list.innerHTML = '';
  State.quizQuestions.forEach((q, i) => {
    const wasOk = State.sessionResults[i] === true;
    const item = document.createElement('div');
    item.className = 'result-item';
    const dot = document.createElement('div');
    dot.className = `result-dot ${wasOk ? 'ok' : 'ko'}`;
    dot.textContent = wasOk ? '✓' : '✗';
    const textDiv = document.createElement('div');
    textDiv.className = 'result-item-text';
    const strong = document.createElement('strong');
    // Compatibilité : certaines questions utilisent enonce_html sans enonce
    const enonceRaw = q.enonce
      ? q.enonce
      : (q.enonce_html ? q.enonce_html.replace(/<[^>]*>/g, '') : '—');
    const enonceText = `Q${i+1} : ${enonceRaw.substring(0, 65)}${enonceRaw.length > 65 ? '…' : ''}`;
    strong.textContent = enonceText;
    renderMath(strong);
    const repLine = document.createElement('span');
    const repText = Array.isArray(q.reponse) ? '÷' + q.reponse.join(', ÷') : q.reponse;
    repLine.textContent = 'Bonne réponse : ' + repText;
    renderMath(repLine);
    textDiv.appendChild(strong);
    textDiv.appendChild(document.createElement('br'));
    textDiv.appendChild(repLine);
    item.appendChild(dot);
    item.appendChild(textDiv);
    list.appendChild(item);
  });

  showScreen('screen-results');
}

// ══════════════════════════════════════════════════════
//  UTILITAIRES
// ══════════════════════════════════════════════════════
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

/**
 * renderMath(el)
 * Déclenche le rendu KaTeX sur un élément DOM.
 * Reconnaît les délimiteurs $...$ (inline) et $$...$$ (bloc).
 * Sans effet si KaTeX n'est pas encore chargé (sécurité).
 */
function renderMath(el) {
  if (!el || typeof window.renderMathInElement !== 'function') return;
  window.renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true  },
      { left: '$',  right: '$',  display: false }
    ],
    throwOnError: false   // ne jamais crasher si formule invalide
  });
}

/**
 * setMathText(el, text)
 * Équivalent de el.textContent = text MAIS avec rendu KaTeX automatique.
 * Utiliser partout à la place de textContent pour énoncés, choix, explications.
 */
function setMathText(el, text) {
  el.textContent = String(text);
  renderMath(el);
}

// ══════════════════════════════════════════════════════
//  CALCULATRICE INTÉGRÉE
// ══════════════════════════════════════════════════════
function buildCalculatrice() {
  return `
  <div class="calc-wrap" id="calc-widget">
    <div class="calc-header">🧮 Calculatrice</div>
    <div class="calc-screen-wrap">
      <div class="calc-expr" id="calc-expr"></div>
      <input class="calc-screen" id="calc-screen" type="text" readonly value="0" aria-label="Écran calculatrice" />
    </div>
    <div class="calc-grid">
      <button class="calc-btn calc-fn" onclick="calcAction('C')">C</button>
      <button class="calc-btn calc-fn" onclick="calcAction('CE')">⌫</button>
      <button class="calc-btn calc-fn" onclick="calcAction('%')">%</button>
      <button class="calc-btn calc-op" onclick="calcAction('/')">÷</button>

      <button class="calc-btn calc-fn" onclick="calcAction('sqrt')">√</button>
      <button class="calc-btn calc-fn" onclick="calcAction('sq')">x²</button>
      <button class="calc-btn calc-fn" onclick="calcAction('(')"> ( </button>
      <button class="calc-btn calc-fn" onclick="calcAction(')')">) </button>

      <button class="calc-btn" onclick="calcAction('7')">7</button>
      <button class="calc-btn" onclick="calcAction('8')">8</button>
      <button class="calc-btn" onclick="calcAction('9')">9</button>
      <button class="calc-btn calc-op" onclick="calcAction('*')">×</button>

      <button class="calc-btn" onclick="calcAction('4')">4</button>
      <button class="calc-btn" onclick="calcAction('5')">5</button>
      <button class="calc-btn" onclick="calcAction('6')">6</button>
      <button class="calc-btn calc-op" onclick="calcAction('-')">−</button>

      <button class="calc-btn" onclick="calcAction('1')">1</button>
      <button class="calc-btn" onclick="calcAction('2')">2</button>
      <button class="calc-btn" onclick="calcAction('3')">3</button>
      <button class="calc-btn calc-op" onclick="calcAction('+')">+</button>

      <button class="calc-btn calc-zero" onclick="calcAction('0')">0</button>
      <button class="calc-btn" onclick="calcAction('.')">.</button>
      <button class="calc-btn calc-eq" onclick="calcAction('=')">=</button>
    </div>
  </div>`;
}

const _calc = { expr: '', justEq: false };

function calcUpdateDisplay() {
  const screen = document.getElementById('calc-screen');
  const exprEl = document.getElementById('calc-expr');
  if (screen) screen.value = _calc.display || '0';
  if (exprEl) exprEl.textContent = _calc.expr || '';
}

function calcAction(key) {
  const screen = document.getElementById('calc-screen');
  if (!screen) return;

  if (key === 'C') {
    _calc.expr = ''; _calc.display = '0'; _calc.justEq = false;
    calcUpdateDisplay(); return;
  }
  if (key === 'CE') {
    // Supprimer dernier caractère de l'expression affichée
    if (_calc.justEq) { _calc.expr = ''; _calc.display = '0'; _calc.justEq = false; }
    else {
      // Supprimer aussi "sqrt(" si on est à la fin d'une fonction
      if (_calc.expr.endsWith('Math.sqrt(')) _calc.expr = _calc.expr.slice(0, -10);
      else _calc.expr = _calc.expr.slice(0, -1);
      _calc.display = _calc.expr || '0';
    }
    calcUpdateDisplay(); return;
  }
  if (key === '=') {
    try {
      const safe = _calc.expr.replace(/[^0-9+\-*/.()Math.sqrtpow ]/g, '');
      const computed = Function('"use strict"; return (' + _calc.expr + ')')();
      const result = isFinite(computed) ? parseFloat(computed.toFixed(10)).toString() : 'Erreur';
      _calc.display = result;
      _calc.expr = result;
      _calc.justEq = true;
    } catch { _calc.display = 'Erreur'; _calc.expr = ''; _calc.justEq = false; }
    calcUpdateDisplay(); return;
  }
  if (key === 'sqrt') {
    if (_calc.justEq) _calc.expr = '';
    _calc.expr += 'Math.sqrt(';
    _calc.display = _calc.expr;
    _calc.justEq = false;
    calcUpdateDisplay(); return;
  }
  if (key === 'sq') {
    if (_calc.justEq) {
      _calc.expr = 'Math.pow(' + _calc.expr + ',2)';
    } else if (_calc.expr) {
      _calc.expr = 'Math.pow(' + _calc.expr + ',2)';
    }
    _calc.display = _calc.expr;
    _calc.justEq = false;
    calcUpdateDisplay(); return;
  }

  const ops = ['+', '-', '*', '/'];
  if (_calc.justEq && !ops.includes(key) && key !== ')') _calc.expr = '';
  _calc.justEq = false;
  _calc.expr += key;
  _calc.display = _calc.expr;
  calcUpdateDisplay();
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllData);
} else {
  loadAllData();
}


// ══════════════════════════════════════════════════════
//  MODULE ENSEIGNANT
// ══════════════════════════════════════════════════════

const TEACHER_PIN = '1789';

const Teacher = {
  pin:          '',
  filterNiveau: 'all',
  currentNotion: null,   // { id, fichier, niveau, label, icon, color, questions[] }
  filteredQs:   [],
  qIndex:       0,
};

// ── LOGIN ────────────────────────────────────────────

function openTeacherLogin() {
  Teacher.pin = '';
  renderPinDisplay();
  document.getElementById('pin-error').textContent = '';
  document.getElementById('teacher-login-overlay').classList.add('open');
}

function closeTeacherLogin() {
  document.getElementById('teacher-login-overlay').classList.remove('open');
}

function teacherOverlayClose(e) {
  if (e.target === document.getElementById('teacher-login-overlay')) closeTeacherLogin();
}

function renderPinDisplay() {
  for (let i = 0; i < 4; i++) {
    const el = document.getElementById('pin-d' + i);
    if (Teacher.pin.length > i) {
      el.textContent = '●';
      el.classList.add('filled');
      el.classList.remove('error');
    } else {
      el.textContent = '·';
      el.classList.remove('filled', 'error');
    }
  }
}

function pinKey(k) {
  const errEl = document.getElementById('pin-error');
  if (k === 'del') {
    Teacher.pin = Teacher.pin.slice(0, -1);
    errEl.textContent = '';
    renderPinDisplay();
    return;
  }
  if (k === 'ok') {
    checkPin();
    return;
  }
  if (Teacher.pin.length < 4) {
    Teacher.pin += k;
    renderPinDisplay();
    if (Teacher.pin.length === 4) checkPin();
  }
}

function checkPin() {
  if (Teacher.pin === TEACHER_PIN) {
    closeTeacherLogin();
    showTeacherModule();
  } else {
    const errEl = document.getElementById('pin-error');
    errEl.textContent = 'Code incorrect — réessayer';
    for (let i = 0; i < 4; i++) {
      const el = document.getElementById('pin-d' + i);
      el.classList.add('error');
    }
    setTimeout(() => {
      Teacher.pin = '';
      renderPinDisplay();
      errEl.textContent = '';
    }, 900);
  }
}

// ── ÉCRAN LISTE DES NOTIONS ──────────────────────────

function showTeacherModule() {
  showScreen('screen-teacher');
  renderTeacherFilters();
  renderTeacherNotionList();
}

function closeTeacherModule() {
  showScreen('screen-home');
}

function renderTeacherFilters() {
  const container = document.getElementById('teacher-filters');
  const niveaux = DB.niveaux || {};
  const chips = [{ key: 'all', label: 'Tous les niveaux', emoji: '📚' }];
  Object.entries(niveaux).forEach(([k, v]) => {
    chips.push({ key: k, label: v.label, emoji: v.emoji || '' });
  });

  container.innerHTML = chips.map(c => `
    <button class="tf-chip ${Teacher.filterNiveau === c.key ? 'active' : ''}"
      onclick="teacherSetFilter('${c.key}')">
      ${c.emoji} ${c.label}
    </button>
  `).join('');
}

function teacherSetFilter(niveau) {
  Teacher.filterNiveau = niveau;
  renderTeacherFilters();
  renderTeacherNotionList();
}

function renderTeacherNotionList() {
  const container = document.getElementById('teacher-notion-list');
  const statsLine = document.getElementById('teacher-stats-line');

  const fichiers = (window._indexData && window._indexData.fichiers) || [];
  const allNotions = [];

  fichiers.forEach(f => {
    if (Teacher.filterNiveau !== 'all' && f.niveau !== Teacher.filterNiveau) return;
    const niveauData = DB.questions[f.niveau];
    if (!niveauData) return;
    // themeId = f.id (ex: pythagore_4eme)
    const data = niveauData[f.id];
    if (!data) return;
    allNotions.push({
      id:        f.id,
      fichier:   f.fichier,
      niveau:    f.niveau,
      label:     data.label,
      icon:      data.icon,
      color:     data.color || 'var(--ac)',
      questions: data.questions || [],
    });
  });

  const totalQ = allNotions.reduce((s, n) => s + n.questions.length, 0);
  statsLine.textContent = `${allNotions.length} notion${allNotions.length > 1 ? 's' : ''} · ${totalQ} questions`;

  if (allNotions.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--tx3);padding:32px 20px;font-size:0.88rem;">Aucune notion chargée pour ce filtre.</p>';
    return;
  }

  const grouped = {};
  allNotions.forEach(n => {
    if (!grouped[n.niveau]) grouped[n.niveau] = [];
    grouped[n.niveau].push(n);
  });

  const niveauLabels = DB.niveaux || {};
  let html = '';

  Object.entries(grouped).forEach(([niv, notions]) => {
    const nvData = niveauLabels[niv] || { label: niv, emoji: '' };
    html += `<div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--tx3);padding:12px 0 6px;">${nvData.emoji || ''} ${nvData.label}</div>`;
    notions.forEach(n => {
      const n1 = n.questions.filter(q => q.niveau === 1).length;
      const n2 = n.questions.filter(q => q.niveau === 2).length;
      const n3 = n.questions.filter(q => q.niveau === 3).length;
      const safeId = n.id.replace(/'/g, "\\'");
      html += `
        <div class="tn-card" style="--notion-color:${n.color}"
          onclick="openTeacherReader('${safeId}')">
          <div class="tn-icon">${n.icon}</div>
          <div class="tn-info">
            <div class="name">${n.label}</div>
            <div class="meta">${n.questions.length} questions · ★ ${n1} &nbsp;★★ ${n2} &nbsp;★★★ ${n3}</div>
          </div>
          <div class="tn-arrow">›</div>
        </div>`;
    });
  });

  container.innerHTML = html;
}

// ── LECTEUR DE QUESTIONS ─────────────────────────────

function openTeacherReader(notionId) {
  const fichiers = (window._indexData && window._indexData.fichiers) || [];
  const f = fichiers.find(x => x.id === notionId);
  if (!f) return;
  const niveauData = DB.questions[f.niveau];
  if (!niveauData) return;
  const data = niveauData[notionId];
  if (!data) return;

  Teacher.currentNotion = {
    id:        notionId,
    niveau:    f.niveau,
    label:     data.label,
    icon:      data.icon,
    color:     data.color || 'var(--ac)',
    questions: data.questions || [],
  };
  Teacher.filterLevel = 'all';
  Teacher.qIndex = 0;
  readerBuildFiltered();
  showScreen('screen-teacher-reader');
  renderReaderQuestion();
}

function readerBuildFiltered() {
  const all = Teacher.currentNotion ? Teacher.currentNotion.questions : [];
  if (!Teacher.filterLevel || Teacher.filterLevel === 'all') {
    Teacher.filteredQs = all.slice();
  } else {
    Teacher.filteredQs = all.filter(q => q.niveau === Teacher.filterLevel);
  }
  Teacher.qIndex = 0;
}

function readerSetLevel(lvl) {
  Teacher.filterLevel = lvl === 'all' ? 'all' : parseInt(lvl);
  readerBuildFiltered();
  // Update tabs
  document.querySelectorAll('.rlt-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lvl === String(lvl));
  });
  renderReaderQuestion();
}

function readerGo(delta) {
  const max = Teacher.filteredQs.length - 1;
  Teacher.qIndex = Math.max(0, Math.min(max, Teacher.qIndex + delta));
  renderReaderQuestion();
}

function renderReaderQuestion() {
  const qs = Teacher.filteredQs;
  const idx = Teacher.qIndex;
  const notion = Teacher.currentNotion;

  document.getElementById('reader-notion-title').textContent =
    (notion ? notion.icon + ' ' + notion.label : '—');

  document.getElementById('rnav-cur').textContent   = qs.length ? idx + 1 : 0;
  document.getElementById('rnav-total').textContent = qs.length;
  document.getElementById('rnav-prev').disabled     = idx <= 0;
  document.getElementById('rnav-next').disabled     = idx >= qs.length - 1;

  const content = document.getElementById('reader-content');

  if (!qs.length) {
    content.innerHTML = '<p style="text-align:center;color:var(--tx3);padding:32px;font-size:0.88rem;">Aucune question pour ce filtre.</p>';
    return;
  }

  const q = qs[idx];
  const letters = ['A', 'B', 'C', 'D'];
  const niveauLabel = ['', '★ Niveau 1', '★★ Niveau 2', '★★★ Niveau 3'];
  const niveauClass = ['', 'niv1', 'niv2', 'niv3'];

  const calcBadge = q.avec_calculatrice
    ? '<span class="reader-calc-badge">🖩 Calculatrice</span>' : '';

  const imageHtml = q.image
    ? `<img class="reader-image" src="images/${q.image}" alt="Illustration" loading="lazy">`
    : '';

  const enonceHtml = q.enonce_html || q.enonce || '';

  const choicesHtml = (q.choix || []).map((c, i) => {
    const isAns = c === q.reponse;
    return `<div class="reader-choice ${isAns ? 'is-answer' : ''}">
      <div class="reader-choice-letter">${letters[i]}</div>
      <div>${c}</div>
    </div>`;
  }).join('');

  content.innerHTML = `
    <div class="reader-q-header">
      <span class="reader-q-num">Question ${idx + 1} / ${qs.length}</span>
      <span class="reader-level-badge ${niveauClass[q.niveau] || ''}">${niveauLabel[q.niveau] || ''}</span>
      ${calcBadge}
    </div>

    <div class="reader-enonce">${enonceHtml}</div>
    ${imageHtml}
    <div class="reader-choices">${choicesHtml}</div>

    <div class="reader-explication">
      <strong>Explication</strong>
      ${q.explication || '<em>—</em>'}
    </div>

    <div class="reader-id-badge">ID : ${q.id || '—'}</div>

    <div class="reader-jump-row">
      <span class="reader-jump-label">Aller à la question :</span>
      <input type="number" class="reader-jump-input" id="reader-jump-input"
        min="1" max="${qs.length}" placeholder="${idx+1}">
      <button class="reader-jump-btn" onclick="readerJump()">Go</button>
    </div>
  `;

  // Rendu KaTeX
  if (window.renderMathInElement) {
    renderMathInElement(content, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false },
      ],
      throwOnError: false,
    });
  }

  // Scroll en haut du contenu
  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function readerJump() {
  const inp = document.getElementById('reader-jump-input');
  const val = parseInt(inp ? inp.value : '');
  if (!isNaN(val)) {
    Teacher.qIndex = Math.max(0, Math.min(Teacher.filteredQs.length - 1, val - 1));
    renderReaderQuestion();
  }
}

