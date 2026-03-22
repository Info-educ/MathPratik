# CONSIGNES — Import d'un fichier docx dans MathPratik

> **À placer à la racine du projet MathPratik.**  
> Ce fichier est destiné à Claude : il contient toutes les instructions nécessaires pour transformer un fichier `.docx` d'exercices mathématiques en module intégré au site MathPratik.

> ⚠️ **RÈGLE ABSOLUE — FORMAT QCM UNIQUE**  
> **Toutes les questions du fichier livré doivent être au format QCM avec exactement 4 choix.**  
> Peu importe le format d'origine dans le `.docx` (question ouverte, calcul à trou, vrai/faux, construction géométrique, démonstration…) : **chaque question doit être reformulée en QCM** avant d'être intégrée.  
> Aucune question ouverte ne doit subsister dans le JSON final.

> 🔢 **RÈGLE ABSOLUE — KATEX POUR TOUTES LES NOTATIONS MATHÉMATIQUES**  
> **Toute notation mathématique, sans aucune exception, doit être rendue en KaTeX.**  
> Ne jamais laisser une expression mathématique en texte brut : pas de `x^2`, pas de `racine(x)`, pas de `1/2`, pas de `a*b`. Utiliser systématiquement la syntaxe KaTeX (`$…$` ou `$$…$$`).  
> **Cette règle s'applique à chaque champ de chaque question : `enonce_html`, `choix`, `reponse`, `explication`.**  
> Si des notations brutes subsistent dans le JSON livré, le rendu sera illisible pour les élèves.  
> **Effectuer plusieurs passes de relecture KaTeX est obligatoire avant livraison.**

> 🧠 **RÈGLE ABSOLUE — COHÉRENCE ET LOGIQUE PÉDAGOGIQUE DE CHAQUE QUESTION**  
> **Chaque question doit être relue dans son ensemble — énoncé, image, choix, réponse, explication — pour s'assurer qu'elle est cohérente, logique et qu'elle ne se contredit pas elle-même.**  
> En particulier : **si une question s'appuie sur un schéma, vérifier que la question est bien adaptée au schéma ET que la réponse n'est pas déjà visible ou lisible dans le schéma** (ce qui rendrait la question triviale et sans intérêt pédagogique).  
> Une question incohérente, mal posée ou dont la réponse est trahie par l'image est **plus nuisible qu'une question absente** : elle induit l'élève en erreur et décrédibilise l'outil.

---

## Contexte du projet

MathPratik est une application web mobile-first de révision en mathématiques (collège, cycle 4 : 5ème, 4ème, 3ème). Le projet doit rester maintenable sur **plus de 5 ans**.

### Structure du projet

```
MathPratik-main/
├── index.html               ← Interface HTML + CSS (mobile-first)
├── _config.yml              ← Requis pour GitHub Pages
├── .nojekyll
├── README.md
├── CONSIGNES_IMPORT_DOCX.md ← CE FICHIER
├── data/
│   ├── index.json           ← Registre de tous les fichiers de questions
│   ├── questions.js         ← (legacy, ne pas modifier)
│   ├── 4eme/                ← Notions pour la 4ème
│   │   ├── probabilites_4eme.json
│   │   ├── statistiques_4eme.json
│   │   └── [nouvelle_notion]_4eme.json
│   ├── 5eme/                ← Notions pour la 5ème
│   ├── 3eme/                ← Notions pour la 3ème
│   └── automatismes/        ← Automatismes (aut_01 à aut_36)
├── images/
│   ├── 4eme/                ← Images pour la 4ème
│   │   ├── probabilites/    ← Une notion = un sous-dossier
│   │   ├── statistiques/
│   │   └── [notion]/
│   ├── 5eme/
│   └── 3eme/
└── js/
    └── app.js               ← Logique applicative
```

### Niveaux disponibles

| Clé JSON | Label affiché | Emoji |
|----------|---------------|-------|
| `6eme`   | 6ème          | 🟨    |
| `5eme`   | 5ème          | 🟦    |
| `4eme`   | 4ème          | 🟩    |
| `3eme`   | 3ème          | 🟥    |
| `automatismes` | Automatismes | ⚡ |

---

## Étape 1 — Lire le fichier docx

Utiliser `pandoc` pour convertir le docx en markdown lisible :

```bash
pandoc /mnt/user-data/uploads/NOM_DU_FICHIER.docx -t markdown 2>/dev/null
```

Identifier dans le document :
- Le **niveau scolaire** ciblé (5ème / 4ème / 3ème)
- La **notion mathématique** (ex : Statistiques, Probabilités, Pythagore…)
- Les **niveaux de difficulté** des questions (★ niv1 / ★★ niv2 / ★★★ niv3)
- Tous les **types de questions** : QCM, réponse ouverte, calcul
- Toutes les **images** référencées (tableaux, diagrammes, graphiques, figures géométriques)

---

## Étape 2 — Extraire les images du docx

Extraire **toutes** les images dans le dossier `images/[niveau]/[notion]/` :

