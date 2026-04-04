# MathPratik

> Application web mobile-first de révision en mathématiques — Cycle 3 & 4 (6ème → 3ème)  
> Hébergée sur GitHub Pages · Aucun serveur · RGPD · Durée de vie cible : 5 ans minimum

---

## Contenu actuel

| Niveau | Notions | Questions |
|--------|---------|-----------|
| 🟨 6ème | 13 notions | 1 086 questions |
| 🟦 5ème | 14 notions | 1 240 questions |
| 🟩 4ème | 13 notions | 1 180 questions |
| 🟥 3ème | Module Brevet (annales + automatismes) | — |
| ⚡ Automatismes | 36 notions | 1 080 questions (30 × 36) |
| **Total** | **76 notions** | **4 586 questions** |

---

## Mode d'entraînement adaptatif

L'application fonctionne en **mode Entraînement** : les questions progressent par niveau de difficulté et s'arrêtent quand l'élève a validé tous les objectifs.

| Étape | Niveau | Objectif |
|-------|--------|----------|
| 1 | ★ Niveau 1 — Connaissances du cours | 8 bonnes réponses |
| 2 | ★★ Niveau 2 — Application | 6 bonnes réponses |
| 3 | ★★★ Niveau 3 — Raisonnement | 1 bonne réponse |

**En cas d'erreur** : l'application notifie l'élève, affiche la bonne réponse et l'explication, puis passe à la question suivante sans remettre à zéro. Les questions ratées peuvent revenir dans la session (pool circulaire).

