/**
 * MathPratik – Application JavaScript v5
 * Architecture : chargement dynamique de fichiers JSON par thématique
 * Mode : Examen sans sanction (erreur signalée, quiz continue)
 * Compatible GitHub Pages · 0 dépendance · RGPD
 */

'use strict';

// Marqueur visible dans la console pour vérifier le déploiement
console.log('%cMathPratik v5.0 · Mode Examen sans sanction', 'background:#4f46e5;color:#fff;padding:4px 8px;border-radius:4px;font-weight:700;');

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
  selectedMode:    'entrainement',   // 'examen' | 'entrainement'
  quizQuestions:   [],
  currentQIndex:   0,
  sessionCorrect:  0,
  sessionTotal:    0,
  answered:        false,
  sessionResults:  [], // true/false par question dans l'ordre

  // ── Mode entraînement adaptatif ──────────────────────
  train: {
    pool1:       [],   // questions niv1 disponibles (shuffled, circular)
    pool2:       [],   // questions niv2
    pool3:       [],   // questions niv3
    idx1: 0, idx2: 0, idx3: 0,  // curseur dans chaque pool
    ok1:  0, ok2:  0, ok3:  0,  // bonnes réponses validées par niveau
    target1: 8, target2: 6, target3: 1,  // objectifs
    currentLevel: 1,   // niveau actuel affiché (1, 2 ou 3)
    history: [],       // { q, isCorrect } pour l'écran résultats
  },
};

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
  State.currentNiveau = null;
  renderHome();
  showScreen('screen-home');
}

