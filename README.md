# MathPratik — Guide de maintenance

## Structure du projet

```
MathPratik/
├── index.html          ← Interface HTML + CSS
├── _config.yml         ← Requis pour GitHub Pages
├── README.md           ← Ce fichier
├── data/
│   └── questions.js    ← BANQUE DE QUESTIONS (seul fichier à éditer pour les contenus)
└── js/
    └── app.js          ← Logique applicative (navigation, quiz, scores)
```

---

## Déploiement sur GitHub Pages

### Structure du dépôt GitHub à respecter :
```
(racine du dépôt)
├── _config.yml
├── index.html
├── data/
│   └── questions.js
└── js/
    └── app.js
```

### Activer GitHub Pages :
1. Aller dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** (ou master), dossier **/ (root)**
4. Sauvegarder → l'URL sera `https://votre-compte.github.io/nom-du-repo/`

### ⚠️ Points critiques :
- Le fichier `_config.yml` est **obligatoire** — il désactive Jekyll qui bloquerait les fichiers JS
- Les noms de dossiers `data/` et `js/` sont en **minuscules** (GitHub est sensible à la casse)
- Ne pas renommer les fichiers

---

## Ouvrir en local (sur votre ordinateur)

**Firefox** : double-cliquer sur `index.html` fonctionne directement.

**Chrome** : lancer un mini-serveur dans le dossier du projet :
```bash
python3 -m http.server 8080
```
Puis ouvrir `http://localhost:8080`

---

## Ajouter des questions

Ouvrir `data/questions.js` et localiser le niveau + la notion voulue.

Chaque question suit ce modèle :
```js
{
  id: "5nc11",                      // Identifiant UNIQUE
  enonce: "Calcule 3 + 4",         // Texte de la question
  type: "qcm",
  choix: ["7", "8", "6", "5"],     // Exactement 4 choix
  reponse: "7",                     // Copie exacte d'un des choix
  explication: "3 + 4 = 7"         // Explication affichée après réponse
},
```

---

## Données & RGPD

- Stockage 100% **localStorage** du navigateur — aucune donnée transmise
- Clé : `mathpratik_progress`
- Réinitialisation depuis le bouton ⚙ dans l'app