> Le mode Examen (retour à zéro sur erreur) est désactivé visuellement mais conservé dans le code. Voir la section [Réactiver le mode Examen](#réactiver-le-mode-examen) pour le remettre en service.

---

## Structure du projet

```
MathPratik/
├── index.html                        ← Interface HTML + CSS (mobile-first)
├── _config.yml                       ← Requis pour GitHub Pages (désactive Jekyll)
├── .nojekyll                         ← Sécurité supplémentaire anti-Jekyll
├── README.md                         ← Ce fichier
├── CONSIGNES_IMPORT_DOCX.md         ← Pipeline d'import pour Claude (IA)
├── data/
│   ├── index.json                    ← Registre de toutes les notions
│   ├── 6eme/                         ← 13 fichiers JSON
│   ├── 5eme/                         ← 14 fichiers JSON
│   ├── 4eme/                         ← 13 fichiers JSON
│   ├── 3eme/                         ← (module Brevet, pas de JSON de questions)
│   └── automatismes/                 ← 36 fichiers JSON (aut_01 à aut_36)
├── images/
│   ├── 6eme/[notion]/
│   ├── 5eme/[notion]/
│   ├── 4eme/[notion]/
│   └── 3eme/[notion]/
└── js/
    └── app.js                        ← Logique applicative (navigation, quiz, entraînement)
```

---

## Déploiement GitHub Pages

1. **Settings** → **Pages** → Source : `Deploy from a branch`
2. Branch : `main`, dossier `/ (root)` → Sauvegarder
3. URL : `https://info-educ.github.io/MathPratik/`

**Points critiques :**
- `_config.yml` et `.nojekyll` sont **obligatoires** — sans eux, GitHub Pages bloque les fichiers `.json`
- Tous les noms de dossiers sont en **minuscules** (GitHub est sensible à la casse)
- Ne jamais renommer `index.html` ni `app.js`

---

## Ouvrir en local

**Firefox** : double-clic sur `index.html` fonctionne directement.

**Chrome** (requiert un serveur local à cause de la politique CORS) :
```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

---

## Format d'une question (JSON)

Toutes les questions sont au format **QCM, exactement 4 choix** :

```json
{
  "id":                "py4_n1_001",
  "niveau":            1,
  "type":              "qcm",
  "avec_calculatrice": false,
  "enonce_html":       "Dans le triangle $ABC$ rectangle en $A$, $AB = 3$ cm et $AC = 4$ cm. Quelle est la longueur $BC$ ?",
  "image":             null,
  "choix":             ["$BC = 5$ cm", "$BC = 7$ cm", "$BC = \\sqrt{7}$ cm", "$BC = 25$ cm"],
  "reponse":           "$BC = 5$ cm",
  "explication":       "D'après Pythagore : $BC^2 = AB^2 + AC^2 = 9 + 16 = 25$, donc $BC = 5$ cm."
}
```

### Règles impératives

| Champ | Règle |
|-------|-------|
| `id` | Unique dans tout le projet. Format : `[notion]_n[niveau]_[numéro]` |
| `niveau` | `1`, `2` ou `3` |
| `choix` | Exactement **4 éléments** |
| `reponse` | Copie **exacte** (caractère par caractère) d'un des 4 choix |
| `image` | `null` ou chemin depuis `images/` : `"4eme/pythagore/fig.png"` |
| `enonce_html` | Utiliser ce champ (au lieu de `enonce`) dès qu'il y a du KaTeX |
| `avec_calculatrice` | `true` si le calcul dépasse le calcul mental |

### Niveaux de difficulté

| Niveau | Signification | Objectif entraînement |
|--------|---------------|-----------------------|
| `1` ★ | Connaissances, définitions, lectures directes | 8 validées |
| `2` ★★ | Application, calculs, problèmes | 6 validées |
| `3` ★★★ | Raisonnement, démonstrations, problèmes complexes | 1 validée |

**Chaque fichier JSON doit contenir 90 questions : 30 par niveau.**

---

## Notation mathématique — KaTeX

Toute expression mathématique doit être rendue en KaTeX, sans exception.

```
❌ x^2          ✅ $x^{2}$
❌ racine(2)    ✅ $\sqrt{2}$
❌ 1/2          ✅ $\dfrac{1}{2}$
❌ 3.14         ✅ $3{,}14$   ← virgule décimale française
```

Dans le JSON, le backslash `\` est toujours doublé : `\\sqrt`, `\\dfrac`, `\\widehat`.

---

## Ajouter une nouvelle notion

### Étape 1 — Créer le fichier JSON

```
data/[niveau]/[notion]_[niveau].json
```
Exemple : `data/4eme/trigonometrie_4eme.json`

Structure minimale :

```json
{
  "niveau": "4eme",
  "thematique": {
    "id":    "trigonometrie_4eme",
    "label": "Trigonométrie",
    "icon":  "📐",
    "color": "#0891b2"
  },
  "questions": [ ... ]
}
```

### Étape 2 — Déclarer dans `data/index.json`

```json
{
  "id":      "trigonometrie_4eme",
  "fichier": "data/4eme/trigonometrie_4eme.json",
  "niveau":  "4eme"
}
```

### Étape 3 — Extraire les images (si le .docx en contient)

```bash
mkdir -p images/4eme/trigonometrie/
unzip -j fichier.docx "word/media/*" -d images/4eme/trigonometrie/
```

Appliquer ensuite les rognages Word via le script Python décrit dans `CONSIGNES_IMPORT_DOCX.md` (Étape 2b).

### Étape 4 — Vérifier avant de déployer

```python
import json, os
from collections import Counter

data = json.load(open('data/4eme/trigonometrie_4eme.json'))
qs   = data['questions']

levels = Counter(q['niveau'] for q in qs)
print("Niveaux :", dict(levels))          # doit afficher {1: 30, 2: 30, 3: 30}

ids = [q['id'] for q in qs]
assert len(ids) == len(set(ids)), "IDs dupliqués !"

missing = [q['image'] for q in qs if q.get('image') and not os.path.exists(f'images/{q["image"]}')]
print("Images manquantes :", missing or "aucune ✓")

bad  = [q['id'] for q in qs if len(q.get('choix', [])) != 4]
bad2 = [q['id'] for q in qs if q['reponse'] not in q['choix']]
print("Questions sans 4 choix :", bad or "aucune ✓")
print("Réponse absente des choix :", bad2 or "aucune ✓")
print(f"Total : {len(qs)} questions")
```

---

## Import depuis un fichier .docx (avec Claude)

`CONSIGNES_IMPORT_DOCX.md` contient le pipeline complet. Résumé :

1. Envoyer le `.docx` à Claude avec `CONSIGNES_IMPORT_DOCX.md`
2. Claude extrait le texte (pandoc), les images (unzip + rognages Pillow), convertit tout en QCM
3. Claude génère `data/[niveau]/[notion].json` (90 questions) et met à jour `data/index.json`
4. Claude exécute les vérifications Python et livre un `.zip` prêt à déployer

---

## Réactiver le mode Examen

Le mode Examen (une erreur = retour à zéro) est masqué mais conservé dans le code.

**Dans `index.html`** — trouver :
```html
<div class="mode-selector" id="mode-selector" style="display:none !important;">
```
Supprimer l'attribut `style`.

**Dans `js/app.js`** — trouver :
```javascript
selectedMode: 'entrainement',
```
Remplacer par :
```javascript
selectedMode: 'examen',
```

---

## Ajuster les objectifs du mode Entraînement

Dans `js/app.js`, chercher dans la déclaration de `State` :

```javascript
target1: 8, target2: 6, target3: 1,  // objectifs
```

Modifier les valeurs selon les besoins pédagogiques. Le reste de l'application (barre de progression, récap résultats, logique de passage de niveau) s'adapte automatiquement.

---

## Mémo — Couleurs et icônes par notion

| Notion | Icône | Couleur |
|--------|-------|---------|
| Statistiques | 📊 | `#059669` |
| Probabilités | 🎲 | `#7c3aed` |
| Pythagore | 📐 | `#0284c7` |
| Trigonométrie | 📐 | `#0891b2` |
| Fonctions | 📈 | `#dc2626` |
| Équations | ✏️ | `#d97706` |
| Géométrie | 🔷 | `#4f46e5` |
| Fractions | ½ | `#c2410c` |
| Nombres relatifs | ± | `#0c4a6e` |
| Calcul littéral | 🔡 | `#1a1a2e` |
| Théorème de Thalès | 📏 | `#065f46` |

---

## Données & RGPD

- Stockage 100% **localStorage** — aucune donnée transmise à un serveur externe
- Aucun cookie, aucun tracker, aucune donnée personnelle collectée
- Réinitialisation accessible depuis le bouton ⚙ dans l'application
- Conforme au cadre RGPD pour un usage en établissement scolaire