function showSelect(niveau) {
  const nv = niveau || State.currentNiveau;
  if (!nv) return showHome();
  State.currentNiveau = nv;

  // Automatismes : écran de sélection dédié avec les 36 notions
  if (nv === 'automatismes') {
    renderSelectAutomatismes();
    showScreen('screen-select');
    return;
  }

  // 3ème : afficher les notions ET le module Brevet
  if (nv === '3eme') {
    renderSelect3eme();
    showScreen('screen-notions');
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
  } else if (State.currentNiveau === '3eme') {
    renderSelect3eme();
    showScreen('screen-notions');
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

    // Cas spécial : 3ème — toujours affichée (module Brevet disponible même sans notions JSON)
    if (key === '3eme') {
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
//  RENDU — 3ème (notions + module Brevet)
// ══════════════════════════════════════════════════════
function renderSelect3eme() {
  const meta    = DB.niveaux['3eme'] || { label: '3ème', emoji: '🟥', couleur: '#dc2626' };
  const notions = DB.questions['3eme'] || {};

  State.currentNiveau = '3eme';

  document.getElementById('notions-badge').textContent = `${meta.emoji || ''} ${meta.label}`;
  document.getElementById('notions-title').innerHTML   = `Notions <em>3ème</em>`;
  document.getElementById('notions-sub').textContent   = 'Choisir une notion ou accéder au Brevet';

  const list = document.getElementById('notions-list');
  list.innerHTML = '';

  // Carte spéciale Brevet en tête
  list.insertAdjacentHTML('beforeend', `
    <div class="notion-card"
         style="--notion-color:#dc2626;background:linear-gradient(135deg,color-mix(in srgb,#dc2626 8%,var(--raised)),var(--raised));border-color:color-mix(in srgb,#dc2626 25%,var(--bd));"
         onclick="showBrevetModule()">
      <div class="notion-icon-wrap" style="background:color-mix(in srgb,#dc2626 18%,transparent);">
        🎓
      </div>
      <div class="notion-info">
        <h3 style="color:#dc2626;font-size:1rem;">Brevet des collèges</h3>
        <div class="notion-meta">
          <span>Annales officielles &amp; Automatismes</span>
        </div>
      </div>
      <span style="color:#dc2626;font-size:1.2rem;opacity:.7;">›</span>
    </div>
  `);

  // Notions 3ème disponibles
  Object.entries(notions).forEach(([key, notion]) => {
    const card = document.createElement('div');
    card.className = 'notion-card';
    card.style.cssText = '--notion-color:' + notion.color;
    card.innerHTML = `
      <div class="notion-icon-wrap">${notion.icon || '📐'}</div>
      <div class="notion-info">
        <h3>${escapeHtml(notion.label)}</h3>
        <div class="notion-meta"><span>${notion.questions.length} questions</span></div>
      </div>
      <span style="color:var(--notion-color);font-size:1.2rem;opacity:.7;">›</span>
    `;
    card.addEventListener('click', () => {
      State.selectedThemes = [key];
      launchQuizDirect(key);
    });
    list.appendChild(card);
  });

  if (Object.keys(notions).length === 0) {
    list.insertAdjacentHTML('beforeend', `
      <p style="color:var(--tx3);font-size:0.85rem;padding:16px 0;text-align:center;">
        Aucune notion 3ème disponible pour l'instant.<br/>
        <em>Le module Brevet est déjà accessible ci-dessus.</em>
      </p>`);
  }
}

function launchQuizDirect(themeKey) {
  State.selectedThemes = [themeKey];
  renderSelect('3eme');
  // Auto-select the theme and launch
  State.selectedThemes = [themeKey];
  launchQuiz();
}

function showBrevetModule() {
  // Réinitialiser sur l'onglet Annales par défaut
  showBrevetTab('annales');
  showScreen('screen-brevet');
}

function showBrevetTab(tab) {
  const paneAnnales      = document.getElementById('brevet-pane-annales');
  const paneAutomatismes = document.getElementById('brevet-pane-automatismes');
  const tabAnnales       = document.getElementById('brevet-tab-annales');
  const tabAutomatismes  = document.getElementById('brevet-tab-automatismes');

  if (tab === 'annales') {
    paneAnnales.style.display      = 'block';
    paneAutomatismes.style.display = 'none';
    tabAnnales.classList.add('active');
    tabAutomatismes.classList.remove('active');
  } else {
    paneAnnales.style.display      = 'none';
    paneAutomatismes.style.display = 'block';
    tabAnnales.classList.remove('active');
    tabAutomatismes.classList.add('active');
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

// ── Sélection du mode ─────────────────────────────────
function selectMode(mode) {
  State.selectedMode = mode;

  const btnExamen      = document.getElementById('mode-btn-examen');
  const btnEntrainement = document.getElementById('mode-btn-entrainement');

  if (btnExamen) {
    btnExamen.className      = 'mode-btn' + (mode === 'examen' ? ' active-examen' : '');
    btnEntrainement.className = 'mode-btn' + (mode === 'entrainement' ? ' active-entrainement' : '');
  }
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
    const modeLabel = State.selectedMode === 'entrainement' ? '💡 Mode Entraînement · 15 questions' : '🏆 Mode Examen · 15 questions';
    btn.textContent = modeLabel;
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
    btn.textContent = State.selectedMode === 'entrainement' ? '💡 Mode Entraînement · 15 questions' : '🏆 Mode Examen · 15 questions';
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

  const examBanner  = document.getElementById('exam-banner');
  const trainBanner = document.getElementById('train-banner');

  if (State.selectedMode === 'entrainement') {
    examBanner.classList.add('hidden');
    trainBanner.classList.remove('hidden');
  } else {
    examBanner.classList.remove('hidden');
    trainBanner.classList.add('hidden');
  }

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

  if (State.selectedMode === 'entrainement') {
    launchTraining();
    return;
  }

  // ── Mode Examen ──────────────────────────────────────
  State.quizQuestions  = buildQuestionPool();
  State.currentQIndex  = 0;
  State.sessionCorrect = 0;
  State.sessionTotal   = 0;
  State.answered       = false;
  State.sessionResults = [];

  const examBanner  = document.getElementById('exam-banner');
  const trainBanner = document.getElementById('train-banner');
  examBanner.classList.remove('hidden');
  trainBanner.classList.add('hidden');

  const notion = State.selectedThemes.length === 1
    ? ((DB.questions[State.currentNiveau] || {})[State.selectedThemes[0]] || {}).label || '—'
    : `${State.selectedThemes.length} thèmes`;
  document.getElementById('quiz-notion-name').textContent = notion;
  document.getElementById('q-total').textContent = State.quizQuestions.length;

  showScreen('screen-quiz');
  renderQuestion();
}

// ══════════════════════════════════════════════════════
//  MODE ENTRAÎNEMENT ADAPTATIF
// ══════════════════════════════════════════════════════

function launchTraining() {
  // Construire les pools par niveau depuis tous les thèmes sélectionnés
  const niveau = State.currentNiveau;
  const themes = State.selectedThemes;
  let p1 = [], p2 = [], p3 = [];

  themes.forEach(themeKey => {
    const notion = (DB.questions[niveau] || {})[themeKey];
    if (!notion) return;
    notion.questions.forEach(q => {
      const d = q.difficulte || q.niveau || 1;
      if (d === 1)      p1.push(q);
      else if (d === 2) p2.push(q);
      else              p3.push(q);
    });
  });

  shuffle(p1); shuffle(p2); shuffle(p3);

  // Réinitialiser l'état entraînement
  const tr = State.train;
  tr.pool1 = p1; tr.pool2 = p2; tr.pool3 = p3;
  tr.idx1 = 0; tr.idx2 = 0; tr.idx3 = 0;
  tr.ok1 = 0; tr.ok2 = 0; tr.ok3 = 0;
  tr.currentLevel = 1;
  tr.history = [];

  State.sessionCorrect = 0;
  State.sessionTotal   = 0;
  State.answered       = false;
  State.quizQuestions  = []; // non utilisé en entraînement mais réinitialisé
  State.currentQIndex  = 0;

  // Bannières
  document.getElementById('exam-banner').classList.add('hidden');
  document.getElementById('train-banner').classList.remove('hidden');

  // Libellé
  const notion = State.selectedThemes.length === 1
    ? ((DB.questions[State.currentNiveau] || {})[State.selectedThemes[0]] || {}).label || '—'
    : `${State.selectedThemes.length} thèmes`;
  document.getElementById('quiz-notion-name').textContent = notion;

  // Mettre à jour le compteur d'objectifs
  trainUpdateProgress();

  showScreen('screen-quiz');
  renderTrainingQuestion();
}

/**
 * Retourne la prochaine question du niveau courant (pool circulaire).
 * Recycle le pool si épuisé.
 */
function trainNextQuestion() {
  const tr = State.train;

  // Déterminer le niveau courant
  if (tr.ok1 < tr.target1) {
    tr.currentLevel = 1;
  } else if (tr.ok2 < tr.target2) {
    tr.currentLevel = 2;
  } else {
    tr.currentLevel = 3;
  }

  let pool, idxKey;
  if (tr.currentLevel === 1) { pool = tr.pool1; idxKey = 'idx1'; }
  else if (tr.currentLevel === 2) { pool = tr.pool2; idxKey = 'idx2'; }
  else { pool = tr.pool3; idxKey = 'idx3'; }

  if (!pool || pool.length === 0) return null;

  // Circulaire : on reboucle si on a tout parcouru
  if (tr[idxKey] >= pool.length) {
    shuffle(pool);
    tr[idxKey] = 0;
  }

  const q = pool[tr[idxKey]];
  tr[idxKey]++;
  return q;
}

/** Met à jour l'indicateur de progression en haut (q-total / q-num) */
function trainUpdateProgress() {
  const tr = State.train;
  const total  = tr.target1 + tr.target2 + tr.target3;      // 16
  const done   = tr.ok1 + tr.ok2 + tr.ok3;
  document.getElementById('q-total').textContent = total;
  document.getElementById('q-num').textContent   = done + 1; // prochaine à valider
}

function renderTrainingQuestion() {
  const q = trainNextQuestion();
  if (!q) {
    // Aucune question disponible pour ce niveau → fin de session
    showTrainingResults();
    return;
  }

  // Stocker la question courante pour la réponse
  State._trainCurrentQ = q;
  State.answered = false;

  const tr = State.train;
  const total = tr.target1 + tr.target2 + tr.target3;
  const done  = tr.ok1 + tr.ok2 + tr.ok3;

  // Barre de progression (basée sur les bonnes réponses validées)
  document.getElementById('quiz-progress').style.width = (done / total * 100) + '%';
  document.getElementById('q-num').textContent  = done + 1;
  document.getElementById('q-total').textContent = total;
  document.getElementById('quiz-score-live').textContent = `${State.sessionCorrect}/${State.sessionTotal}`;

  // Tag avec niveau actuel
  const niveauEmoji = ['', '★', '★★', '★★★'][tr.currentLevel] || '';
  document.getElementById('q-tag').textContent =
    `${q._icon || '📐'} ${q._theme || ''} · ${niveauEmoji}`;

  // Énoncé
  const qtextEl = document.getElementById('q-text');
  if (q.enonce_html) {
    qtextEl.innerHTML = q.enonce_html;
    renderMath(qtextEl);
  } else {
    setMathText(qtextEl, q.enonce);
  }

  // Image + calculatrice
  const imgWrap = document.getElementById('q-image-wrap');
  if (imgWrap) {
    let imgHtml = '';
    if (q.image) {
      imgHtml += `<img src="images/${escapeHtml(q.image)}" alt="Illustration" loading="lazy" style="max-width:100%;border-radius:8px;margin-top:12px;" />`;
    }
    if (q.avec_calculatrice) imgHtml += buildCalculatrice();
    imgWrap.innerHTML = imgHtml;
    imgWrap.style.display = imgHtml ? 'block' : 'none';
  }

  // Reset feedback
  const fb = document.getElementById('feedback-box');
  fb.className = 'feedback-box';
  document.getElementById('feedback-text').innerHTML = '';
  document.getElementById('btn-next').classList.remove('visible');

  // Énoncé : adapter pour diviseurs_multi
  if (q.type === 'diviseurs_multi') {
    setMathText(document.getElementById('q-text'), q.enonce);
  }

  // Choix
  const list = document.getElementById('choices-list');
  list.innerHTML = '';

  if (q.type === 'diviseurs_multi') {
    renderDiviseursMulti(q, list);
  } else {
    const choixMelanges = shuffle([...q.choix]);
    const letters = ['A', 'B', 'C', 'D'];
    choixMelanges.forEach((choix, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.dataset.val = choix;
      const letterSpan = document.createElement('span');
      letterSpan.className = 'choice-letter';
      letterSpan.textContent = letters[i];
      const textSpan = document.createElement('span');
      textSpan.textContent = choix;
      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);
      renderMath(textSpan);
      btn.addEventListener('click', () => handleTrainingAnswer(choix, q));
      list.appendChild(btn);
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleTrainingAnswer(chosen, question) {
  if (State.answered) return;
  State.answered = true;
  State.sessionTotal += 1;

  const isCorrect = chosen === question.reponse;
  if (isCorrect) {
    State.sessionCorrect += 1;
    // Incrémenter le bon compteur
    const tr = State.train;
    if (tr.currentLevel === 1 && tr.ok1 < tr.target1)       tr.ok1++;
    else if (tr.currentLevel === 2 && tr.ok2 < tr.target2)   tr.ok2++;
    else if (tr.currentLevel === 3 && tr.ok3 < tr.target3)   tr.ok3++;
  }

  State.train.history.push({ q: question, isCorrect });

  // Coloriser les boutons
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    const val = btn.dataset.val;
    if (val === question.reponse)          btn.classList.add('correct');
    else if (val === chosen && !isCorrect) btn.classList.add('wrong');
    else                                   btn.classList.add('missed');
  });

  // Feedback
  const fb = document.getElementById('feedback-box');
  const feedbackText = document.getElementById('feedback-text');

  if (isCorrect) {
    fb.className = 'feedback-box correct';
    document.getElementById('feedback-icon').textContent  = '✓';
    document.getElementById('feedback-title').textContent = 'Bonne réponse !';
  } else {
    fb.className = 'feedback-box wrong';
    document.getElementById('feedback-icon').textContent  = '✗';
    document.getElementById('feedback-title').textContent = '✗ Mauvaise réponse';
    document.querySelector('.question-card').classList.add('shake');
    setTimeout(() => document.querySelector('.question-card').classList.remove('shake'), 450);
  }
  {
    const isDivMulti = (question.type === 'diviseurs_multi');
    feedbackText.innerHTML = '';
    if (!isCorrect) {
      const repText = isDivMulti
        ? '÷' + (Array.isArray(question.reponse) ? question.reponse.join(', ÷') : question.reponse)
        : (Array.isArray(question.reponse) ? question.reponse.join(', ') : question.reponse);
      const label = isDivMulti ? '✅ Bons diviseurs : ' : '✅ Bonne réponse : ';
      const correctDiv = document.createElement('div');
      correctDiv.className = 'feedback-correct-answer';
      correctDiv.textContent = label + repText;
      renderMath(correctDiv);
      feedbackText.appendChild(correctDiv);
    }
    if (question.explication) {
      const explDiv = document.createElement('div');
      explDiv.style.marginTop = '8px';
      setMathText(explDiv, question.explication);
      feedbackText.appendChild(explDiv);
    }
    if (question.image_explication) {
      const imgEl = document.createElement('img');
      imgEl.src = question.image_explication;
      imgEl.alt = 'Illustration de la décomposition';
      imgEl.style.cssText = 'max-width:100%;border-radius:8px;margin-top:12px;';
      feedbackText.appendChild(imgEl);
    }
  }

  document.getElementById('quiz-score-live').textContent = `${State.sessionCorrect}/${State.sessionTotal}`;

  const tr = State.train;
  const done  = tr.ok1 + tr.ok2 + tr.ok3;
  const total = tr.target1 + tr.target2 + tr.target3;
  document.getElementById('quiz-progress').style.width = (done / total * 100) + '%';
  document.getElementById('q-num').textContent = Math.min(done + 1, total);

  const btnNext = document.getElementById('btn-next');
  btnNext.classList.add('visible');
  const isFinished = (done >= total);
  btnNext.textContent = isFinished ? 'Voir les résultats →' : 'Suivant →';
}

function showTrainingResults() {
  const tr = State.train;
  const score = State.sessionCorrect;
  const total = State.sessionTotal;
  const pct   = total > 0 ? Math.round(score / total * 100) : 0;

  // Émoji et message selon efficacité (ratio bonnes / tentées)
  let emoji, title, sub;
  if (pct === 100)    { emoji = '🏆'; title = 'Entraînement parfait !'; sub = 'Toutes les réponses correctes du premier coup !'; }
  else if (pct >= 75) { emoji = '🎉'; title = 'Très bien !';            sub = 'Tu maîtrises bien ce contenu !'; }
  else if (pct >= 50) { emoji = '💪'; title = 'Bon entraînement !';     sub = 'Continue, tu progresses !'; }
  else                { emoji = '📚'; title = 'À retravailler…';        sub = 'Relis ta leçon puis recommence !'; }

  document.getElementById('result-emoji').textContent     = emoji;
  document.getElementById('result-title').textContent     = title;
  document.getElementById('result-subtitle').textContent  = sub;
  document.getElementById('result-score-num').textContent = `${score}/${total}`;

  const circ   = 270.2;
  const offset = circ - (pct / 100) * circ;
  const circle = document.getElementById('score-circle');
  circle.style.strokeDashoffset = circ;
  setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);

  // Liste détaillée à partir de l'historique
  const list = document.getElementById('result-list');
  list.innerHTML = '';

  // Ajouter un récap de progression
  const recap = document.createElement('div');
  recap.style.cssText = 'background:var(--raised);border:1px solid var(--bd);border-radius:var(--r-sm);padding:14px 16px;margin-bottom:16px;font-size:0.85rem;';
  recap.innerHTML = `
    <div style="font-weight:700;margin-bottom:8px;color:var(--tx);">Progression par niveau</div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:var(--ok);font-weight:700;">★</span>
        <span style="color:var(--tx2);">Niveau 1 :</span>
        <span style="font-weight:700;color:var(--ok);">${tr.ok1}/${tr.target1} validées</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:var(--ok);font-weight:700;">★★</span>
        <span style="color:var(--tx2);">Niveau 2 :</span>
        <span style="font-weight:700;color:var(--ok);">${tr.ok2}/${tr.target2} validées</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="color:var(--ok);font-weight:700;">★★★</span>
        <span style="color:var(--tx2);">Niveau 3 :</span>
        <span style="font-weight:700;color:var(--ok);">${tr.ok3}/${tr.target3} validée</span>
      </div>
    </div>`;
  list.appendChild(recap);

  tr.history.forEach((entry, i) => {
    const { q, isCorrect } = entry;
    const item = document.createElement('div');
    item.className = 'result-item';
    const dot = document.createElement('div');
    dot.className = `result-dot ${isCorrect ? 'ok' : 'ko'}`;
    dot.textContent = isCorrect ? '✓' : '✗';
    const textDiv = document.createElement('div');
    textDiv.className = 'result-item-text';
    const strong = document.createElement('strong');
    const enonceRaw = q.enonce ? q.enonce : (q.enonce_html ? q.enonce_html.replace(/<[^>]*>/g, '') : '—');
    strong.textContent = `Q${i + 1} : ${enonceRaw.substring(0, 65)}${enonceRaw.length > 65 ? '…' : ''}`;
    renderMath(strong);
    const repLine = document.createElement('span');
    const repText = Array.isArray(q.reponse) ? q.reponse.join(', ') : q.reponse;
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

  // Mode entraînement : mettre à jour les compteurs de progression
  const isTrainingMode = (State.selectedMode === 'entrainement') && !State._dmMode;
  if (isTrainingMode) {
    const tr = State.train;
    if (isCorrect) {
      if (tr.currentLevel === 1 && tr.ok1 < tr.target1)       tr.ok1++;
      else if (tr.currentLevel === 2 && tr.ok2 < tr.target2)   tr.ok2++;
      else if (tr.currentLevel === 3 && tr.ok3 < tr.target3)   tr.ok3++;
    }
    tr.history.push({ q: question, isCorrect });
  } else {
    State.sessionResults[State.currentQIndex] = isCorrect;
  }

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
  const isTraining = (State.selectedMode === 'entrainement') && !State._dmMode;

  if (isCorrect) {
    fb.className = 'feedback-box correct';
    document.getElementById('feedback-icon').textContent  = '✓';
    document.getElementById('feedback-title').textContent = 'Bonne réponse !';
  } else {
    fb.className = 'feedback-box wrong';
    document.getElementById('feedback-icon').textContent  = '✗';
    document.getElementById('feedback-title').textContent = '✗ Mauvaise réponse';
    document.querySelector('.question-card').classList.add('shake');
    setTimeout(() => document.querySelector('.question-card').classList.remove('shake'), 450);
  }

  const feedbackText = document.getElementById('feedback-text');
  const isDivMulti = (question.type === 'diviseurs_multi');

  if (!isCorrect || isDivMulti) {
    feedbackText.innerHTML = '';
    if (!isCorrect) {
      // Afficher la bonne réponse
      const repText = Array.isArray(question.reponse)
        ? '÷' + question.reponse.join(', ÷')
        : question.reponse;
      const correctDiv = document.createElement('div');
      correctDiv.className = 'feedback-correct-answer';
      correctDiv.textContent = '✅ Bons diviseurs : ' + repText;
      renderMath(correctDiv);
      feedbackText.appendChild(correctDiv);
    }
    if (question.explication) {
      const explDiv = document.createElement('div');
      explDiv.style.marginTop = '8px';
      setMathText(explDiv, question.explication);
      feedbackText.appendChild(explDiv);
    }
    if (question.image_explication) {
      const imgEl = document.createElement('img');
      imgEl.src = question.image_explication;
      imgEl.alt = 'Illustration de la décomposition';
      imgEl.style.cssText = 'max-width:100%;border-radius:8px;margin-top:12px;';
      feedbackText.appendChild(imgEl);
    }
  } else {
    feedbackText.innerHTML = '';
    setMathText(feedbackText, question.explication || '');
  }

  document.getElementById('quiz-score-live').textContent =
    `${State.sessionCorrect}/${State.sessionTotal}`;

  // Mettre à jour la barre de progression en mode entraînement
  if (isTraining) {
    const tr = State.train;
    const done  = tr.ok1 + tr.ok2 + tr.ok3;
    const total = tr.target1 + tr.target2 + tr.target3;
    document.getElementById('quiz-progress').style.width = (done / total * 100) + '%';
    document.getElementById('q-num').textContent = Math.min(done + 1, total);
  }

  const btnNext = document.getElementById('btn-next');
  btnNext.classList.add('visible');

  if (isTraining) {
    // En entraînement : vérifier si l'objectif est atteint
    const tr = State.train;
    const done  = tr.ok1 + tr.ok2 + tr.ok3;
    const total = tr.target1 + tr.target2 + tr.target3;
    btnNext.textContent = (done >= total) ? 'Voir les résultats →' : 'Suivant →';
  } else {
    const isLast = State.currentQIndex >= State.quizQuestions.length - 1;
    btnNext.textContent = isLast ? 'Voir les résultats →' : 'Suivant →';
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
    document.getElementById('feedback-title').textContent = '✗ Mauvaise réponse';
    document.querySelector('.question-card').classList.add('shake');
    setTimeout(() => document.querySelector('.question-card').classList.remove('shake'), 450);
  }
  {
    const feedbackText = document.getElementById('feedback-text');
    const isDivMulti = (question.type === 'diviseurs_multi');
    if (!isCorrect || isDivMulti) {
      feedbackText.innerHTML = '';
      if (!isCorrect && isDivMulti) {
        const repText = '÷' + (Array.isArray(question.reponse) ? question.reponse.join(', ÷') : question.reponse);
        const correctDiv = document.createElement('div');
        correctDiv.className = 'feedback-correct-answer';
        correctDiv.textContent = '✅ Bons diviseurs : ' + repText;
        renderMath(correctDiv);
        feedbackText.appendChild(correctDiv);
      }
      if (question.explication) {
        const explDiv = document.createElement('div');
        explDiv.style.marginTop = isDivMulti ? '8px' : '0';
        setMathText(explDiv, question.explication);
        feedbackText.appendChild(explDiv);
      }
      if (question.image_explication) {
        const imgEl = document.createElement('img');
        imgEl.src = question.image_explication;
        imgEl.alt = 'Illustration de la décomposition';
        imgEl.style.cssText = 'max-width:100%;border-radius:8px;margin-top:12px;';
        feedbackText.appendChild(imgEl);
      }
    } else {
      setMathText(feedbackText, question.explication || '');
    }
  }
  document.getElementById('quiz-score-live').textContent = `${State.sessionCorrect}/${State.sessionTotal}`;

  const btnNext = document.getElementById('btn-next');
  btnNext.classList.add('visible');
  const isLast = State.currentQIndex >= State.quizQuestions.length - 1;

  btnNext.textContent = isLast ? 'Voir les résultats →' : 'Suivant →';
}

// ══════════════════════════════════════════════════════
//  NAVIGATION QUIZ
// ══════════════════════════════════════════════════════
function nextQuestion() {
  // ── Mode entraînement adaptatif ──────────────────────
  if (State.selectedMode === 'entrainement' && !State._dmMode) {
    const tr = State.train;
    const done  = tr.ok1 + tr.ok2 + tr.ok3;
    const total = tr.target1 + tr.target2 + tr.target3;
    if (done >= total) {
      showTrainingResults();
      return;
    }
    renderTrainingQuestion();
    return;
  }

  // ── Mode examen ──────────────────────────────────────
  // Une mauvaise réponse n'interrompt plus la session : on continue
  // jusqu'au bout, comme en entraînement. L'écran 'screen-exam-fail'
  // reste utilisé uniquement par la protection anti-triche
  // (élève qui quitte l'app pendant un quiz).
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
  const str = String(text);
  // Les explications diviseurs_multi utilisent " | " comme séparateur de lignes
  if (str.includes(' | ')) {
    el.innerHTML = '';
    str.split(' | ').forEach((part, i) => {
      if (i > 0) el.appendChild(document.createElement('br'));
      const span = document.createElement('span');
      span.textContent = part;
      el.appendChild(span);
    });
    renderMath(el);
  } else {
    el.textContent = str;
    renderMath(el);
  }
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
      <button class="calc-btn calc-fn" onclick="calcAction('(')"> ( </button>
      <button class="calc-btn calc-fn" onclick="calcAction(')')"> ) </button>

      <button class="calc-btn calc-fn" onclick="calcAction('sqrt')">√</button>
      <button class="calc-btn calc-fn" onclick="calcAction('sq')">x²</button>
      <button class="calc-btn calc-fn" onclick="calcAction('pow')">xⁿ</button>
      <button class="calc-btn calc-op" onclick="calcAction('/')">÷</button>

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

// Convertit les chiffres 0-9 en exposants Unicode ⁰¹²³…
const _supMap = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
function toSup(s) { return String(s).split('').map(c => _supMap[c] || c).join(''); }

// Transforme l'expression interne en affichage lisible
// (2)**3  →  2³     Math.sqrt(25)  →  √25     (3)**-2  →  3⁻²
function prettifyExpr(expr) {
  if (!expr) return '';
  let s = expr;
  // Math.sqrt(x)  →  √x (fermée ou en cours)
  s = s.replace(/Math\.sqrt\(([^)]*)\)/g, (_, i) => '√' + (i ? i : ''));
  s = s.replace(/Math\.sqrt\(([^)]*)$/g,  (_, i) => '√' + (i ? i : ''));
  // (base)**exp  →  base exposant Unicode (exposant complet)
  // Boucle pour gérer les exposants chaînés
  let prev;
  do {
    prev = s;
    s = s.replace(/\(([^()]*)\)\*\*(-?[\d.]+)/g, (_, base, exp) => base + toSup(exp));
  } while (s !== prev);
  // (base)**  en cours de saisie → base^
  s = s.replace(/\(([^()]*)\)\*\*$/g, (_, base) => base + '^');
  // Supprimer parenthèses autour d'un nombre simple isolé : (25) → 25
  s = s.replace(/\((\d+(?:\.\d+)?)\)(?!\*\*)/g, '$1');
  return s;
}

function calcUpdateDisplay() {
  const screen = document.getElementById('calc-screen');
  const exprEl = document.getElementById('calc-expr');
  // Écran principal : résultat numérique après =, expression lisible sinon
  if (screen) {
    screen.value = _calc.justEq
      ? (_calc.display || '0')
      : (prettifyExpr(_calc.expr) || '0');
  }
  // Petite ligne au-dessus : expression interne (debug discret) — vide après =
  if (exprEl) {
    exprEl.textContent = '';
  }
}

function calcAction(key) {
  const screen = document.getElementById('calc-screen');
  if (!screen) return;

  if (key === 'C') {
    _calc.expr = ''; _calc.display = '0'; _calc.justEq = false;
    calcUpdateDisplay(); return;
  }
  if (key === 'CE') {
    if (_calc.justEq) {
      _calc.expr = ''; _calc.display = '0'; _calc.justEq = false;
    } else {
      // Supprimer le dernier token logique
      const e = _calc.expr;
      if      (e.endsWith('Math.sqrt(')) _calc.expr = e.slice(0, -10);
      else if (e.endsWith(')**'))        _calc.expr = e.slice(0, -3);  // xⁿ en attente
      else if (e.endsWith(')**2'))       _calc.expr = e.slice(0, -4);  // x²
      else if (e.match(/\(\d+\)\*\*\d+$/)) {
        // supprimer l'exposant complet (ex: (5)**3 → vide)
        _calc.expr = e.replace(/\([^()]+\)\*\*[\d.]+$/, '');
      }
      else _calc.expr = e.slice(0, -1);
      _calc.display = _calc.expr || '0';
    }
    calcUpdateDisplay(); return;
  }
  if (key === '=') {
    try {
      // Auto-fermer les parenthèses ouvertes manquantes
      let expr = _calc.expr;
      const open  = (expr.match(/\(/g) || []).length;
      const close = (expr.match(/\)/g) || []).length;
      if (open > close) expr += ')'.repeat(open - close);
      const computed = Function('return (' + expr + ')')();
      const result = isFinite(computed) ? parseFloat(computed.toFixed(10)).toString() : 'Erreur';
      _calc.display = result;
      _calc.expr    = result;
      _calc.justEq  = true;
    } catch { _calc.display = 'Erreur'; _calc.expr = ''; _calc.justEq = false; }
    calcUpdateDisplay(); return;
  }
  if (key === 'sqrt') {
    if (_calc.justEq) _calc.expr = '';
    _calc.expr   += 'Math.sqrt(';
    _calc.display = _calc.expr;
    _calc.justEq  = false;
    calcUpdateDisplay(); return;
  }
  if (key === 'sq') {
    const base    = _calc.expr || '0';
    _calc.expr    = '(' + base + ')**2';
    _calc.display = _calc.expr;
    _calc.justEq  = false;
    calcUpdateDisplay(); return;
  }
  if (key === 'pow') {
    // xⁿ : enveloppe la base courante avec ** et attend l'exposant
    const base    = _calc.expr || '0';
    _calc.expr    = '(' + base + ')**';
    _calc.display = _calc.expr;
    _calc.justEq  = false;
    calcUpdateDisplay(); return;
  }

  const ops = ['+', '-', '*', '/'];
  if (_calc.justEq && !ops.includes(key) && key !== ')') _calc.expr = '';
  _calc.justEq  = false;
  _calc.expr   += key;
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
  document.addEventListener('keydown', _pinKeyHandler);
}

function _pinKeyHandler(e) {
  if (!document.getElementById('teacher-login-overlay').classList.contains('open')) return;
  if (e.key >= '0' && e.key <= '9') { pinKey(e.key); }
  else if (e.key === 'Backspace') { pinKey('del'); }
  else if (e.key === 'Enter') { pinKey('ok'); }
  else if (e.key === 'Escape') { closeTeacherLogin(); }
}

function closeTeacherLogin() {
  document.getElementById('teacher-login-overlay').classList.remove('open');
  document.removeEventListener('keydown', _pinKeyHandler);
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

async function showTeacherModule() {
  showScreen('screen-teacher');
  renderTeacherFilters();

  // Charger les automatismes non encore chargés (chargement à la demande côté élève,
  // mais l'enseignant a besoin de tous les fichiers pour la liste complète)
  const autNotions = DB.automatismesNotions || [];
  const autDB = DB.questions['automatismes'] || {};
  const toLoad = autNotions.filter(n => !autDB[n.id]);
  if (toLoad.length > 0) {
    const container = document.getElementById('teacher-notion-list');
    if (container) container.innerHTML = '<p style="text-align:center;color:var(--tx3);padding:32px 20px;font-size:0.88rem;">⚡ Chargement des automatismes…</p>';
    await Promise.all(
      toLoad.map(n => chargerFichierThematique({ fichier: n.fichier, niveau: 'automatismes' }))
    );
  }

  renderTeacherNotionList();
}

function closeTeacherModule() {
  teacherSeasonReset();
  showScreen('screen-home');
}

/* ── Prévisualisation des saisons (mode enseignant) ── */
var _teacherSeasonsOpen = false;

var _SEASON_LABELS = [
  { emoji:'❄️',  label:'Janvier'   },
  { emoji:'💝',  label:'Février'   },
  { emoji:'🌱',  label:'Mars'      },
  { emoji:'🐣',  label:'Avril'     },
  { emoji:'🌿',  label:'Mai'       },
  { emoji:'✨',  label:'Juin'      },
  { emoji:'🏖️', label:'Juillet'   },
  { emoji:'🐠',  label:'Août'      },
  { emoji:'✏️',  label:'Septembre' },
  { emoji:'🎃',  label:'Octobre'   },
  { emoji:'🍂',  label:'Novembre'  },
  { emoji:'🎄',  label:'Décembre'  },
];

var _teacherSeasonActive = -1;

function teacherToggleSeasons() {
  _teacherSeasonsOpen = !_teacherSeasonsOpen;
  var body = document.getElementById('teacher-seasons-body');
  var arrow = document.getElementById('teacher-seasons-arrow');
  body.style.display = _teacherSeasonsOpen ? 'block' : 'none';
  arrow.style.transform = _teacherSeasonsOpen ? 'rotate(180deg)' : '';
  if (_teacherSeasonsOpen) _teacherBuildGrid();
}

function _teacherBuildGrid() {
  var grid = document.getElementById('teacher-season-grid');
  if (!grid || grid.children.length > 0) return;
  var realMonth = new Date().getMonth();
  _SEASON_LABELS.forEach(function(s, i) {
    var btn = document.createElement('button');
    btn.id = 'season-btn-' + i;
    btn.innerHTML = s.emoji + '<br><span style="font-size:0.68rem;">' + s.label + '</span>';
    btn.style.cssText = [
      'padding:8px 4px',
      'border-radius:var(--r-sm)',
      'border:1.5px solid ' + (i === realMonth ? 'rgba(129,140,248,0.6)' : 'rgba(129,140,248,0.18)'),
      'background:' + (i === realMonth ? 'rgba(129,140,248,0.15)' : 'none'),
      'cursor:pointer',
      'font-family:var(--font-sans)',
      'font-size:1.1rem',
      'color:var(--text-primary,inherit)',
      'line-height:1.3',
      'transition:all .15s',
    ].join(';');
    btn.onclick = function() { teacherSeasonPick(i); };
    grid.appendChild(btn);
  });
}

function teacherSeasonPick(monthIndex) {
  if (!window.MathPratikSeasons) return;
  _teacherSeasonActive = monthIndex;
  _SEASON_LABELS.forEach(function(_, i) {
    var btn = document.getElementById('season-btn-' + i);
    if (!btn) return;
    var active = (i === monthIndex);
    btn.style.border = active ? '2px solid #818cf8' : '1.5px solid rgba(129,140,248,0.18)';
    btn.style.background = active ? 'rgba(129,140,248,0.22)' : 'none';
  });
  window.MathPratikSeasons.previewMonth(monthIndex);
}

function teacherSeasonReset() {
  if (!window.MathPratikSeasons) return;
  _teacherSeasonActive = -1;
  var realMonth = new Date().getMonth();
  _SEASON_LABELS.forEach(function(_, i) {
    var btn = document.getElementById('season-btn-' + i);
    if (!btn) return;
    btn.style.border = i === realMonth ? '1.5px solid rgba(129,140,248,0.6)' : '1.5px solid rgba(129,140,248,0.18)';
    btn.style.background = i === realMonth ? 'rgba(129,140,248,0.15)' : 'none';
  });
  window.MathPratikSeasons.resetToCurrentMonth();
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
  const autNotions = (window._indexData && window._indexData.automatismes_notions) || [];
  const allNotions = [];

  // Notions classiques (6ème, 5ème, 4ème, 3ème)
  fichiers.forEach(f => {
    if (Teacher.filterNiveau !== 'all' && f.niveau !== Teacher.filterNiveau) return;
    const niveauData = DB.questions[f.niveau];
    if (!niveauData) return;
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

  // Automatismes
  if (Teacher.filterNiveau === 'all' || Teacher.filterNiveau === 'automatismes') {
    const autDB = DB.questions['automatismes'] || {};
    autNotions.forEach(n => {
      const data = autDB[n.id];
      if (!data) return;
      allNotions.push({
        id:        n.id,
        fichier:   n.fichier,
        niveau:    'automatismes',
        label:     data.label,
        icon:      data.icon,
        color:     data.color || n.color || '#7c3aed',
        questions: data.questions || [],
      });
    });
  }

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
  // Chercher dans les fichiers classiques
  const fichiers = (window._indexData && window._indexData.fichiers) || [];
  let f = fichiers.find(x => x.id === notionId);

  // Si pas trouvé, chercher dans les automatismes
  if (!f) {
    const autNotions = (window._indexData && window._indexData.automatismes_notions) || [];
    const aut = autNotions.find(x => x.id === notionId);
    if (aut) f = { id: aut.id, fichier: aut.fichier, niveau: 'automatismes' };
  }

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

  // ── Bloc réponses selon le type ──────────────────────
  let choicesHtml = '';
  if (q.type === 'diviseurs_multi') {
    // Grille de diviseurs avec bons diviseurs mis en évidence
    const bons = (q.reponse || []).map(Number);
    const proposes = (q.diviseurs_proposes || []);
    const grilleBtns = proposes.map(d => {
      const estBon = bons.includes(Number(d));
      const cls = estBon ? 'divmulti-btn div-ok' : 'divmulti-btn div-neutre';
      return `<button class="${cls}" disabled style="pointer-events:none;">
        <span class="divmulti-op">÷</span><span class="divmulti-num">${d}</span>
      </button>`;
    }).join('');
    const bonsTexte = bons.map(d => `÷${d}`).join(', ');
    choicesHtml = `
      <div class="divmulti-wrap" style="background:transparent;padding:0;box-shadow:none;">
        <div class="divmulti-nombre">${q.nombre_affiche || q.nombre}</div>
        <div class="divmulti-grille">${grilleBtns}</div>
        <div class="reader-choice is-answer" style="margin-top:12px;">
          <div class="reader-choice-letter">✓</div>
          <div>Bons diviseurs : <strong>${bonsTexte}</strong></div>
        </div>
      </div>`;
  } else {
    choicesHtml = (q.choix || []).map((c, i) => {
      const isAns = c === q.reponse;
      return `<div class="reader-choice ${isAns ? 'is-answer' : ''}">
        <div class="reader-choice-letter">${isAns ? '✓' : letters[i]}</div>
        <div>${c}</div>
      </div>`;
    }).join('');
  }

  // ── Explication : convertir | en sauts de ligne ───────
  const explRaw = q.explication || '';
  const explHtml = explRaw
    ? explRaw.split(' | ').map(part => `<div style="margin-bottom:4px;">${part}</div>`).join('')
    : '<em>—</em>';

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
      <div style="margin-top:6px;">${explHtml}</div>
      ${q.image_explication ? `<img src="${q.image_explication}" alt="Illustration de la décomposition" style="max-width:100%;border-radius:8px;margin-top:12px;">` : ''}
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

// ══════════════════════════════════════════════════════
//  PROTECTION ANTI-TRICHE — Arrière-plan mobile
//  Si l'élève quitte l'appli pendant une session quiz
//  (autre app, écran d'accueil, notification…),
//  la session est immédiatement remise à zéro.
// ══════════════════════════════════════════════════════
(function () {
  function isQuizActive() {
    // La session est active si l'écran quiz est visible ET qu'il reste des questions
    const quizScreen = document.getElementById('screen-quiz');
    if (!quizScreen) return false;
    if (!quizScreen.classList.contains('active')) return false;
    // Ne pas sanctionner si la session est déjà terminée (dernière question répondue)
    if (State.currentQIndex >= (State.quizQuestions.length - 1) && State.answered) return false;
    return true;
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && isQuizActive()) {
      // Mettre à jour le titre/sous-titre de l'écran d'échec
      const iconEl  = document.getElementById('fail-icon');
      const titleEl = document.getElementById('fail-title');
      const subEl   = document.getElementById('fail-sub');
      if (iconEl)  iconEl.textContent  = '📵';
      if (titleEl) titleEl.textContent = 'Session annulée !';
      if (subEl)   subEl.textContent   = 'Tu as quitté l\'appli pendant la session. Tout repart à zéro.';

      const previewEl = document.getElementById('fail-question-preview');
      if (previewEl) {
        const q = State.quizQuestions[State.currentQIndex];
        const texte = q
          ? (q.enonce
              ? q.enonce.substring(0, 80)
              : (q.enonce_html
                  ? q.enonce_html.replace(/<[^>]*>/g, '').substring(0, 80)
                  : '—'))
          : '—';
        setMathText(previewEl, `Session interrompue à la question ${State.currentQIndex + 1} : ${texte}…`);
      }

      // Réinitialiser l'état de session
      State.answered       = false;
      State.currentQIndex  = 0;
      State.sessionCorrect = 0;
      State.sessionResults = [];

      showScreen('screen-exam-fail');
    }

    // Quand l'élève revient dans l'appli, remettre les textes par défaut
    // pour ne pas perturber un futur affichage de cet écran
    if (!document.hidden) {
      const iconEl  = document.getElementById('fail-icon');
      const titleEl = document.getElementById('fail-title');
      const subEl   = document.getElementById('fail-sub');
      if (iconEl  && iconEl.textContent  === '📵') iconEl.textContent  = '❌';
      if (titleEl && titleEl.textContent === 'Session annulée !') titleEl.textContent = 'Session interrompue';
      if (subEl   && subEl.textContent.startsWith('Tu as quitté')) subEl.textContent = 'Quitter l\'application pendant un quiz annule la session.';
    }
  });
})();


// ══════════════════════════════════════════════════════
//  MODULE DEVOIRS TEMPS-LIBRE (DM)
// ══════════════════════════════════════════════════════

// ── CONFIG ────────────────────────────────────────────
// URL du Google Apps Script (webhook). Remplacer par l'URL réelle après déploiement.
const DM_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzWwg3hzar_UiPh2LKbBMj8u4euhXqXr0P04n8fQN0rbxJDml0CNm-HPRIrqzVmiVnFPA/exec';

// Cache localStorage (ne sert qu'au lien direct — le code passe par Google Sheets)
const DM_STORE_KEY = 'mathpratik_devoirs_cache';

// État DM
const DM = {
  current: null,      // devoir temps-libre en cours (côté élève)
  student: null,      // { prenom, nom, classe }
  startTime: null,    // timestamp début
  results: [],        // tableau des résultats par question
};

// ── UTILITAIRES ───────────────────────────────────────

function dmGenerateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DM-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function dmEncode(obj) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
  catch (e) { return ''; }
}

function dmDecode(str) {
  try { return JSON.parse(decodeURIComponent(escape(atob(str)))); }
  catch (e) { return null; }
}

function dmSaveDevoirs(devoirs) {
  // Cache local uniquement — la source de vérité est Google Sheets
  localStorage.setItem(DM_STORE_KEY, JSON.stringify(devoirs));
}

function dmLoadDevoirs() {
  try { return JSON.parse(localStorage.getItem(DM_STORE_KEY) || '[]'); }
  catch (e) { return []; }
}

function dmFormatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── ACCUEIL : DÉTECTION URL ───────────────────────────

function dmCheckUrlAndGo() {
  const params = new URLSearchParams(window.location.search);
  const dmParam = params.get('dm');
  if (dmParam) {
    const devoir = dmDecode(dmParam);
    if (devoir && devoir.code) {
      DM.current = devoir;
      dmShowIdentity();
      return;
    }
  }
  showScreen('screen-dm-access');
}

// Appelé au démarrage si ?dm= présent dans l'URL
function dmAutoDetect() {
  const params = new URLSearchParams(window.location.search);
  const dmParam = params.get('dm');
  if (!dmParam) return;
  const devoir = dmDecode(dmParam);
  if (devoir && devoir.code) {
    DM.current = devoir;
    // Attendre que les données soient chargées puis naviguer
    const tryGo = () => {
      if (Object.keys(DB.questions).length > 0 || DB.automatismesNotions.length > 0) {
        dmShowIdentity();
      } else {
        setTimeout(tryGo, 200);
      }
    };
    setTimeout(tryGo, 500);
  }
}

// ── ACCÈS PAR CODE ─────────────────────────────────────

function dmCodeInput(input) {
  let val = input.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  input.value = val;
  document.getElementById('dm-code-err').textContent = '';
  document.getElementById('dm-access-btn').disabled = val.length < 3;
}

async function dmAccessByCode() {
  const code = document.getElementById('dm-code-input').value.trim().toUpperCase();
  const btn  = document.getElementById('dm-access-btn');
  const errEl = document.getElementById('dm-code-err');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Recherche…';

  try {
    // 1. Chercher dans Google Sheets (source de vérité)
    const res = await fetch(`${DM_WEBHOOK_URL}?action=get_devoir&code=${encodeURIComponent(code)}`);
    const data = await res.json();
    if (data && data.devoir) {
      DM.current = data.devoir;
      // Mettre en cache local
      const cache = dmLoadDevoirs();
      const exists = cache.find(d => d.code === code);
      if (!exists) { cache.push(data.devoir); dmSaveDevoirs(cache); }
      dmShowIdentity();
      return;
    }
  } catch (e) {
    // Pas de réseau ou erreur → essayer le cache local
    console.warn('Sheets inaccessible, fallback cache:', e);
  }

  // 2. Fallback : cache localStorage (pour lien direct déjà ouvert)
  const devoirs = dmLoadDevoirs();
  const devoir = devoirs.find(d => d.code === code);
  if (devoir) {
    DM.current = devoir;
    dmShowIdentity();
    return;
  }

  errEl.textContent = 'Code introuvable. Vérifie auprès de ton enseignant·e.';
  btn.disabled = false;
  btn.textContent = 'Accéder au devoir temps-libre →';
}

// ── IDENTIFICATION ÉLÈVE ──────────────────────────────

function dmShowIdentity() {
  const d = DM.current;
  if (!d) return;
  document.getElementById('dm-identity-title').textContent = d.name || 'Devoir temps-libre';
  document.getElementById('dm-identity-sub').textContent =
    `Classe : ${d.className || '—'} · ${d.totalQ || '?'} questions`;

  // Vérifier date limite
  const warn = document.getElementById('dm-deadline-warn');
  if (d.deadline) {
    const now = new Date();
    const limit = new Date(d.deadline + 'T23:59:59');
    if (now > limit) {
      warn.textContent = `⚠️ La date limite était le ${dmFormatDate(d.deadline)}. Le devoir est expiré.`;
      warn.classList.remove('hidden');
      document.getElementById('dm-start-btn').disabled = true;
    } else {
      warn.classList.add('hidden');
      document.getElementById('dm-start-btn').disabled = false;
    }
  } else {
    warn.classList.add('hidden');
    document.getElementById('dm-start-btn').disabled = false;
  }

  // Vider prénom et nom, pré-remplir et verrouiller la classe
  document.getElementById('dm-prenom').value = '';
  document.getElementById('dm-nom').value = '';

  const classeInput = document.getElementById('dm-classe');
  if (d.className) {
    classeInput.value    = d.className;
    classeInput.readOnly = true;
    classeInput.style.opacity    = '0.65';
    classeInput.style.cursor     = 'not-allowed';
    classeInput.style.background = 'var(--subtle)';
  } else {
    classeInput.value    = '';
    classeInput.readOnly = false;
    classeInput.style.opacity    = '';
    classeInput.style.cursor     = '';
    classeInput.style.background = '';
  }

  showScreen('screen-dm-identity');
}

async function dmStartQuiz() {
  const prenom = document.getElementById('dm-prenom').value.trim();
  const nom    = document.getElementById('dm-nom').value.trim();
  const classe = document.getElementById('dm-classe').value.trim();

  if (!prenom || !nom || !classe) {
    alert('Merci de remplir tous les champs.');
    return;
  }

  DM.student = { prenom, nom, classe };
  DM.startTime = Date.now();
  DM.results = [];

  const d = DM.current;

  // Charger les fichiers nécessaires
  showScreen('screen-loading');
  try {
    const toLoad = [];
    (d.notions || []).forEach(n => {
      const niveau = n.niveau;
      const id = n.id;
      if (!DB.questions[niveau]) DB.questions[niveau] = {};
      if (!DB.questions[niveau][id]) {
        toLoad.push(chargerFichierThematique({ fichier: n.fichier, niveau }));
      }
    });
    if (toLoad.length) await Promise.all(toLoad);
  } catch (err) {
    afficherErreurChargement(err.message);
    return;
  }

  // Construire le pool selon la config du DM
  const pool = dmBuildPool(d);
  if (pool.length === 0) {
    alert('Impossible de charger les questions. Contacte ton enseignant·e.');
    showHome();
    return;
  }

  State.quizQuestions  = pool;
  State.currentQIndex  = 0;
  State.sessionCorrect = 0;
  State.sessionTotal   = 0;
  State.answered       = false;
  State.sessionResults = [];
  State.currentNiveau  = d.notions[0]?.niveau || 'dm';

  // Masquer la bannière examen (le DM a son propre mode)
  const banner = document.getElementById('exam-banner');
  banner.classList.add('hidden');

  document.getElementById('quiz-notion-name').textContent = d.name || 'Devoir temps-libre';
  document.getElementById('q-total').textContent = pool.length;

  // Remplacer le bouton "quitter" par un comportement neutre en mode DM
  State._dmMode = true;

  showScreen('screen-quiz');
  renderQuestion();
}

function dmBuildPool(d) {
  const lv1 = d.lv1 || 0, lv2 = d.lv2 || 0, lv3 = d.lv3 || 0;
  let pool1 = [], pool2 = [], pool3 = [];

  (d.notions || []).forEach(n => {
    const data = (DB.questions[n.niveau] || {})[n.id];
    if (!data) return;
    data.questions.forEach(q => {
      const lv = q.niveau || q.difficulte || 1;
      if (lv === 1) pool1.push(q);
      else if (lv === 2) pool2.push(q);
      else pool3.push(q);
    });
  });

  shuffle(pool1); shuffle(pool2); shuffle(pool3);
  return [
    ...pool1.slice(0, lv1),
    ...pool2.slice(0, lv2),
    ...pool3.slice(0, lv3),
  ];
}

// ── SOUMISSION RÉSULTATS ──────────────────────────────

async function dmSubmitResults() {
  const d = DM.current;
  const s = DM.student;
  const duree = Math.round((Date.now() - DM.startTime) / 1000); // secondes
  const score  = State.sessionCorrect;
  const total  = State.quizQuestions.length;
  const pct    = total > 0 ? Math.round(score / total * 100) : 0;

  const payload = {
    timestamp:    new Date().toISOString(),
    dm_code:      d.code,
    dm_name:      d.name || '',
    dm_class:     d.className || '',
    prenom:       s.prenom,
    nom:          s.nom,
    classe:       s.classe,
    score:        `${score}/${total}`,
    pourcentage:  `${pct}`,
    duree_sec:    duree,
    detail:       State.sessionResults.map((ok, i) => (ok ? '✓' : '✗')).join(''),
    notions:      (d.notions || []).map(n => n.label).join(', '),
  };

  // Afficher l'écran de confirmation immédiatement
  showScreen('screen-dm-submitted');
  document.getElementById('dm-submit-score').textContent = `${score} / ${total}`;
  document.getElementById('dm-submit-title').textContent =
    pct === 100 ? '🏆 Parfait !' : pct >= 70 ? '✅ Bien joué !' : pct >= 50 ? '💪 Pas mal !' : '📚 À retravailler';
  document.getElementById('dm-submit-sub').textContent =
    `Ton score : ${score}/${total} (${pct}%) — transmis à ${d.className || 'ton enseignant·e'}.`;
  document.getElementById('dm-submit-icon').textContent = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '📝';

  // Envoi au webhook
  // Note : mode 'no-cors' exige application/x-www-form-urlencoded (pas JSON).
  // Le Apps Script reçoit les données via e.parameter (et e.postData.contents pour le JSON brut).
  if (DM_WEBHOOK_URL && DM_WEBHOOK_URL !== 'REMPLACER_PAR_URL_APPS_SCRIPT') {
    document.getElementById('dm-submit-sending').classList.remove('hidden');
    try {
      // Encoder en form-urlencoded pour compatibilité no-cors
      const formBody = Object.entries(payload)
        .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v)))
        .join('&');
      await fetch(DM_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody,
      });
    } catch (e) {
      console.warn('DM webhook error:', e);
    }
    document.getElementById('dm-submit-sending').classList.add('hidden');
  }

  // Aussi sauvegarder en localStorage pour la vue enseignant locale
  dmSaveResultLocally(payload);

  State._dmMode = false;
}

function dmSaveResultLocally(payload) {
  const key = 'mathpratik_dm_results';
  let results = [];
  try { results = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
  results.push(payload);
  localStorage.setItem(key, JSON.stringify(results));
}

// ── INTÉGRATION DANS nextQuestion ────────────────────
// Surcharge : en mode DM, pas de "retour à zéro" sur erreur, on continue
const _origNextQuestion = nextQuestion;
window.nextQuestion = function () {
  if (!State._dmMode) { _origNextQuestion(); return; }

  const fb = document.getElementById('feedback-box');
  // En mode DM : même si erreur, on passe à la suivante
  if (State.currentQIndex >= State.quizQuestions.length - 1) {
    dmSubmitResults();
    return;
  }
  State.currentQIndex += 1;
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// En mode DM, le bouton "quitter" (←) retourne à l'accueil sans warning
const _origQuitQuiz = quitQuiz;
window.quitQuiz = function () {
  if (State._dmMode) { showHome(); return; }
  _origQuitQuiz();
};

// En mode DM, ajuster le libellé du bouton final pour parler de devoir
const _origHandleAnswer = handleAnswer;
window.handleAnswer = function (chosen, question) {
  _origHandleAnswer(chosen, question);
  if (!State._dmMode) return;
  // En mode DM, le dernier bouton dit "Terminer le devoir temps-libre" plutôt que "Voir les résultats"
  const btnNext = document.getElementById('btn-next');
  const isLast  = State.currentQIndex >= State.quizQuestions.length - 1;
  btnNext.textContent = isLast ? 'Terminer le devoir temps-libre →' : 'Suivant →';
};

// ── CRÉATION DEVOIR (enseignant) ──────────────────────

function dmInitCreate() {
  // Pré-remplir la date limite à J+7
  const d = new Date();
  d.setDate(d.getDate() + 7);
  document.getElementById('dm-deadline').value = d.toISOString().split('T')[0];

  // Construire la liste de notions
  dmBuildNotionPick();
  dmCheckForm();
}

function dmBuildNotionPick() {
  const container = document.getElementById('dm-notion-pick');
  container.innerHTML = '';

  const fichiers = (window._indexData && window._indexData.fichiers) || [];
  const autNotions = (window._indexData && window._indexData.automatismes_notions) || [];

  const all = [];

  // Notions classiques
  fichiers.forEach(f => {
    const data = (DB.questions[f.niveau] || {})[f.id];
    if (!data) return;
    all.push({
      id: f.id, niveau: f.niveau, fichier: f.fichier,
      label: data.label, icon: data.icon, color: data.color || '#6b7280',
      niveauLabel: (DB.niveaux[f.niveau] || {}).label || f.niveau,
    });
  });

  // Automatismes
  const autDB = DB.questions['automatismes'] || {};
  autNotions.forEach(n => {
    const data = autDB[n.id];
    const label = data ? data.label : n.label;
    const icon  = data ? data.icon  : n.icon;
    all.push({
      id: n.id, niveau: 'automatismes', fichier: n.fichier,
      label, icon, color: n.color || '#7c3aed',
      niveauLabel: 'Automatismes',
    });
  });

  // Grouper par niveau
  const grouped = {};
  all.forEach(n => {
    if (!grouped[n.niveauLabel]) grouped[n.niveauLabel] = [];
    grouped[n.niveauLabel].push(n);
  });

  Object.entries(grouped).forEach(([niveauLabel, notions]) => {
    const header = document.createElement('div');
    header.style.cssText = 'font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--tx3);padding:6px 4px 2px;';
    header.textContent = niveauLabel;
    container.appendChild(header);

    notions.forEach(n => {
      const item = document.createElement('div');
      item.className = 'dm-np-item';
      item.style.setProperty('--item-color', n.color);
      item.dataset.id     = n.id;
      item.dataset.niveau = n.niveau;
      item.dataset.fichier= n.fichier;
      item.dataset.label  = n.label;
      item.dataset.color  = n.color;
      item.innerHTML = `
        <div class="dm-np-cb"></div>
        <span class="dm-np-icon">${n.icon || '📐'}</span>
        <span class="dm-np-label">${escapeHtml(n.label)}</span>
        <span class="dm-np-badge">${n.niveauLabel}</span>
      `;
      item.addEventListener('click', () => {
        item.classList.toggle('selected');
        dmCheckForm();
      });
      container.appendChild(item);
    });
  });
}

function dmUpdateLevel(lv, val) {
  document.getElementById(`dm-lv${lv}-val`).textContent = val;
  const total = +document.getElementById('dm-lv1').value
              + +document.getElementById('dm-lv2').value
              + +document.getElementById('dm-lv3').value;
  document.getElementById('dm-total-q').textContent = total;
  dmCheckForm();
}

function dmCheckForm() {
  const name     = (document.getElementById('dm-name').value || '').trim();
  const className= (document.getElementById('dm-class-name').value || '').trim();
  const selected = document.querySelectorAll('#dm-notion-pick .dm-np-item.selected');
  const total    = +document.getElementById('dm-lv1').value
                 + +document.getElementById('dm-lv2').value
                 + +document.getElementById('dm-lv3').value;

  document.getElementById('dm-notions-count').textContent =
    selected.length ? `— ${selected.length} sélectionnée${selected.length > 1 ? 's' : ''}` : '';

  const ok = name && className && selected.length > 0 && total > 0;
  document.getElementById('dm-gen-btn').disabled = !ok;
}

// ── PUSH DEVOIR VERS GOOGLE SHEETS ───────────────────
async function dmPushDevoirToSheets(devoir) {
  if (!DM_WEBHOOK_URL || DM_WEBHOOK_URL === 'REMPLACER_PAR_URL_APPS_SCRIPT') return;
  try {
    const formBody = 'action=save_devoir&devoir=' + encodeURIComponent(JSON.stringify(devoir));
    await fetch(DM_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });
  } catch (e) {
    console.warn('dmPushDevoirToSheets error:', e);
  }
}

function dmGenerate() {
  const name      = document.getElementById('dm-name').value.trim();
  const className = document.getElementById('dm-class-name').value.trim();
  const deadline  = document.getElementById('dm-deadline').value;
  const lv1       = +document.getElementById('dm-lv1').value;
  const lv2       = +document.getElementById('dm-lv2').value;
  const lv3       = +document.getElementById('dm-lv3').value;

  const notions = [];
  document.querySelectorAll('#dm-notion-pick .dm-np-item.selected').forEach(item => {
    notions.push({
      id:      item.dataset.id,
      niveau:  item.dataset.niveau,
      fichier: item.dataset.fichier,
      label:   item.dataset.label,
      color:   item.dataset.color,
    });
  });

  const code   = dmGenerateCode();
  const devoir = { code, name, className, deadline, notions, lv1, lv2, lv3, totalQ: lv1+lv2+lv3, createdAt: new Date().toISOString() };

  // Sauvegarder en cache local
  const devoirs = dmLoadDevoirs();
  devoirs.push(devoir);
  dmSaveDevoirs(devoirs);

  // Envoyer au Google Sheets (source de vérité multi-postes)
  dmPushDevoirToSheets(devoir);

  // Afficher l'écran de résultat
  document.getElementById('dm-generated-code').textContent = code;

  const summary = document.getElementById('dm-gen-summary');
  summary.innerHTML = [
    { label: 'Nom', val: name },
    { label: 'Classe', val: className },
    { label: 'Date limite', val: dmFormatDate(deadline) },
    { label: 'Notions', val: notions.map(n => n.label).join(', ') },
    { label: 'Questions', val: `${lv1+lv2+lv3} (★×${lv1} ★★×${lv2} ★★★×${lv3})` },
  ].map(r => `
    <div class="dm-summary-row">
      <span class="dm-summary-label">${r.label}</span>
      <span class="dm-summary-val">${escapeHtml(String(r.val))}</span>
    </div>`).join('');

  // Stocker le devoir courant pour copier le lien
  window._lastGeneratedDevoir = devoir;

  showScreen('screen-dm-generated');
}

function dmCopyCode() {
  const code = document.getElementById('dm-generated-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('dm-copy-code-btn');
    btn.textContent = '✓ Code copié !';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 Copier le code'; btn.classList.remove('copied'); }, 2000);
  });
}

function dmCopyLink() {
  const devoir = window._lastGeneratedDevoir;
  if (!devoir) return;
  const encoded = dmEncode(devoir);
  const url = `${window.location.origin}${window.location.pathname}?dm=${encoded}`;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('dm-copy-link-btn');
    btn.textContent = '✓ Lien copié !';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '🔗 Copier le lien direct'; btn.classList.remove('copied'); }, 2000);
  });
}