```bash
mkdir -p /home/claude/MathPratik-main/images/[niveau]/[notion]
unzip -j /mnt/user-data/uploads/NOM_DU_FICHIER.docx "word/media/*" \
  -d /home/claude/MathPratik-main/images/[niveau]/[notion]/
```

> **Important :** Les noms de fichiers restent tels quels (hash SHA1). Ils sont référencés dans le JSON via `"image": "[niveau]/[notion]/nom_du_fichier.png"`.  
> Exemple pour une notion 4ème : `"image": "4eme/probabilites/abc123.png"`

Règle absolue : **chaque figure, schéma, tableau ou diagramme du document doit apparaître tel quel dans la question correspondante, sans modification ni recréation.**

---

## Étape 3 — Créer le fichier JSON de la notion

Créer le fichier `data/[niveau]/[notion].json` en respectant **exactement** ce format :

```json
{
  "niveau": "4eme",
  "thematique": {
    "id":    "nom_notion",
    "label": "Nom affiché",
    "icon":  "📊",
    "color": "#059669"
  },
  "questions": [
    {
      "id":               "s4_001",
      "niveau":           1,
      "type":             "qcm",
      "avec_calculatrice": false,
      "enonce":           "Texte de la question",
      "image":            null,
      "choix":            ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
      "reponse":          "Réponse A",
      "explication":      "Explication affichée après réponse."
    }
  ]
}
```

### Champs obligatoires par question

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant **unique**, ex : `s4_001`, `s4_n1_001` |
| `niveau` | int | `1`, `2` ou `3` (difficulté) |
| `type` | string | Toujours `"qcm"` |
| `avec_calculatrice` | bool | `true` si la question nécessite un calcul non mental |
| `enonce` | string | Texte de la question (avec KaTeX si notation mathématique) |
| `image` | string \| null | Chemin relatif depuis `images/`, **toujours au format `[classe]/[notion]/fichier.png`** — ex : `"4eme/probabilites/abc.png"` |
| `choix` | array[4] | Exactement **4 choix** |
| `reponse` | string | Copie exacte d'un des 4 choix |
| `explication` | string | Correction détaillée |

### ⚠️ Règle fondamentale — Toutes les questions sont en QCM

**Le format QCM à 4 choix est le seul format accepté dans MathPratik.**  
Quelle que soit la forme des questions dans le `.docx` source, **toutes doivent être converties en QCM** avant intégration. Aucune exception.

---

### Règles de conversion des questions

#### Questions déjà en QCM
→ Reprendre tels quels les 4 choix et la bonne réponse.  
→ Vérifier que la liste contient bien exactement 4 propositions (ni 3, ni 5).

