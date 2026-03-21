# MathPratik — Guide de maintenance

> Application web mobile-first de révision en mathématiques — Cycle 4 (5ème, 4ème, 3ème)
> Durée de vie cible : 5 ans minimum

---

## Structure du projet

```
MathPratik-main/
├── index.html                        ← Interface HTML + CSS (mobile-first)
├── _config.yml                       ← Requis pour GitHub Pages (désactive Jekyll)
├── .nojekyll                         ← Sécurité supplémentaire anti-Jekyll
├── README.md                         ← Ce fichier
├── CONSIGNES_IMPORT_DOCX.md         ← Instructions pour Claude (import de nouvelles notions)
├── data/
│   ├── index.json                    ← REGISTRE de toutes les notions (à mettre à jour à chaque ajout)
│   ├── questions.js                  ← Legacy — ne pas modifier
│   ├── fractions_4eme.json           ← Notion : Fractions (4ème)
│   ├── equations_4eme.json           ← Notion : Équations (4ème)
│   ├── probabilites_4eme.json        ← Notion : Probabilités (4ème)
│   ├── statistiques_4eme.json        ← Notion : Statistiques (4ème)
│   └── aut_XX_[nom].json            ← Automatismes (36 fichiers)
├── images/
│   ├── probabilites/                 ← Images extraites du docx probabilités
│   └── stats/                        ← Images extraites du docx statistiques
└── js/
    └── app.js                        ← Logique applicative (navigation, quiz, scores)
```

---

## Déploiement sur GitHub Pages

### Activer GitHub Pages :
1. Aller dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** (ou master), dossier **/ (root)**
4. Sauvegarder → l'URL sera `https://votre-compte.github.io/nom-du-repo/`

### ⚠️ Points critiques :
- `_config.yml` et `.nojekyll` sont **obligatoires** — ils empêchent Jekyll de bloquer les fichiers `.json` et `.js`
- Les noms de dossiers `data/`, `images/` et `js/` sont en **minuscules** (GitHub est sensible à la casse)
- Ne jamais renommer ces dossiers ni les fichiers principaux (`index.html`, `app.js`)

---

## Ouvrir en local (sur votre ordinateur)

**Firefox** : double-cliquer sur `index.html` fonctionne directement.

**Chrome** : lancer un mini-serveur dans le dossier du projet :
```bash
python3 -m http.server 8080
```
Puis ouvrir `http://localhost:8080`

---

## Architecture des contenus — Règles actuelles

### Chaque notion = un fichier JSON indépendant

Depuis la refonte, les questions ne sont **plus** dans `questions.js` (legacy). Chaque notion mathématique a son propre fichier dans `data/` et est déclarée dans `data/index.json`.

### Niveaux disponibles

| Clé JSON | Label affiché | Emoji |
|----------|---------------|-------|
| `5eme`   | 5ème          | 🟦    |
| `4eme`   | 4ème          | 🟩    |
| `3eme`   | 3ème          | 🟥    |
| `automatismes` | Automatismes | ⚡ |

### Notions actuellement intégrées (cycle 4)

| Fichier | Niveau | Nb questions |
|---------|--------|-------------|
| `fractions_4eme.json` | 4ème | 90 |
| `equations_4eme.json` | 4ème | — |
| `probabilites_4eme.json` | 4ème | — |
| `statistiques_4eme.json` | 4ème | — |

---

## Format d'une question (JSON)

Toutes les questions sont au format **QCM avec exactement 4 choix** :

```json
{
  "id":               "f4_n1_001",
  "niveau":           1,
  "type":             "qcm",
  "avec_calculatrice": false,
  "enonce":           "Texte de la question",
  "image":            null,
  "choix":            ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
  "reponse":          "Réponse A",
  "explication":      "Explication affichée après la réponse."
}
```

### Règles impératives