// ── RÉSULTATS ENSEIGNANT ──────────────────────────────

async function dmShowResults() {
  showScreen('screen-dm-results');
  document.getElementById('dm-results-dm-name').textContent = 'Chargement…';
  document.getElementById('dm-stats-row').innerHTML = '';
  document.getElementById('dm-results-table-container').innerHTML = '';

  // Charger devoirs + résultats depuis Google Sheets
  let devoirs = [];
  let allResults = [];
  try {
    const res = await fetch(`${DM_WEBHOOK_URL}?action=get_all`);
    const data = await res.json();
    devoirs    = data.devoirs    || [];
    allResults = data.resultats  || [];
    // Mettre à jour le cache local
    dmSaveDevoirs(devoirs);
    localStorage.setItem('mathpratik_dm_results', JSON.stringify(allResults));
  } catch (e) {
    console.warn('Sheets inaccessible, fallback cache local');
    devoirs    = dmLoadDevoirs();
    try { allResults = JSON.parse(localStorage.getItem('mathpratik_dm_results') || '[]'); } catch(_) {}
  }

  window._dmAllResults = allResults;

  const select = document.getElementById('dm-results-select');
  select.innerHTML = '<option value="">— Choisir un devoir temps-libre —</option>';
  devoirs.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${d.code} · ${d.name} · ${d.className}`;
    select.appendChild(opt);
  });

  window._dmDevoirs = devoirs;

  if (devoirs.length > 0) {
    select.value = devoirs.length - 1;
    dmResultsRender(devoirs.length - 1, devoirs, allResults);
  } else {
    document.getElementById('dm-results-dm-name').textContent = 'Aucun devoir temps-libre créé';
    document.getElementById('dm-results-table-container').innerHTML =
      '<div class="dm-no-results">Aucun devoir temps-libre créé pour l\'instant.</div>';
  }
}

// Appelé depuis le <select> dans le HTML
function dmResultsSelectDM(idx) {
  const devoirs    = window._dmDevoirs    || dmLoadDevoirs();
  let   allResults = window._dmAllResults || [];
  if (!allResults.length) {
    try { allResults = JSON.parse(localStorage.getItem('mathpratik_dm_results') || '[]'); } catch(_) {}
  }
  dmResultsRender(idx, devoirs, allResults);
}

function dmResultsRender(idx, devoirs, allResults) {
  const devoir = devoirs[idx];
  if (!devoir) return;

  document.getElementById('dm-results-dm-name').textContent =
    `${devoir.code} · ${devoir.name} · ${devoir.className}`;

  const results = allResults.filter(r => r.dm_code === devoir.code);

  // Stats
  const statsRow = document.getElementById('dm-stats-row');
  if (results.length === 0) {
    statsRow.innerHTML = '';
    document.getElementById('dm-results-table-container').innerHTML =
      '<div class="dm-no-results">Aucun élève n\'a encore rendu ce devoir temps-libre.</div>';
    return;
  }

  // Calcul des scores bruts (num/den) pour chaque élève
  // Cas 1 : score = "2/5" (format texte attendu)
  // Cas 2 : score = "0.4" ou "0,4" (Google Sheets a interprété 2/5 comme division)
  // → dans le cas 2, on utilise totalQ du devoir pour retrouver num
  const rawScores = results.map(r => {
    const s = String(r.score || '').replace(',', '.');
    if (s.includes('/')) {
      const parts = s.split('/');
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      return { num: isNaN(num) ? 0 : num, den: isNaN(den) ? 0 : den, fromFraction: true };
    }
    // Google Sheets a converti en décimal — on reconstitue num à partir du ratio
    const ratio = parseFloat(s);
    if (!isNaN(ratio)) {
      const tq = devoir.totalQ || 0;
      const num = tq > 0 ? Math.round(ratio * tq) : 0;
      return { num, den: tq, fromFraction: false };
    }
    return { num: 0, den: 0, fromFraction: false };
  });

  // Total de questions du DM (den majoritaire parmi les résultats)
  const totalQ = devoir.totalQ || (rawScores.find(s => s.den > 0) || {}).den || 0;

  // Moyenne sur totalQ (ex : 7,3/10)
  const avgNum = rawScores.reduce((acc, s) => acc + s.num, 0) / rawScores.length;
  const avgSur = totalQ > 0 ? `${(avgNum).toFixed(1).replace('.',',')} / ${totalQ}` : `${(avgNum).toFixed(1).replace('.',',')}`;

  // Couleur basée sur le ratio
  const avgRatio = totalQ > 0 ? avgNum / totalQ : 0;
  const avgColor = avgRatio >= 0.7 ? 'var(--ok)' : avgRatio >= 0.5 ? '#b45309' : 'var(--err)';

  // Afficher uniquement la moyenne de classe
  statsRow.innerHTML = `
    <div style="background:var(--raised);border:1px solid var(--bd);border-radius:var(--r-sm);padding:14px 24px;text-align:center;">
      <div style="font-size:1.35rem;font-weight:800;color:${avgColor};">${avgSur}</div>
      <div style="font-size:0.75rem;color:var(--tx3);margin-top:3px;">Moyenne de la classe</div>
    </div>`;

  // Tableau — questions réussies / ratées / note
  const rows = results.map((r, i) => {
    const { num, den } = rawScores[i];
    const dmTotal = totalQ > 0 ? totalQ : den;
    const reussies = num;
    const ratees   = dmTotal > 0 ? dmTotal - num : den - num;
    const ratio    = dmTotal > 0 ? num / dmTotal : (den > 0 ? num / den : 0);
    const clsNote  = ratio >= 0.7 ? 'high' : ratio >= 0.5 ? 'mid' : 'low';
    const noteStr  = dmTotal > 0 ? `${num} / ${dmTotal}` : r.score;
    const mins  = Math.floor((r.duree_sec || 0) / 60);
    const secs  = (r.duree_sec || 0) % 60;
    return `<tr>
      <td>${escapeHtml(r.prenom)} ${escapeHtml(r.nom)}</td>
      <td>${escapeHtml(r.classe || '—')}</td>
      <td style="color:var(--ok);font-weight:700;">✅ ${reussies}</td>
      <td style="color:var(--err);font-weight:700;">❌ ${ratees}</td>
      <td><span class="dm-score-pill ${clsNote}">${noteStr}</span></td>
      <td>${mins}m${String(secs).padStart(2,'0')}s</td>
      <td style="font-size:0.78rem;color:var(--tx3);">${new Date(r.timestamp).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
    </tr>`;
  }).join('');

  document.getElementById('dm-results-table-container').innerHTML = `
    <div class="dm-results-table-wrap">
      <table class="dm-results-table">
        <thead><tr>
          <th>Élève</th><th>Classe</th><th>✅ Réussies</th><th>❌ Ratées</th><th>Note</th><th>Durée</th><th>Date</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function dmExportCSV() {
  const select  = document.getElementById('dm-results-select');
  const idx     = select.value;
  const devoirs = window._dmDevoirs || dmLoadDevoirs();
  const devoir  = devoirs[idx];
  if (!devoir) { alert('Sélectionne un devoir temps-libre d\'abord.'); return; }

  let allResults = window._dmAllResults || [];
  if (!allResults.length) {
    try { allResults = JSON.parse(localStorage.getItem('mathpratik_dm_results') || '[]'); } catch(_) {}
  }
  const results = allResults.filter(r => r.dm_code === devoir.code);

  if (results.length === 0) { alert('Aucun résultat à exporter.'); return; }

  const headers = ['Prénom','Nom','Classe','Score','Pourcentage','Durée (s)','Date','Détail'];
  const rows = results.map(r => [
    r.prenom, r.nom, r.classe, r.score, r.pourcentage,
    r.duree_sec, new Date(r.timestamp).toLocaleString('fr-FR'), r.detail
  ].map(v => `"${String(v || '').replace(/"/g,'""')}"`));

  const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `DM_${devoir.code}_${devoir.className.replace(/\s/g,'_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── INIT AUTO-DETECT AU DÉMARRAGE ────────────────────
// Injecté après loadAllData via hook
const _origLoadAllData = loadAllData;
window.loadAllData = async function () {
  await _origLoadAllData();
  dmAutoDetect();
};