#### Questions « Calcul » ou « Réponse à trou »
→ Convertir en QCM avec **4 propositions numériques plausibles**.  
→ La bonne réponse doit être l'une des 4.  
→ Activer `"avec_calculatrice": true` si le calcul dépasse le calcul mental.  
→ Les distracteurs (mauvaises réponses) doivent correspondre à des **erreurs fréquentes** chez les élèves (ex : oubli du carré, inversion d'une formule, erreur de virgule…).

#### Questions « Réponse ouverte » ou « Rédaction »

> Ce type de question est le plus courant dans les exercices classiques. La conversion est **obligatoire**.

Méthode de conversion :

1. **Identifier la réponse correcte** attendue par l'énoncé.
2. **Reformuler l'énoncé** si nécessaire pour qu'il appelle une réponse parmi 4 choix (ex : "Parmi les affirmations suivantes, laquelle est vraie ?", "Quelle est la valeur de… ?").
3. **Construire 3 distracteurs crédibles** : erreurs de raisonnement fréquentes, résultats proches, confusions de formules.
4. **Placer la bonne réponse parmi les 4 choix** (ne pas toujours la mettre en premier).
5. **Rédiger une explication** de correction détaillée dans le champ `explication`.

Exemples de reformulation :

| Type original | Reformulation QCM |
|---------------|-------------------|
| "Calcule BC." | "Quelle est la longueur BC ?" + 4 valeurs numériques |
| "Démontre que ABC est rectangle." | "Le triangle ABC est-il rectangle ? Justifie." → "Parmi les affirmations suivantes, laquelle est correcte ?" + 4 affirmations |
| "Construis la médiatrice de [AB]." | "Quelle est la propriété utilisée pour tracer la médiatrice ?" + 4 définitions |
| "Donne la définition de la médiane." | "Parmi ces définitions, laquelle correspond à la médiane d'un triangle ?" + 4 définitions |
| "Rédige la preuve par Pythagore." | "Quelle égalité prouve que le triangle est rectangle ?" + 4 égalités |
| "Complète le tableau de fréquences." | "Quelle est la fréquence de la valeur X ?" + 4 valeurs |

#### Questions « Vrai / Faux »
→ Reformuler en QCM : conserver l'affirmation dans l'énoncé, proposer 4 choix dont "Vrai" et "Faux" plus deux affirmations nuancées ou voisines, **ou** transformer en question à 4 affirmations alternatives.

#### Questions de construction géométrique
→ Ne pas demander la construction (impossible en QCM).  
→ Reformuler en question de connaissance ou d'application : "Quelle propriété justifie…", "Quel outil utilise-t-on pour…", "Quelle est la mesure de l'angle…".

#### Questions de démonstration
→ Reformuler en question de raisonnement : "Parmi ces justifications, laquelle est correcte ?", "Quelle est l'étape manquante dans cette démonstration ?", "Quel théorème permet d'affirmer que… ?".

#### Questions avec figure / schéma / tableau
→ Référencer l'image extraite dans le champ `"image"`.  
→ L'énoncé textuel reste dans `"enonce"`.  
→ Ne jamais recréer une image en HTML/SVG — utiliser l'original.  
→ La question posée sur la figure doit être reformulée en QCM si elle ne l'est pas déjà.

### Règle sur la calculatrice

Activer `"avec_calculatrice": true` pour toute question impliquant :
- Une somme de plus de 4 termes
- Une multiplication à plusieurs chiffres
- Une division avec résultat décimal
- Un calcul de moyenne pondérée
- Un calcul d'angle (× 360 ÷ 100)
- Une racine carrée ou une puissance
- Tout calcul qu'un élève de collège ne ferait pas de tête

### Distribution des niveaux de difficulté

| Niveau | Signification |
|--------|---------------|
| `1` | Connaissance du cours, définitions, lectures directes de graphiques |
| `2` | Application, calculs développés, lecture approfondie, problèmes |
| `3` | Raisonnement, démonstrations, problèmes complexes, interprétation |

---

## Étape 3-ter — Cohérence et logique pédagogique 🧠 RELECTURE OBLIGATOIRE

> **Chaque question doit être lue dans sa globalité — énoncé + image + choix + réponse + explication — pour vérifier qu'elle forme un tout cohérent, logique, et pédagogiquement correct.**  
> Cette relecture est aussi importante que la conversion en QCM et que le KaTeX. Une question techniquement valide (JSON correct, 4 choix, KaTeX présent) peut rester pédagogiquement nuisible si elle est incohérente ou si la réponse est trahie.

---

### Règle 1 — Questions avec schéma, figure ou tableau : cohérence image / question

Lorsqu'une question est accompagnée d'une image (schéma géométrique, graphique, tableau de données, diagramme…), effectuer obligatoirement les vérifications suivantes :

#### 1a. La question est-elle bien adaptée au schéma ?

Vérifier que l'énoncé pose une question que le schéma permet effectivement de traiter.  
Exemples d'inadéquation à corriger :

| ❌ Inadéquation | ✅ Correction |
|----------------|--------------|
| Le schéma montre un triangle quelconque, l'énoncé demande d'appliquer Pythagore | Reformuler pour préciser que le triangle est rectangle, ou choisir une autre question |
| Le tableau ne contient pas la valeur demandée dans l'énoncé | Adapter l'énoncé à ce que le tableau contient réellement |
| Le graphique représente des effectifs, l'énoncé demande des fréquences non présentes | Vérifier que le calcul demandé est bien faisable avec les données visibles |
| L'énoncé mentionne "le point A" mais A n'est pas nommé dans la figure | Corriger le nom ou adapter l'énoncé |

#### 1b. La réponse n'est-elle pas déjà inscrite dans le schéma ?

C'est l'erreur la plus fréquente et la plus grave : **si la bonne réponse est directement lisible dans l'image, la question n'a aucune valeur pédagogique** — l'élève n'a qu'à lire pour répondre, sans réfléchir.

Cas typiques à détecter et corriger :

| ❌ Réponse visible dans le schéma | ✅ Action à prendre |
|----------------------------------|---------------------|
| La longueur BC est déjà annotée sur la figure, la question demande "Quelle est la longueur BC ?" | Reformuler : demander un calcul (via Pythagore, trigonométrie…) à partir d'autres données visibles — ou masquer la valeur dans l'énoncé et demander la démarche |
| L'angle est affiché dans la figure, la question demande sa valeur | Demander plutôt comment calculer cet angle, ou quelle propriété permet de le trouver |
| Le tableau affiche déjà la moyenne, la question demande la moyenne | Demander le calcul intermédiaire, ou retirer la moyenne du tableau si l'image peut être recadrée — sinon changer la question |
| La figure indique "triangle rectangle en A", la question demande "en quel sommet est l'angle droit ?" | Changer la question : demander une conséquence du fait que l'angle est en A, pas le fait lui-même |

> **Règle simple :** après avoir lu l'énoncé, regarder l'image comme le ferait un élève. Si la réponse correcte saute aux yeux sans aucun calcul ni raisonnement, la question doit être reformulée.

---

### Règle 2 — Cohérence interne de chaque question

Indépendamment de la présence d'un schéma, relire chaque question pour vérifier :

#### 2a. L'énoncé est-il clair et sans ambiguïté ?

- L'élève comprend immédiatement ce qui est demandé.
- Les noms de points, de variables, de figures sont cohérents entre l'énoncé, l'image et les choix (pas de "triangle ABC" dans l'énoncé et "triangle DEF" dans les choix).
- L'énoncé ne contient pas d'information contradictoire (ex : "triangle rectangle isocèle en A avec AB = 3 et AC = 5").

#### 2b. Les 4 choix sont-ils logiquement compatibles avec l'énoncé ?

- Tous les choix doivent être des réponses plausibles à la question posée (même unité, même nature, même ordre de grandeur).
- Un choix manifestement absurde (ex : une longueur négative, une probabilité > 1, une moyenne hors de l'intervalle des valeurs) doit être remplacé par un distracteur plus crédible.
- Les choix ne doivent pas se contredire entre eux de façon trop évidente (ex : "Vrai" et "Faux" ne sont pas des choix suffisamment distincts si la question n'est pas clairement binaire).

#### 2c. La réponse correcte est-elle réellement correcte ?

- Recalculer ou revérifier mentalement la bonne réponse pour s'assurer qu'elle est juste.
- En cas de doute sur la correction du document source, signaler l'anomalie dans le champ `explication` et marquer la question comme à vérifier.

#### 2d. L'explication est-elle pédagogiquement utile ?

- L'explication doit détailler **pourquoi** la bonne réponse est correcte, pas seulement l'énoncer.
- Elle doit mentionner le théorème, la définition ou la propriété mobilisée.
- Elle ne doit pas être une simple répétition de l'énoncé.

---

### Règle 3 — Relecture globale du lot de questions

Une fois toutes les questions rédigées, effectuer une relecture d'ensemble pour détecter :

- **Des questions en double** : deux questions qui posent exactement la même chose, ou avec les mêmes valeurs numériques.
- **Des questions dont la réponse est trahie par une autre question** du même fichier (ex : une question niv1 qui donne explicitement la réponse d'une question niv2).
- **Un déséquilibre de difficulté** : si toutes les questions niv1 sont en réalité des questions niv2, reclasser ou reformuler.
- **Des formulations copiées-collées** trop similaires entre questions du même niveau : varier les tournures pour maintenir l'attention de l'élève.

---

## Étape 3-bis — Notation mathématique avec KaTeX 🔢 CRITIQUE — PASSES MULTIPLES OBLIGATOIRES

> **🚨 PRIORITÉ ABSOLUE : toute notation mathématique doit être rendue en KaTeX, sans aucune exception.**  
> Une expression mathématique en texte brut dans le JSON final est une **erreur bloquante** : elle s'affichera de façon illisible pour l'élève et dégrade directement l'expérience d'apprentissage.  
>  
> **Ne jamais livrer sans avoir effectué au minimum 3 passes de relecture KaTeX** (voir protocole ci-dessous).  
>  
> Ne jamais utiliser du texte brut pour représenter des expressions mathématiques :  
> ❌ `x^2` → ✅ `$x^{2}$`  
> ❌ `racine(2)` → ✅ `$\sqrt{2}$`  
> ❌ `1/2` → ✅ `$\dfrac{1}{2}$`  
> ❌ `AB^2 + AC^2` → ✅ `$AB^2 + AC^2$`  
> ❌ `P(A) = 3/6` → ✅ `$P(A) = \dfrac{3}{6}$`

---

### 🔁 Protocole de passes KaTeX — À exécuter OBLIGATOIREMENT

Après avoir rédigé l'intégralité du JSON, effectuer les trois passes suivantes dans l'ordre :

#### Passe 1 — Détection exhaustive des notations brutes

Parcourir **toutes les questions**, **tous les champs** (`enonce_html`, chaque élément de `choix`, `reponse`, `explication`) et signaler toute expression mathématique non encadrée par `$…$` ou `$$…$$`.

Chercher spécifiquement :
- Tout chiffre collé à une lettre : `3x`, `2a`, `AB2` → doit devenir `$3x$`, `$2a$`, `$AB^2$`
- Tout exposant texte : `x^2`, `a^3`, `10^4` hors balises `$`
- Toute fraction avec `/` : `3/4`, `n/N`, `opp/hyp` hors balises `$`
- Toute racine : `racine(`, `sqrt(`, `√` hors balises `$`
- Tout opérateur : `×`, `÷`, `≤`, `≥`, `≠`, `≈` hors balises `$`
- Toute lettre de variable isolée : `x`, `a`, `n`, `N` dans un contexte mathématique
- Toute unité ou formule : `cm²`, `m²`, `km/h`, `°`

#### Passe 2 — Vérification des backslashs dans le JSON

Dans un fichier JSON, le backslash `\` doit **toujours** être échappé en `\\`.  
Parcourir tous les champs KaTeX et vérifier :

| Commande LaTeX | Dans le JSON |
|----------------|-------------|
| `\sqrt{2}` | `"\\sqrt{2}"` |
| `\dfrac{a}{b}` | `"\\dfrac{a}{b}"` |
| `\times` | `"\\times"` |
| `\leq` | `"\\leq"` |
| `\widehat{ABC}` | `"\\widehat{ABC}"` |
| `\bar{x}` | `"\\bar{x}"` |
| `\text{cm}` | `"\\text{cm}"` |
| `\triangle` | `"\\triangle"` |

Un `\` seul dans le JSON est toujours une erreur — le JSON serait invalide ou le rendu KaTeX cassé.

#### Passe 3 — Cohérence `choix` / `reponse` et virgule décimale

- Vérifier que la valeur de `reponse` est la **copie exacte** (caractère par caractère, y compris les `$` et `\\`) de l'un des 4 éléments de `choix`.
- Vérifier que la **virgule décimale française** est écrite `{,}` dans toutes les formules KaTeX :  
  ❌ `$3.14$` → ✅ `$3{,}14$`  
  ❌ `$2.5 \times 10^3$` → ✅ `$2{,}5 \times 10^{3}$`

---

### Principe général

KaTeX est la bibliothèque de rendu mathématique intégrée dans MathPratik. Elle interprète la syntaxe LaTeX pour afficher des formules typographiquement correctes dans le navigateur.

- Les expressions **en ligne** (dans une phrase) sont délimitées par `$…$`
- Les expressions **en bloc** (centrées, sur leur propre ligne) sont délimitées par `$$…$$`

Le champ `enonce` doit utiliser du KaTeX dès qu'une notation mathématique apparaît. Il devient alors un champ **`enonce_html`** (voir Étape 7).

---

### Tableau de correspondance — Notations du collège → KaTeX

#### Opérations et calculs de base

| Notation courante | KaTeX à écrire | Rendu attendu |
|-------------------|---------------|---------------|
| a au carré | `$a^2$` | a² |
| a au cube | `$a^3$` | a³ |
| a puissance n | `$a^n$` | aⁿ |
| racine carrée de 2 | `$\sqrt{2}$` | √2 |
| racine carrée de a+b | `$\sqrt{a+b}$` | √(a+b) |
| fraction a sur b | `$\dfrac{a}{b}$` | a/b (fraction verticale) |
| fraction inline | `$\frac{a}{b}$` | a/b (fraction compacte) |
| multiplication (point) | `$a \times b$` | a × b |
| division | `$a \div b$` | a ÷ b |
| valeur absolue | `$|{-3}|$` | |-3| |
| différent de | `$a \neq b$` | a ≠ b |
| inférieur ou égal | `$a \leq b$` | a ≤ b |
| supérieur ou égal | `$a \geq b$` | a ≥ b |
| environ égal | `$a \approx b$` | a ≈ b |

#### Géométrie

| Notation courante | KaTeX à écrire | Rendu attendu |
|-------------------|---------------|---------------|
| angle ABC | `$\widehat{ABC}$` | Â avec chapeau |
| angle droit | `$90°$` ou `$\ang{90}$` | 90° |
| longueur AB | `$AB$` | AB |
| vecteur AB | `$\overrightarrow{AB}$` | AB→ |
| triangle ABC | `$\triangle ABC$` | △ ABC |
| parallèle | `$(d_1) \parallel (d_2)$` | d₁ ∥ d₂ |
| perpendiculaire | `$(d_1) \perp (d_2)$` | d₁ ⊥ d₂ |
| congruence | `$\overline{AB} \equiv \overline{CD}$` | AB ≡ CD |
| degré | `$30°$` | 30° |
| pi | `$\pi$` | π |

#### Algèbre et calcul littéral

| Notation courante | KaTeX à écrire | Rendu attendu |
|-------------------|---------------|---------------|
| expression développée | `$(a+b)^2 = a^2 + 2ab + b^2$` | identité remarquable |
| équation | `$3x + 5 = 14$` | 3x + 5 = 14 |
| solution d'équation | `$x = \dfrac{14 - 5}{3}$` | fraction verticale |
| inéquation | `$2x - 1 \leq 7$` | 2x − 1 ≤ 7 |
| expression factorisée | `$(x+2)(x-3)$` | (x+2)(x−3) |

#### Statistiques et probabilités

| Notation courante | KaTeX à écrire | Rendu attendu |
|-------------------|---------------|---------------|
| moyenne | `$\bar{x}$` | x̄ |
| somme | `$\sum$` ou `$\sum_{i=1}^{n}$` | Σ |
| fréquence en % | `$f = \dfrac{n_i}{N} \times 100$` | formule fréquence |
| probabilité de A | `$P(A)$` | P(A) |
| probabilité entre 0 et 1 | `$0 \leq P(A) \leq 1$` | inégalité |
| événement contraire | `$\bar{A}$` | Ā |
| effectif total | `$N = \sum n_i$` | formule |

#### Pythagore et trigonométrie

| Notation courante | KaTeX à écrire | Rendu attendu |
|-------------------|---------------|---------------|
| Pythagore | `$BC^2 = AB^2 + AC^2$` | formule |
| racine dans Pythagore | `$BC = \sqrt{AB^2 + AC^2}$` | formule complète |
| cosinus | `$\cos(\widehat{A}) = \dfrac{\text{adj}}{\text{hyp}}$` | formule cos |
| sinus | `$\sin(\widehat{A}) = \dfrac{\text{opp}}{\text{hyp}}$` | formule sin |
| tangente | `$\tan(\widehat{A}) = \dfrac{\text{opp}}{\text{adj}}$` | formule tan |

#### Nombres relatifs et puissances

| Notation courante | KaTeX à écrire | Rendu attendu |
|-------------------|---------------|---------------|
| nombre négatif | `$-5$` | −5 |
| puissance négative | `$10^{-3}$` | 10⁻³ |
| notation scientifique | `$3{,}2 \times 10^{4}$` | 3,2 × 10⁴ |
| a puissance 0 | `$a^0 = 1$` | a⁰ = 1 |

---

### Règles de mise en œuvre

#### 1. Utiliser `enonce_html` dès qu'il y a du KaTeX

Quand l'énoncé contient des notations mathématiques, remplacer le champ `enonce` par `enonce_html` :

```json
{
  "id": "py4_n1_001",
  "enonce_html": "Dans le triangle ABC rectangle en A, on a $AB = 3$ cm et $AC = 4$ cm. Quelle est la longueur $BC$ ?",
  "choix": ["$BC = 5$ cm", "$BC = 7$ cm", "$BC = \\sqrt{7}$ cm", "$BC = 25$ cm"],
  "reponse": "$BC = 5$ cm",
  "explication": "D'après le théorème de Pythagore : $BC^2 = AB^2 + AC^2 = 9 + 16 = 25$, donc $BC = \\sqrt{25} = 5$ cm."
}
```

> **Important :** Dans le JSON, le backslash `\` des commandes LaTeX doit être **échappé** en `\\`.  
> Exemple : `\sqrt` → `"\\sqrt"`, `\frac` → `"\\frac"`, `\times` → `"\\times"`

#### 2. KaTeX s'applique à TOUS les champs textuels

Les notations mathématiques en KaTeX doivent être utilisées dans :
- `enonce` / `enonce_html` — l'énoncé de la question
- `choix` — chaque proposition de réponse
- `reponse` — la bonne réponse (doit correspondre exactement à l'un des choix)
- `explication` — la correction détaillée

#### 3. Cohérence `reponse` / `choix`

La valeur de `reponse` doit être la **copie exacte** (caractère par caractère) de l'un des éléments du tableau `choix`, KaTeX inclus.

```json
"choix":   ["$\\frac{1}{2}$", "$\\frac{1}{4}$", "$\\frac{3}{4}$", "$2$"],
"reponse": "$\\frac{1}{4}$"
```

#### 4. Virgule décimale française

En France, la virgule est le séparateur décimal. Dans KaTeX, utiliser `{,}` pour un espacement correct :

```
$3{,}14$     → 3,14  ✓
$3.14$       → 3.14  ✗ (point anglo-saxon)
```

#### 5. Texte dans les formules

Pour insérer du texte dans une formule KaTeX (unités, mots), utiliser `\text{}` :

```
$v = \dfrac{d}{t}$ avec $d$ en $\text{km}$ et $t$ en $\text{h}$
```

---

### Intégration KaTeX dans index.html (déjà en place)

KaTeX est chargé via CDN dans `index.html`. Ces balises **ne doivent pas être modifiées** :

```html
<!-- KaTeX — rendu des notations mathématiques -->
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
  crossorigin="anonymous">
<script defer
  src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
  crossorigin="anonymous"></script>
<script defer
  src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  crossorigin="anonymous"
  onload="renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$',  right: '$',  display: false}
    ]
  });"></script>
```

> `auto-render` parcourt automatiquement le DOM après chaque injection de contenu et rend toutes les expressions `$…$` et `$$…$$` trouvées.  
> Si du contenu est injecté dynamiquement via `innerHTML` dans `app.js`, appeler manuellement `renderMathInElement(element)` après l'injection.

---

### 🔢 Checklist KaTeX — À valider OBLIGATOIREMENT avant livraison

> **Ces vérifications doivent être faites en plusieurs passes, question par question, champ par champ.**  
> Ne pas se contenter d'une lecture rapide : les oublis de KaTeX sont la première source d'erreurs dans MathPratik.

#### Passes de relecture (dans l'ordre)

- [ ] **Passe 1 — Détection des notations brutes** : aucun `x^2`, `/`, `racine(`, `sqrt(`, `×`, `÷`, `≤`, `≥`, `cm²`, `°` hors balises `$`
- [ ] **Passe 2 — Backslashs JSON** : tous les `\commande` sont bien `\\commande` dans le JSON
- [ ] **Passe 3 — Cohérence choix/réponse + virgule française** : `reponse` = copie exacte d'un choix ; `{,}` partout à la place du point décimal

#### Points techniques

- [ ] Toutes les fractions sont écrites avec `\\dfrac` ou `\\frac` (jamais de `/` seul dans une expression mathématique)
- [ ] Toutes les racines carrées utilisent `\\sqrt{}`
- [ ] Les puissances utilisent `^{}` avec accolades : `x^{2}` et non `x2` ni `x^2` hors `$`
- [ ] Les backslashs sont bien échappés en `\\` dans le JSON
- [ ] La virgule décimale française est écrite `{,}` dans toutes les formules
- [ ] Le champ `enonce_html` est utilisé (et non `enonce`) dès qu'il y a du KaTeX dans l'énoncé
- [ ] Les choix et la réponse contiennent du KaTeX cohérent et identique au caractère près

#### Erreurs fréquentes à traquer spécifiquement

| ❌ Erreur courante | ✅ Forme correcte |
|--------------------|------------------|
| `BC² = AB² + AC²` (texte brut) | `$BC^{2} = AB^{2} + AC^{2}$` |
| `P(A) = 1/6` | `$P(A) = \\dfrac{1}{6}$` |
| `racine de 25` | `$\\sqrt{25}$` |
| `x = 3,14` (hors formule) | `$x = 3{,}14$` |
| `angle ABC` (texte) | `$\\widehat{ABC}$` |
| `moyenne = 12.5` | `$\\bar{x} = 12{,}5$` |
| `f = ni/N × 100` | `$f = \\dfrac{n_i}{N} \\times 100$` |
| `\sqrt{25}` dans JSON (un seul `\`) | `"\\sqrt{25}"` |

---

## Étape 4 — Tirage des 15 questions par session

Le moteur `buildQuestionPool()` dans `app.js` tire automatiquement :

| Difficulté | Nombre tiré | Pool disponible |
|-----------|-------------|-----------------|
| Niveau 1  | **7 questions** | aléatoires parmi toutes les niv1 |
| Niveau 2  | **7 questions** | aléatoires parmi toutes les niv2 |
| Niveau 3  | **1 question**  | aléatoire parmi toutes les niv3 |

> **Recommandation :** Pour un tirage varié, prévoir au minimum **20 questions par niveau** (niv1 et niv2) et **5 questions minimum en niv3**.

---

## Étape 5 — Mettre à jour index.json

Ajouter le nouveau fichier dans `data/index.json`, tableau `fichiers` :

```json
{
  "id":      "statistiques_4eme",
  "fichier": "data/4eme/statistiques_4eme.json",
  "niveau":  "4eme"
}
```

---

## Étape 6 — Vérifications avant livraison

Exécuter ces contrôles :

```python
import json, os

data = json.load(open('data/4eme/statistiques_4eme.json'))

# 1. JSON valide
print("JSON valide ✓")

# 2. Distribution des niveaux
from collections import Counter
levels = Counter(q['niveau'] for q in data['questions'])
print("Niveaux:", dict(levels))

# 3. IDs uniques
ids = [q['id'] for q in data['questions']]
assert len(ids) == len(set(ids)), "IDs dupliqués !"
print("IDs uniques ✓")

# 4. Toutes les images existent
missing = [q['image'] for q in data['questions']
           if q.get('image') and not os.path.exists(f'images/{q["image"]}')]
print("Images manquantes :", missing if missing else "aucune ✓")

# 5. Chaque question a exactement 4 choix
bad = [q['id'] for q in data['questions'] if len(q.get('choix', [])) != 4]
print("Questions sans 4 choix :", bad if bad else "aucune ✓")

# 5-bis. Aucune question de type autre que QCM
bad_type = [q['id'] for q in data['questions'] if q.get('type') != 'qcm']
print("Questions non-QCM :", bad_type if bad_type else "aucune ✓")

# 6. La réponse est dans les choix
bad2 = [q['id'] for q in data['questions'] if q['reponse'] not in q['choix']]
print("Réponse absente des choix :", bad2 if bad2 else "aucune ✓")

# 7. Vérification KaTeX — détecter les notations mathématiques non converties
import re
katex_suspects = []
raw_math_pattern = re.compile(
    r'(?<!\$)(?:x\^[0-9]|[0-9]+\^[0-9]|sqrt\(|racine\(|/[0-9]|[0-9]/[0-9])(?!\$)'
)
for q in data['questions']:
    for field in ['enonce', 'explication'] + (q.get('choix', [])):
        if isinstance(field, str) and raw_math_pattern.search(field):
            katex_suspects.append({'id': q['id'], 'champ': field[:60]})
if katex_suspects:
    print("⚠️  Notations mathématiques suspectes (non-KaTeX) :", katex_suspects)
else:
    print("KaTeX — aucune notation brute suspecte détectée ✓")

print(f"\nTotal : {len(data['questions'])} questions")
```

---

## Étape 7 — Modifications dans app.js et index.html

Ces modifications ont déjà été appliquées une fois et **n'ont pas besoin d'être refaites** pour chaque nouvelle notion. Elles sont documentées ici pour mémoire.

### app.js — Modifications permanentes déjà en place

#### 1. Support du champ `enonce_html`
Si une question a un champ `enonce_html` (HTML enrichi avec KaTeX), il est injecté via `innerHTML` au lieu de `textContent`. Après injection, `renderMathInElement(element)` est appelé pour que KaTeX rende les formules `$…$` et `$$…$$`.

```javascript
// Exemple dans app.js — rendu KaTeX après injection dynamique
if (question.enonce_html) {
  enonceEl.innerHTML = question.enonce_html;
  if (window.renderMathInElement) {
    renderMathInElement(enonceEl);
  }
} else {
  enonceEl.textContent = question.enonce;
}
```

#### 2. Support du champ `avec_calculatrice`
Si `avec_calculatrice: true`, une calculatrice est affichée sous l'image (ou seule si pas d'image). Elle supporte : `+ − × ÷ % √ x² ( )`.

#### 3. CSS calculatrice dans index.html
Le CSS de la calculatrice est injecté dans la balise `<style>` de `index.html`. Il inclut les styles `.calc-wrap`, `.calc-screen`, `.calc-grid`, `.calc-btn`, `.calc-eq`, etc.

> **Si une nouvelle notion ne nécessite pas ces fonctionnalités**, elles sont silencieuses : `avec_calculatrice: false` et pas d'`enonce_html` → comportement standard.

---

## Mémo — Couleurs suggérées par notion

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

## Checklist finale

Avant de packager le zip à livrer :

- [ ] `data/[niveau]/[notion].json` — JSON valide, toutes les questions présentes
- [ ] **Toutes les questions sont au format QCM** — aucune question ouverte, vrai/faux brut, ou construction dans le JSON
- [ ] **Toutes les questions ont exactement 4 choix** — ni 3, ni 5
- [ ] **Les distracteurs sont pédagogiquement crédibles** (erreurs fréquentes, pas de choix absurdes)
- [ ] **Cohérence pédagogique vérifiée** — chaque question relue dans sa globalité (énoncé + image + choix + réponse + explication)
- [ ] **Questions avec schéma : la question est adaptée au schéma** — les données demandées sont bien présentes dans la figure
- [ ] **Questions avec schéma : la réponse n'est pas déjà visible dans le schéma** — aucune valeur lisible directement sans calcul ni raisonnement
- [ ] **Aucune question en double** — ni énoncé identique, ni valeurs numériques identiques
- [ ] **Aucune question ne trahit la réponse d'une autre** dans le même fichier
- [ ] **Tous les noms de points, variables et figures sont cohérents** entre l'énoncé, l'image et les choix
- [ ] `images/[niveau]/[notion]/` — toutes les images du docx extraites
- [ ] `data/index.json` — nouvelle entrée ajoutée
- [ ] Vérification Python (Étape 6) — tous les contrôles passent
- [ ] Syntax check JS : `node --check js/app.js`
- [ ] Au moins 20 questions niv1, 20 questions niv2, 5 questions niv3
- [ ] Toutes les questions du document sont présentes (y compris les questions ouvertes converties en QCM)
- [ ] **Toutes les notations mathématiques sont en KaTeX** — passes 1, 2 et 3 effectuées (voir checklist Étape 3-bis)
- [ ] **Aucune expression mathématique en texte brut** dans aucun champ d'aucune question
- [ ] Les backslashs KaTeX sont bien échappés `\\` dans le JSON
- [ ] La virgule décimale est bien `{,}` et non `.` dans toutes les formules
- [ ] `renderMathInElement()` est appelé après chaque injection `innerHTML` dans app.js

---

## Exemple de session de travail type

```
1. Utilisateur envoie : exercices_pythagore_4eme.docx
2. Claude lit le docx avec pandoc
3. Claude extrait les images → images/4eme/pythagore/
4. Claude génère data/4eme/pythagore_4eme.json
   → TOUTES les questions converties en QCM à 4 choix (y compris questions ouvertes,
     calculs, démonstrations, vrai/faux, constructions géométriques)
   → Distracteurs pédagogiquement crédibles (erreurs fréquentes)
   → Chemins d'images préfixés : "4eme/pythagore/nom_fichier.png"
   → Toutes notations mathématiques converties en KaTeX
   → Backslashs échappés en \\ dans le JSON
5. Claude effectue la relecture de cohérence pédagogique (Étape 3-ter) :
   → Vérification que chaque question avec schéma est adaptée au schéma
   → Vérification que la réponse n'est pas déjà lisible dans les figures
   → Relecture de cohérence interne (énoncé / choix / réponse / explication)
   → Détection des doublons et des questions qui trahissent d'autres réponses
6. Claude effectue les 3 passes KaTeX obligatoires :
   → Passe 1 : détection et correction de toutes les notations brutes
   → Passe 2 : vérification des \\ dans le JSON
   → Passe 3 : cohérence choix/réponse et virgule décimale française {,}
7. Claude met à jour data/index.json (fichier : "data/4eme/pythagore_4eme.json")
8. Claude exécute les vérifications Python (Étape 6)
9. Claude package et livre le zip complet
```