| Champ | Règle |
|-------|-------|
| `id` | Unique dans tout le projet. Format recommandé : `[notion]_n[niveau]_[numéro]` ex: `f4_n1_001` |
| `niveau` | `1` (cours), `2` (application), `3` (raisonnement) |
| `choix` | Exactement **4 éléments** |
| `reponse` | Doit être la **copie exacte** d'un des 4 choix |
| `image` | `null` si pas d'image, sinon chemin relatif depuis `images/` ex: `"stats/abc.png"` |
| `avec_calculatrice` | `true` si la question nécessite un calcul non mental (divisions à virgule, grandes multiplications, racines…) |

### Niveaux de difficulté

| Niveau | Signification |
|--------|---------------|
| `1` ★ | Connaissance du cours, définitions, lectures directes |
| `2` ★★ | Application, calculs développés, problèmes |
| `3` ★★★ | Raisonnement, démonstrations, problèmes complexes |

### Tirage automatique par session (15 questions)

Le moteur tire aléatoirement à chaque session :
- **7 questions** de niveau 1
- **7 questions** de niveau 2
- **1 question** de niveau 3

→ Prévoir au minimum **20 questions par niveau 1 et 2**, et **5 questions minimum en niveau 3**.

---

## Ajouter une nouvelle notion

### Étape 1 — Créer le fichier JSON

Créer `data/[notion]_[niveau].json` en respectant le format ci-dessus.
Nommage du fichier : tout en minuscules, underscores, sans accents. Ex : `pythagore_4eme.json`

Structure minimale du fichier :

```json
{
  "niveau": "4eme",
  "thematique": {
    "id":    "pythagore_4eme",
    "label": "Théorème de Pythagore",
    "icon":  "📐",
    "color": "#0284c7"
  },
  "questions": [ ... ]
}
```

### Étape 2 — Déclarer dans index.json

Ajouter une entrée dans le tableau `fichiers` de `data/index.json` :

```json
{
  "id":      "pythagore_4eme",
  "fichier": "data/pythagore_4eme.json",
  "niveau":  "4eme"
}
```

### Étape 3 — Extraire les images (si le document en contient)

```bash
mkdir -p images/[notion]/
unzip -j fichier.docx "word/media/*" -d images/[notion]/
```

Les noms de fichiers restent tels quels (hash). Les référencer dans le JSON via `"image": "[notion]/nom.png"`.

### Étape 4 — Vérification avant déploiement

```python
import json, os
from collections import Counter

data = json.load(open('data/[notion]_[niveau].json'))
print("JSON valide ✓")

levels = Counter(q['niveau'] for q in data['questions'])
print("Niveaux:", dict(levels))

ids = [q['id'] for q in data['questions']]
assert len(ids) == len(set(ids)), "IDs dupliqués !"
print("IDs uniques ✓")

missing = [q['image'] for q in data['questions']
           if q.get('image') and not os.path.exists(f'images/{q["image"]}')]
print("Images manquantes :", missing if missing else "aucune ✓")

bad = [q['id'] for q in data['questions'] if len(q.get('choix', [])) != 4]
print("Questions sans 4 choix :", bad if bad else "aucune ✓")

bad2 = [q['id'] for q in data['questions'] if q['reponse'] not in q['choix']]
print("Réponse absente des choix :", bad2 if bad2 else "aucune ✓")

print(f"Total : {len(data['questions'])} questions")
```

---

## Import depuis un fichier .docx (avec Claude)

Le fichier `CONSIGNES_IMPORT_DOCX.md` contient toutes les instructions détaillées pour confier l'import à Claude (IA). Le workflow est :

1. Envoyer le fichier `.docx` à Claude avec le fichier `CONSIGNES_IMPORT_DOCX.md`
2. Claude lit le document, extrait les images, convertit toutes les questions en QCM
3. Claude génère le fichier `.json` et met à jour `index.json`
4. Claude exécute les vérifications automatiques (étape 4 ci-dessus)
5. Claude livre un `.zip` complet prêt à déployer

---

## Mémo — Couleurs et icônes suggérées par notion

| Notion | Icon | Couleur |
|--------|------|---------|
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

- Stockage 100% **localStorage** du navigateur — aucune donnée transmise à un serveur
- Clé de stockage : `mathpratik_progress`
- Réinitialisation disponible depuis le bouton ⚙ dans l'application
- Aucun cookie, aucun tracker, aucune donnée personnelle collectée
